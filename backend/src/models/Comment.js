const db = require('../db/sqlite');

class Comment {
  static create(commentData) {
    return new Promise((resolve, reject) => {
      const { taskId, userId, content } = commentData;
      const stmt = db.prepare('INSERT INTO comments (taskId, userId, content) VALUES (?, ?, ?)');
      stmt.run([taskId, userId, content], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...commentData });
      });
      stmt.finalize();
    });
  }

  static findByTask(taskId) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT c.*, u.name as userName 
              FROM comments c 
              JOIN users u ON c.userId = u.id 
              WHERE c.taskId = ? 
              ORDER BY c.createdAt ASC`, [taskId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static update(id, content) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE comments SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [content, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM comments WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM comments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = Comment;