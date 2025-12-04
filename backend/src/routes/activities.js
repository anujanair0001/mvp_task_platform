const express = require('express');
const Activity = require('../models/Activity');

const router = express.Router();

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 */

// Get recent activities (public endpoint)
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.getRecent(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;