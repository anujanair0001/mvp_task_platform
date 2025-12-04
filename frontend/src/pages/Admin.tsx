import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  creatorName: string;
  assigneeName?: string;
}

interface AdminComment {
  id: number;
  content: string;
  userName: string;
  taskTitle: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    loadData();
    
    // Real-time polling every 10 seconds for admin data
    const interval = setInterval(() => {
      loadData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, tasksRes, commentsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllTasks(),
        adminAPI.getAllComments()
      ]);
      
      setStats(statsRes.data || { totalUsers: 0, totalTasks: 0, totalComments: 0 });
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      // Set default empty arrays on error
      setUsers([]);
      setTasks([]);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ fontSize: '1.2rem', color: '#667eea' }}>Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Header />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '600', color: '#2d3748' }}>
                Admin Panel
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#718096' }}>
                Manage users, tasks, and system overview
              </p>
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'tasks', label: 'All Tasks' },
            { id: 'comments', label: 'Comments' }
          ].map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <Card>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '600', color: '#667eea' }}>{stats.totalUsers}</div>
                  <div style={{ color: '#718096' }}>Total Users</div>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '600', color: '#38a169' }}>{stats.totalTasks}</div>
                  <div style={{ color: '#718096' }}>Total Tasks</div>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '600', color: '#3182ce' }}>{stats.totalComments}</div>
                  <div style={{ color: '#718096' }}>Total Comments</div>
                </div>
              </Card>
            </div>

            <Card>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>System Overview</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '6px' }}>
                  <strong>Recent Activity:</strong> {comments.length} comments on {tasks.length} tasks
                </div>
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '6px' }}>
                  <strong>User Engagement:</strong> {users.filter(u => u.role === 'admin').length} admin(s), {users.filter(u => u.role === 'user').length} regular user(s)
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>All Users ({users.length})</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Array.isArray(users) && users.map(user => (
                <div key={user.id} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto auto', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>{user.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="status" type={user.role === 'admin' ? 'Done' : 'Todo'}>
                    {user.role}
                  </Badge>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <Card>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>All Tasks ({tasks.length})</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Array.isArray(tasks) && tasks.map(task => (
                <div key={task.id} style={{ 
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#2d3748' }}>{task.title}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Badge variant="priority" type={task.priority}>{task.priority}</Badge>
                      <Badge variant="status" type={task.status}>{task.status}</Badge>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                    Created by: {task.creatorName}
                    {task.assigneeName && ` • Assigned to: ${task.assigneeName}`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <Card>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>All Comments ({comments.length})</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Array.isArray(comments) && comments.map(comment => (
                <div key={comment.id} style={{ 
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>{comment.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem' }}>
                    On task: <strong>{comment.taskTitle}</strong>
                  </div>
                  <div style={{ color: '#718096' }}>{comment.content}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;