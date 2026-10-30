const chatRepository = require('../repositories/chatRepository');
const { ServiceError } = require('./serviceError');
const mediaService = require('./mediaService');
const { parsePagination } = require('./queryUtils');

const ALLOWED_CHAT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EMOJI_LENGTH = 16;

// Soft-deleted messages are hidden from every listing, so they must not be editable,
// reactable or markable either.
const findActiveMessage = async (messageId) => {
  const message = await chatRepository.findById(messageId);
  if (!message || message.isDeleted) {
    throw new ServiceError('Message not found', 404);
  }
  return message;
};

const listMessages = async ({ page, limit }) => {
  const { page: parsedPage, limit: parsedLimit, skip } = parsePagination({
    page,
    limit,
    defaultLimit: 50,
    maxLimit: 100
  });

  const messages = await chatRepository
    .find({ isDeleted: false })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .populate('sender', 'name profilePicture')
    .populate('replyTo')
    .lean();

  const total = await chatRepository.count({ isDeleted: false });

  return {
    messages: messages.reverse(),
    pagination: {
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit)
    }
  };
};

const searchMessages = async ({ query }) => {
  if (!query || !query.trim()) {
    throw new ServiceError('Search query is required', 400);
  }

  const messages = await chatRepository
    .find({ $text: { $search: query }, isDeleted: false }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('sender', 'name profilePicture')
    .limit(20)
    .lean();

  return messages;
};

const sendMessage = async ({ userId, message, replyTo, files }) => {
  if (message !== undefined && message !== null && typeof message !== 'string') {
    throw new ServiceError('Message must be text', 400);
  }

  // Validate before uploading so rejected messages don't leave orphaned files in Cloudinary
  if (message && message.length > MAX_MESSAGE_LENGTH) {
    throw new ServiceError(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`, 400);
  }

  const hasFiles = Boolean(files && files.length > 0);
  if (!message?.trim() && !hasFiles) {
    throw new ServiceError('Message cannot be empty', 400);
  }

  if (replyTo) {
    await findActiveMessage(replyTo);
  }

  const attachments = hasFiles
    ? await mediaService.uploadAttachments(files, {
        folder: 'chat_attachments',
        allowedMimeTypes: ALLOWED_CHAT_MIME_TYPES
      })
    : [];

  const chatMessage = await chatRepository.create({
    sender: userId,
    message: message || (attachments.length > 0 ? '📎 Attachment' : ''),
    attachments,
    replyTo
  });

  const populatedMessage = await chatRepository
    .findById(chatMessage._id)
    .populate('sender', 'name profilePicture')
    .populate('replyTo')
    .lean();

  return populatedMessage;
};

const editMessage = async ({ messageId, userId, message }) => {
  const chatMessage = await findActiveMessage(messageId);

  if (chatMessage.sender.toString() !== userId.toString()) {
    throw new ServiceError('Not authorized to edit this message', 403);
  }

  if (typeof message !== 'string' || !message.trim()) {
    throw new ServiceError('Message cannot be empty', 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new ServiceError(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`, 400);
  }

  chatMessage.message = message;
  chatMessage.edited = true;
  chatMessage.editedAt = new Date();
  await chatMessage.save();

  const updatedMessage = await chatRepository
    .findById(chatMessage._id)
    .populate('sender', 'name profilePicture')
    .populate('replyTo')
    .lean();

  return updatedMessage;
};

const deleteMessage = async ({ messageId, userId, isAdmin, permanent = false }) => {
  const message = await chatRepository.findById(messageId);
  if (!message) {
    throw new ServiceError('Message not found', 404);
  }

  if (permanent && !isAdmin) {
    throw new ServiceError('Only admins can permanently delete messages', 403);
  }

  if (!permanent && message.sender.toString() !== userId.toString() && !isAdmin) {
    throw new ServiceError('Not authorized to delete this message', 403);
  }

  if (message.attachments && message.attachments.length > 0) {
    for (const attachment of message.attachments) {
      try {
        await mediaService.deleteByUrl(attachment.url);
      } catch (error) {
        // Ignore delete errors
      }
    }
  }

  if (permanent) {
    await chatRepository.deleteById(messageId);
    return { message: 'Message permanently deleted successfully' };
  }

  // The files are gone from Cloudinary now; drop the dangling references so the orphan
  // cleanup job does not keep re-processing this message forever.
  message.attachments = [];
  message.isDeleted = true;
  await message.save();
  return { message: 'Message deleted successfully' };
};

const addReaction = async ({ messageId, userId, emoji }) => {
  if (typeof emoji !== 'string' || !emoji.trim() || emoji.length > MAX_EMOJI_LENGTH) {
    throw new ServiceError('A valid emoji is required', 400);
  }

  const message = await findActiveMessage(messageId);

  await message.addReaction(userId, emoji);

  const updatedMessage = await chatRepository
    .findById(message._id)
    .populate('sender', 'name profilePicture')
    .populate('reactions.user', 'name profilePicture')
    .lean();

  return updatedMessage;
};

const markRead = async ({ messageId, userId }) => {
  const message = await findActiveMessage(messageId);

  await message.markAsRead(userId);

  const updatedMessage = await chatRepository
    .findById(message._id)
    .populate('sender', 'name profilePicture')
    .populate('readBy.user', 'name profilePicture')
    .lean();

  return updatedMessage;
};

const cleanupOrphanedAttachments = async () => {
  const deletedMessages = await chatRepository.findDeletedWithAttachments();

  let deletedCount = 0;
  let errorCount = 0;

  for (const message of deletedMessages) {
    if (message.attachments && message.attachments.length > 0) {
      const remaining = [];
      for (const attachment of message.attachments) {
        try {
          await mediaService.deleteByUrl(attachment.url);
          deletedCount += 1;
        } catch (error) {
          errorCount += 1;
          remaining.push(attachment);
        }
      }
      // Keep only the attachments that failed so the next run retries them, not everything
      message.attachments = remaining;
      await message.save();
    }
  }

  return {
    message: 'Cleanup completed',
    deletedCount,
    errorCount,
    totalProcessed: deletedMessages.length
  };
};

module.exports = {
  listMessages,
  searchMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  markRead,
  cleanupOrphanedAttachments
};
