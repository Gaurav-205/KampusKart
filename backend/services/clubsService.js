const clubRepository = require('../repositories/clubRepository');
const { ServiceError } = require('./serviceError');
const mediaService = require('./mediaService');
const { escapeRegex, parsePagination } = require('./queryUtils');
const { buildClubStatusFilter, withEffectiveClubStatus } = require('./scheduleStatus');

const listClubs = async ({ status, search, page, limit }) => {
  const now = new Date();
  const conditions = [];

  if (status && status !== 'all') {
    conditions.push(buildClubStatusFilter(status, now) || { status });
  }

  if (search && typeof search === 'string') {
    const escaped = escapeRegex(search);
    conditions.push({
      $or: [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { clubName: { $regex: escaped, $options: 'i' } }
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

    const totalItems = await clubRepository.count(query);
    const totalPages = Math.ceil(totalItems / parsedLimit);

    const clubs = await clubRepository
      .find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parsedLimit);

    return {
      clubs: clubs.map((club) => withEffectiveClubStatus(club, now)),
      totalItems,
      totalPages,
      page: parsedPage
    };
  }

  const clubs = await clubRepository.find(query).sort({ startDate: -1 });
  return clubs.map((club) => withEffectiveClubStatus(club, now));
};

const createClub = async ({ data, file }) => {
  const { title, description, clubName, startDate, endDate, formUrl, contactInfo, status } = data;

  if (!title || !description || !clubName || !startDate || !endDate || !formUrl) {
    throw new ServiceError('All fields are required.', 400);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ServiceError('Invalid date format.', 400);
  }
  if (start >= end) {
    throw new ServiceError('Start date must be before end date.', 400);
  }

  try {
    new URL(formUrl);
  } catch (error) {
    throw new ServiceError('Invalid form URL format.', 400);
  }

  let image;
  if (file) {
    image = await mediaService.uploadSingleImage(file, { folder: 'clubs' });
  }

  let parsedContactInfo;
  if (contactInfo) {
    try {
      parsedContactInfo = JSON.parse(contactInfo);
    } catch (error) {
      throw new ServiceError('Invalid contactInfo JSON format', 400);
    }
  }

  const club = await clubRepository.create({
    title,
    description,
    clubName,
    startDate,
    endDate,
    formUrl,
    image,
    contactInfo: parsedContactInfo,
    status: status || 'Open'
  });

  return club;
};

const updateClub = async ({ clubId, data, file }) => {
  const { title, description, clubName, startDate, endDate, formUrl, contactInfo, status } = data;

  if (!title || !description || !clubName || !startDate || !endDate || !formUrl || !status) {
    throw new ServiceError('Missing required fields.', 400);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ServiceError('Invalid date format.', 400);
  }
  if (start >= end) {
    throw new ServiceError('Start date must be before end date.', 400);
  }

  try {
    new URL(formUrl);
  } catch (error) {
    throw new ServiceError('Invalid form URL format.', 400);
  }

  const club = await clubRepository.findById(clubId);
  if (!club) {
    throw new ServiceError('Club recruitment not found.', 404);
  }

  if (file) {
    // Upload first: if the upload fails the existing image must stay intact
    const previousImage = club.image;
    club.image = await mediaService.uploadSingleImage(file, { folder: 'clubs' });

    if (previousImage && previousImage.public_id) {
      try {
        await mediaService.deleteByPublicId(previousImage.public_id);
      } catch (error) {
        // Ignore delete errors
      }
    }
  }

  let parsedContactInfo;
  if (contactInfo) {
    try {
      parsedContactInfo = JSON.parse(contactInfo);
    } catch (error) {
      throw new ServiceError('Invalid contactInfo JSON format', 400);
    }
  }

  club.title = title;
  club.description = description;
  club.clubName = clubName;
  club.startDate = startDate;
  club.endDate = endDate;
  club.formUrl = formUrl;
  club.contactInfo = parsedContactInfo;
  club.status = status;

  await club.save();
  return club;
};

const deleteClub = async ({ clubId }) => {
  const club = await clubRepository.findById(clubId);
  if (!club) {
    throw new ServiceError('Club recruitment not found.', 404);
  }

  if (club.image && club.image.public_id) {
    try {
      await mediaService.deleteByPublicId(club.image.public_id);
    } catch (error) {
      // Ignore delete errors
    }
  }

  await club.deleteOne();
  return { message: 'Club recruitment deleted.' };
};

module.exports = {
  listClubs,
  createClub,
  updateClub,
  deleteClub
};
