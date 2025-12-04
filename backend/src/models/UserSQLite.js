const bcrypt = require('bcryptjs');
const db = require('../db/sqlite');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
      stmt.run([userData.name, userData.email, hashedPassword], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...userData, password: hashedPassword });
      });
      stmt.finalize();
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static updateUser(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      db.run(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static findByResetToken(token) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > ?', 
        [token, Date.now()], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = User;