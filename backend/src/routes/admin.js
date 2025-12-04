const express = require('express');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const User = require('../models/UserSQLite');
const adminAuth = require('../middleware/admin');
const db = require('../db/sqlite');

const router = express.Router();

/**
 * @swagger
 * /api/admin/tasks:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: All tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/comments:
 *   get:
 *     summary: Get all comments (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Comment'
 *                   - type: object
 *                     properties:
 *                       taskTitle:
 *                         type: string
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 25
 *                 totalTasks:
 *                   type: integer
 *                   example: 150
 *                 totalComments:
 *                   type: integer
 *                   example: 300
 *       403:
 *         description: Admin access required
 */

// Get all tasks
router.get('/tasks', adminAuth, async (req, res) => {
  try {
    db.all(`SELECT t.*, u1.name as creatorName, u2.name as assigneeName 
            FROM tasks t 
            LEFT JOIN users u1 ON t.createdBy = u1.id 
            LEFT JOIN users u2 ON t.assignedTo = u2.id 
            ORDER BY t.createdAt DESC`, (err, tasks) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(tasks || []);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    db.all('SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC', (err, users) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(users || []);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments
router.get('/comments', adminAuth, async (req, res) => {
  try {
    db.all(`SELECT c.*, u.name as userName, t.title as taskTitle 
            FROM comments c 
            JOIN users u ON c.userId = u.id 
            JOIN tasks t ON c.taskId = t.id 
            ORDER BY c.createdAt DESC`, (err, comments) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(comments || []);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await User.updateUser(req.params.id, { role });
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = {};
    
    // User count
    db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      stats.totalUsers = result.count;
      
      // Task count
      db.get('SELECT COUNT(*) as count FROM tasks', (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        stats.totalTasks = result.count;
        
        // Comment count
        db.get('SELECT COUNT(*) as count FROM comments', (err, result) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          stats.totalComments = result.count;
          
          res.json(stats);
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;