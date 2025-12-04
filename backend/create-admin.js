const bcrypt = require('bcryptjs');
const db = require('./src/db/sqlite');

async function createAdmin() {
  try {
    // Hash password the same way as in registration
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Delete existing admin user if exists
    db.run('DELETE FROM users WHERE email = ?', ['admin@example.com'], function(err) {
      if (err) console.log('No existing admin to delete');
      
      // Create new admin user
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Admin User', 'admin@example.com', hashedPassword, 'admin'], 
        function(err) {
          if (err) {
            console.log('Error creating admin:', err.message);
          } else {
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email: admin@example.com');
            console.log('🔑 Password: admin123');
          }
          process.exit();
        }
      );
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();