jest.mock('../../repositories/chatRepository');
jest.mock('../../services/mediaService');

const chatRepository = require('../../repositories/chatRepository');
const mediaService = require('../../services/mediaService');
const chatService = require('../../services/chatService');

const deletedMessage = () => ({
  _id: 'm1',
  sender: 'u1',
  isDeleted: true,
  attachments: [],
  addReaction: jest.fn(),
  markAsRead: jest.fn(),
  save: jest.fn(),
});

describe('chatService soft-delete guards', () => {
  test.each([
    ['editMessage', { messageId: 'm1', userId: 'u1', message: 'edited' }],
    ['addReaction', { messageId: 'm1', userId: 'u1', emoji: '👍' }],
    ['markRead', { messageId: 'm1', userId: 'u1' }],
  ])('%s rejects soft-deleted messages with 404', async (method, args) => {
    const message = deletedMessage();
    chatRepository.findById.mockResolvedValue(message);

    await expect(chatService[method](args)).rejects.toMatchObject({ status: 404 });
    expect(message.save).not.toHaveBeenCalled();
    expect(message.addReaction).not.toHaveBeenCalled();
    expect(message.markAsRead).not.toHaveBeenCalled();
  });

  test('addReaction rejects missing or oversized emoji before touching the DB', async () => {
    await expect(
      chatService.addReaction({ messageId: 'm1', userId: 'u1', emoji: 'x'.repeat(100) })
    ).rejects.toMatchObject({ status: 400 });
    await expect(chatService.addReaction({ messageId: 'm1', userId: 'u1' })).rejects.toMatchObject({
      status: 400,
    });
    expect(chatRepository.findById).not.toHaveBeenCalled();
  });
});

describe('chatService.sendMessage', () => {
  test('rejects over-long messages before uploading any attachment', async () => {
    await expect(
      chatService.sendMessage({
        userId: 'u1',
        message: 'a'.repeat(2001),
        files: [{ mimetype: 'image/png', size: 10, buffer: Buffer.from('x') }],
      })
    ).rejects.toMatchObject({ status: 400 });
    expect(mediaService.uploadAttachments).not.toHaveBeenCalled();
  });

  test('rejects non-string message payloads', async () => {
    await expect(
      chatService.sendMessage({ userId: 'u1', message: ['not', 'text'] })
    ).rejects.toMatchObject({ status: 400 });
  });

  test('rejects replies to deleted messages', async () => {
    chatRepository.findById.mockResolvedValue(deletedMessage());
    await expect(
      chatService.sendMessage({ userId: 'u1', message: 'hi', replyTo: 'm1' })
    ).rejects.toMatchObject({ status: 404 });
    expect(chatRepository.create).not.toHaveBeenCalled();
  });
});

describe('chatService attachment cleanup', () => {
  test('soft delete clears attachment references after removing the files', async () => {
    const message = {
      sender: { toString: () => 'u1' },
      isDeleted: false,
      attachments: [{ url: 'https://res.cloudinary.com/x/upload/v1/chat/a.png' }],
      save: jest.fn(),
    };
    chatRepository.findById.mockResolvedValue(message);
    mediaService.deleteByUrl.mockResolvedValue();

    await chatService.deleteMessage({ messageId: 'm1', userId: 'u1', isAdmin: false });

    expect(mediaService.deleteByUrl).toHaveBeenCalledTimes(1);
    expect(message.isDeleted).toBe(true);
    expect(message.attachments).toEqual([]);
    expect(message.save).toHaveBeenCalled();
  });

  test('orphan cleanup keeps only the attachments that failed to delete', async () => {
    const ok = { url: 'https://res.cloudinary.com/x/upload/v1/chat/ok.png' };
    const failing = { url: 'https://res.cloudinary.com/x/upload/v1/chat/fail.png' };
    const message = { attachments: [ok, failing], save: jest.fn() };
    chatRepository.findDeletedWithAttachments.mockResolvedValue([message]);
    mediaService.deleteByUrl.mockImplementation(async (url) => {
      if (url === failing.url) throw new Error('cloudinary down');
    });

    const result = await chatService.cleanupOrphanedAttachments();

    expect(result).toMatchObject({ deletedCount: 1, errorCount: 1, totalProcessed: 1 });
    expect(message.attachments).toEqual([failing]);
    expect(message.save).toHaveBeenCalled();
  });
});
