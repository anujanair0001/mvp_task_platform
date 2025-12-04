const db = require('../db/sqlite');

class Task {
  static create(taskData) {
    return new Promise((resolve, reject) => {
      const { title, description, priority, assignedTo, createdBy } = taskData;
      const stmt = db.prepare('INSERT INTO tasks (title, description, priority, assignedTo, createdBy) VALUES (?, ?, ?, ?, ?)');
      stmt.run([title, description, priority || 'Medium', assignedTo, createdBy], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...taskData });
      });
      stmt.finalize();
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT t.*, 
                     creator.name as creatorName, 
                     assignee.name as assigneeName 
              FROM tasks t 
              LEFT JOIN users creator ON t.createdBy = creator.id 
              LEFT JOIN users assignee ON t.assignedTo = assignee.id 
              WHERE t.id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findByUser(userId, page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      // Get total count
      db.get(`SELECT COUNT(*) as total FROM tasks WHERE createdBy = ? OR assignedTo = ?`, 
        [userId, userId], (err, countResult) => {
        if (err) reject(err);
        
        // Get paginated results
        db.all(`SELECT t.*, 
                       creator.name as creatorName, 
                       assignee.name as assigneeName 
                FROM tasks t 
                LEFT JOIN users creator ON t.createdBy = creator.id 
                LEFT JOIN users assignee ON t.assignedTo = assignee.id 
                WHERE t.createdBy = ? OR t.assignedTo = ?
                ORDER BY t.createdAt DESC
                LIMIT ? OFFSET ?`, [userId, userId, limit, offset], (err, rows) => {
          if (err) reject(err);
          else resolve({
            tasks: rows || [],
            total: countResult.total,
            page,
            totalPages: Math.ceil(countResult.total / limit)
          });
        });
      });
    });
  }

  static update(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      db.run(`UPDATE tasks SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, [...values, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static getAll(page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      // Get total count
      db.get(`SELECT COUNT(*) as total FROM tasks`, (err, countResult) => {
        if (err) reject(err);
        
        // Get paginated results
        db.all(`SELECT t.*, 
                       creator.name as creatorName, 
                       assignee.name as assigneeName 
                FROM tasks t 
                LEFT JOIN users creator ON t.createdBy = creator.id 
                LEFT JOIN users assignee ON t.assignedTo = assignee.id 
                ORDER BY t.createdAt DESC
                LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
          if (err) reject(err);
          else resolve({
            tasks: rows || [],
            total: countResult.total,
            page,
            totalPages: Math.ceil(countResult.total / limit)
          });
        });
      });
    });
  }
}

module.exports = Task;