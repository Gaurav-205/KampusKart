const multer = require('multer');

// Files are buffered in memory before validation, so an unbounded limit lets a single
// request exhaust the server's RAM. Every route gets a sane default; callers can tighten it.
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_MAX_FILES = 5;

const createMemoryUpload = ({ maxFileSize = DEFAULT_MAX_FILE_SIZE, maxFiles = DEFAULT_MAX_FILES } = {}) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxFileSize, files: maxFiles }
  });
};

module.exports = { createMemoryUpload, DEFAULT_MAX_FILE_SIZE, DEFAULT_MAX_FILES };
