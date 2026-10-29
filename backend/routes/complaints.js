const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  sanitizeInput,
  validateComplaint,
  validateComplaintUpdate
} = require('../middleware/validation');
const { createMemoryUpload } = require('../middleware/uploads');
const { createRateLimiter } = require('../middleware/rateLimit');
const complaintsController = require('../controllers/complaintsController');

const upload = createMemoryUpload();
const writeLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many requests, please try again later' }
});

router.get('/', authMiddleware, complaintsController.listComplaints);
router.post(
  '/',
  authMiddleware,
  writeLimiter,
  upload.array('images', 5),
  sanitizeInput,
  validateComplaint,
  complaintsController.createComplaint
);

router.get(
  '/admin/all',
  authMiddleware,
  requireAdmin('Admin access required'),
  complaintsController.listAdminComplaints
);
router.delete(
  '/admin/:id/permanent',
  authMiddleware,
  requireAdmin('Admin access required'),
  complaintsController.adminPermanentDelete
);
router.patch(
  '/admin/:id/restore',
  authMiddleware,
  requireAdmin('Admin access required'),
  complaintsController.adminRestoreComplaint
);
router.post(
  '/admin/cleanup-expired',
  authMiddleware,
  requireAdmin('Admin access required'),
  complaintsController.adminCleanupExpired
);

router.put(
  '/:id',
  authMiddleware,
  writeLimiter,
  upload.array('images', 5),
  sanitizeInput,
  validateComplaintUpdate,
  complaintsController.updateComplaint
);
router.delete('/:id', authMiddleware, writeLimiter, complaintsController.deleteComplaint);

module.exports = router;
