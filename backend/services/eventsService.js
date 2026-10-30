const eventRepository = require('../repositories/eventRepository');
const { ServiceError } = require('./serviceError');
const mediaService = require('./mediaService');
const { escapeRegex, parsePagination } = require('./queryUtils');
const { buildStatusFilter, withEffectiveStatus } = require('./scheduleStatus');

const listEvents = async ({ status, search, page, limit }) => {
  const now = new Date();
  const conditions = [];

  if (status && status !== 'All') {
    // Unknown statuses fall back to an exact match, which simply returns nothing
    conditions.push(buildStatusFilter(status, now) || { status });
  }

  if (search && typeof search === 'string') {
    const escaped = escapeRegex(search);
    conditions.push({
      $or: [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { location: { $regex: escaped, $options: 'i' } }
      ]
    });
  }

  const query = conditions.length === 0 ? {} : conditions.length === 1 ? conditions[0] : { $and: conditions };

  if (page !== undefined && limit !== undefined) {
    const { page: parsedPage, limit: parsedLimit, skip } = parsePagination({
      page,
      limit,
      defaultLimit: 9,
      maxLimit: 100
    });

    const totalItems = await eventRepository.count(query);
    const totalPages = Math.ceil(totalItems / parsedLimit);

    const events = await eventRepository
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);

    return {
      events: events.map((event) => withEffectiveStatus(event, now)),
      totalItems,
      totalPages,
      page: parsedPage
    };
  }

  const events = await eventRepository.find(query).sort({ date: -1 });
  return events.map((event) => withEffectiveStatus(event, now));
};

const createEvent = async ({ data, file }) => {
  const {
    title,
    description,
    date,
    location,
    status,
    registerUrl,
    operatingHours,
    contactInfo,
    mapLocation
  } = data;

  if (!title || !description || !date || !location) {
    throw new ServiceError('All fields are required.', 400);
  }

  const eventDate = new Date(date);
  if (Number.isNaN(eventDate.getTime())) {
    throw new ServiceError('Invalid date format.', 400);
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (eventDate < now) {
    throw new ServiceError('Event date cannot be in the past.', 400);
  }

  if (registerUrl) {
    try {
      new URL(registerUrl);
    } catch (error) {
      throw new ServiceError('Invalid registration URL format.', 400);
    }
  }

  let image;
  if (file) {
    image = await mediaService.uploadSingleImage(file, { folder: 'events' });
  }

  let parsedContactInfo;
  let parsedMapLocation;

  if (contactInfo) {
    try {
      parsedContactInfo = JSON.parse(contactInfo);
    } catch (error) {
      throw new ServiceError('Invalid contactInfo JSON format', 400);
    }
  }

  if (mapLocation) {
    try {
      parsedMapLocation = JSON.parse(mapLocation);
    } catch (error) {
      throw new ServiceError('Invalid mapLocation JSON format', 400);
    }
  }

  const event = await eventRepository.create({
    title,
    description,
    date,
    location,
    status: status || 'Upcoming',
    registerUrl,
    image,
    operatingHours,
    contactInfo: parsedContactInfo,
    mapLocation: parsedMapLocation
  });

  return event;
};

const updateEvent = async ({ eventId, data, file }) => {
  const {
    title,
    description,
    date,
    location,
    status,
    registerUrl,
    operatingHours,
    contactInfo,
    mapLocation,
    removeImage
  } = data;

  if (!title || !description || !date || !location || !status) {
    throw new ServiceError('Missing required fields.', 400);
  }

  const eventDate = new Date(date);
  if (Number.isNaN(eventDate.getTime())) {
    throw new ServiceError('Invalid date format.', 400);
  }

  if (registerUrl) {
    try {
      new URL(registerUrl);
    } catch (error) {
      throw new ServiceError('Invalid registration URL format.', 400);
    }
  }

  const event = await eventRepository.findById(eventId);
  if (!event) {
    throw new ServiceError('Event not found.', 404);
  }

  if (file) {
    // Upload first: if the upload fails the existing image must stay intact
    const previousImage = event.image;
    event.image = await mediaService.uploadSingleImage(file, { folder: 'events' });

    if (previousImage && previousImage.public_id) {
      try {
        await mediaService.deleteByPublicId(previousImage.public_id);
      } catch (error) {
        // Ignore delete errors
      }
    }
  } else if (removeImage === 'true') {
    if (event.image && event.image.public_id) {
      try {
        await mediaService.deleteByPublicId(event.image.public_id);
      } catch (error) {
        // Ignore delete errors
      }
    }
    event.image = undefined;
  }

  let parsedContactInfo;
  let parsedMapLocation;

  if (contactInfo) {
    try {
      parsedContactInfo = JSON.parse(contactInfo);
    } catch (error) {
      throw new ServiceError('Invalid contactInfo JSON format', 400);
    }
  }

  if (mapLocation) {
    try {
      parsedMapLocation = JSON.parse(mapLocation);
    } catch (error) {
      throw new ServiceError('Invalid mapLocation JSON format', 400);
    }
  }

  event.title = title;
  event.description = description;
  event.date = date;
  event.location = location;
  event.status = status;
  event.registerUrl = registerUrl;
  event.operatingHours = operatingHours;
  event.contactInfo = parsedContactInfo;
  event.mapLocation = parsedMapLocation;

  await event.save();
  return event;
};

const deleteEvent = async ({ eventId }) => {
  const event = await eventRepository.findById(eventId);
  if (!event) {
    throw new ServiceError('Event not found.', 404);
  }

  if (event.image && event.image.public_id) {
    try {
      await mediaService.deleteByPublicId(event.image.public_id);
    } catch (error) {
      // Ignore delete errors
    }
  }

  await event.deleteOne();
  return { message: 'Event deleted.' };
};

module.exports = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
