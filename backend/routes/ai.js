const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { authMiddleware } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimit');

const MAX_QUERY_LENGTH = 500;
const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Too many search requests, please slow down' }
});

router.post('/semantic-search', authMiddleware, aiLimiter, async (req, res) => {
  try {
    const { query } = req.body || {};
    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ message: 'query is required' });
    }
    if (query.length > MAX_QUERY_LENGTH) {
      return res.status(400).json({ message: `query cannot exceed ${MAX_QUERY_LENGTH} characters` });
    }
    const result = await aiService.semanticSearch(query.trim());
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Semantic search failed' });
  }
});

module.exports = router;
