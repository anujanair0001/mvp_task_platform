const db = require('../db/sqlite');

class Activity {
  static create(activityData) {
    return new Promise((resolve, reject) => {
      const { type, description, userId, taskId } = activityData;
      const stmt = db.prepare('INSERT INTO activities (type, description, userId, taskId) VALUES (?, ?, ?, ?)');
      stmt.run([type, description, userId, taskId], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...activityData });
      });
      stmt.finalize();
    });
  }

  static getRecent(limit = 20) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT a.*, u.name as userName 
              FROM activities a 
              JOIN users u ON a.userId = u.id 
              ORDER BY a.createdAt DESC 
              LIMIT ?`, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}

module.exports = Activity;