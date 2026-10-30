const userRepository = require('../repositories/userRepository');
const { ServiceError } = require('./serviceError');
const mediaService = require('./mediaService');
const { isAdminEmail } = require('../utils/adminUtils');

const getProfile = async (userId) => {
  const user = await userRepository
    .findById(userId)
    .select('-password -resetPasswordOTP -resetPasswordExpires -resetPasswordAttempts');

  if (!user) {
    throw new ServiceError('User not found', 404);
  }

  const userObject = user.toObject();
  userObject.isAdmin = isAdminEmail(user.email);
  return userObject;
};

const updateProfile = async ({ userId, data, file }) => {
  const profileFields = {};

  if (data.name !== undefined) profileFields.name = data.name;
  if (data.phone !== undefined) profileFields.phone = data.phone;
  if (data.major !== undefined) profileFields.major = data.major;
  if (data.yearOfStudy !== undefined) profileFields.yearOfStudy = data.yearOfStudy;
  if (data.gender !== undefined) profileFields.gender = data.gender;
  if (data.program !== undefined) profileFields.program = data.program;

  if (data.dateOfBirth !== undefined) {
    if (data.dateOfBirth === '' || data.dateOfBirth === null) {
      profileFields.dateOfBirth = null;
    } else {
      const parsedDate = new Date(data.dateOfBirth);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new ServiceError('Invalid date of birth format.', 400);
      }
      profileFields.dateOfBirth = parsedDate;
    }
  }

  let user = await userRepository.findById(userId);
  if (!user) {
    throw new ServiceError('User not found', 404);
  }

  if (file) {
    // Upload first: if the upload fails the existing picture must stay intact
    const previousPicture = user.profilePicture;
    const uploadResult = await mediaService.uploadSingleImage(file, {
      folder: 'profile_pictures'
    });

    user.profilePicture = uploadResult;

    if (previousPicture && previousPicture.public_id) {
      try {
        await mediaService.deleteByPublicId(previousPicture.public_id);
      } catch (error) {
        // Continue even if delete fails
      }
    }
  }

  Object.assign(user, profileFields);
  await user.save();

  const updatedUser = await userRepository
    .findById(userId)
    .select('-password -resetPasswordOTP -resetPasswordExpires -resetPasswordAttempts');

  const userObject = updatedUser.toObject();
  userObject.isAdmin = isAdminEmail(updatedUser.email);
  return userObject;
};

module.exports = {
  getProfile,
  updateProfile
};
