const multer = require('multer');
const { ServiceError } = require('../services/serviceError');

const handleServiceError = (res, error, fallbackMessage) => {
  if (error instanceof ServiceError || error.status) {
    return res.status(error.status || 500).json({ message: error.message });
  }

  // Malformed ObjectIds and schema validation failures are client errors, not server errors
  if (error && error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${error.path || 'id'}` });
  }

  if (error && error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: fallbackMessage || 'Server Error' });
};

// Converts multer limit errors (file too large, too many files) into 400 responses
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File size should be less than 5MB'
        : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Too many files uploaded'
          : err.message;
    return res.status(400).json({ message });
  }
  return next(err);
};

module.exports = { handleServiceError, handleUploadError };
