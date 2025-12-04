import React, { useState, useEffect } from 'react';
import { taskAPI, commentAPI } from '../utils/api';
import { Task, User, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';

import CommentCard from '../components/Comments/CommentCard';
import Pagination from '../components/UI/Pagination';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [pageSize] = useState(5);
  const [filterStatus, setFilterStatus] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'Medium' as 'Low' | 'Medium' | 'High' });
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    assignedTo: ''
  });

  useEffect(() => {
    loadTasks();
    loadUsers();
    
    // Real-time polling every 5 seconds
    const interval = setInterval(() => {
      loadTasks();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTasks = async (page = 1) => {
    try {
      const response = await taskAPI.getMyTasks(page, pageSize);
      const newTasks = response.data.tasks;
      
      // Check for changes
      if (tasks.length > 0 && JSON.stringify(newTasks) !== JSON.stringify(tasks)) {
        setHasNewUpdates(true);
        setTimeout(() => setHasNewUpdates(false), 3000);
      }
      
      setTasks(newTasks);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await taskAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const loadComments = async (taskId: number) => {
    try {
      const response = await commentAPI.getTaskComments(taskId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to load comments');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        ...newTask,
        assignedTo: newTask.assignedTo ? parseInt(newTask.assignedTo) : null
      });
      setNewTask({ title: '', description: '', priority: 'Medium', assignedTo: '' });
      setShowCreateForm(false);
      loadTasks();
    } catch (error) {
      console.error('Failed to create task');
    }
  };

  const handleStatusUpdate = async (taskId: number, status: string) => {
    try {
      await taskAPI.updateTask(taskId, { status });
      loadTasks();
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, status: status as any });
      }
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        loadTasks();
        setSelectedTask(null);
      } catch (error) {
        console.error('Failed to delete task');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newComment.trim()) return;

    try {
      await commentAPI.createComment({
        taskId: selectedTask.id,
        content: newComment
      });
      setNewComment('');
      loadComments(selectedTask.id);
    } catch (error) {
      console.error('Failed to add comment');
    }
  };

  const selectTask = (task: Task) => {
    console.log('Task selected:', task.title);
    setSelectedTask(task);
    loadComments(task.id);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    });
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await taskAPI.updateTask(editingTask.id, editForm);
      setEditingTask(null);
      loadTasks();
      if (selectedTask?.id === editingTask.id) {
        setSelectedTask({ ...selectedTask, ...editForm });
      }
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ fontSize: '1.2rem', color: '#667eea' }}>Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg }}>
      <Header />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '600', color: theme.text }}>
                Task Management
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: theme.textSecondary }}>
                Create, manage, and collaborate on tasks with your team
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="primary">
              {showCreateForm ? 'Cancel' : '+ New Task'}
            </Button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={() => { setFilterStatus(''); setSelectedTask(null); setEditingTask(null); }} style={{ background: theme.cardBg, padding: '1rem', borderRadius: '8px', textAlign: 'center', boxShadow: theme.shadow, border: `1px solid ${theme.border}`, cursor: 'pointer', color: theme.text }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#667eea' }}>{tasks.length}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Total Tasks</div>
            </button>
            <button onClick={() => { setFilterStatus('Todo'); setSelectedTask(null); setEditingTask(null); }} style={{ background: theme.cardBg, padding: '1rem', borderRadius: '8px', textAlign: 'center', boxShadow: theme.shadow, border: `1px solid ${theme.border}`, cursor: 'pointer', color: theme.text }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f56565' }}>{tasks.filter(t => t.status === 'Todo').length}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Todo</div>
            </button>
            <button onClick={() => { setFilterStatus('In Progress'); setSelectedTask(null); setEditingTask(null); }} style={{ background: theme.cardBg, padding: '1rem', borderRadius: '8px', textAlign: 'center', boxShadow: theme.shadow, border: `1px solid ${theme.border}`, cursor: 'pointer', color: theme.text }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3182ce' }}>{tasks.filter(t => t.status === 'In Progress').length}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>In Progress</div>
            </button>
            <button onClick={() => { setFilterStatus('Done'); setSelectedTask(null); setEditingTask(null); }} style={{ background: theme.cardBg, padding: '1rem', borderRadius: '8px', textAlign: 'center', boxShadow: theme.shadow, border: `1px solid ${theme.border}`, cursor: 'pointer', color: theme.text }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#38a169' }}>{tasks.filter(t => t.status === 'Done').length}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Completed</div>
            </button>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div style={{ marginBottom: '2rem' }}>
            <Card>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
                Create New Task
              </h3>
              <form onSubmit={handleCreateTask}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                      Task Title *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter task title..."
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                      Description
                    </label>
                    <Input
                      multiline
                      placeholder="Describe the task (optional)..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                        Priority
                      </label>
                      <Input
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                        options={[
                          { value: 'Low', label: 'Low' },
                          { value: 'Medium', label: 'Medium' },
                          { value: 'High', label: 'High' }
                        ]}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                        Assign To
                      </label>
                      <Input
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                        options={[
                          { value: '', label: 'Select member...' },
                          ...users.map(u => ({ value: u.id.toString(), label: u.name }))
                        ]}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <Button type="submit" variant="success" size="sm">
                      Create Task
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedTask ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          {/* Tasks List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                All Tasks ({pagination.total}) - Page {pagination.page} of {pagination.totalPages}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                  Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                </div>
                {hasNewUpdates && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#38a169', 
                    background: theme.cardBg, 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    border: '1px solid #9ae6b4'
                  }}>
                    ✨ Updated!
                  </div>
                )}
              </div>
            </div>
            
            {tasks.length === 0 ? (
              <Card>
                <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#4a5568' }}>No tasks yet</h3>
                  <p style={{ margin: '0 0 1.5rem 0' }}>Create your first task to get started</p>
                  <Button onClick={() => setShowCreateForm(true)} variant="primary">
                    Create First Task
                  </Button>
                </div>
              </Card>
            ) : (
              <div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {tasks.filter(task => !filterStatus || task.status === filterStatus).map(task => (
                    <button
                      key={task.id}
                      onClick={() => selectTask(task)}
                      style={{
                        width: '100%',
                        background: theme.cardBg,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: selectedTask?.id === task.id ? '0 8px 25px rgba(102, 126, 234, 0.3)' : theme.shadow,
                        border: selectedTask?.id === task.id ? '2px solid #667eea' : `1px solid ${theme.border}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                        color: theme.text
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: theme.text }}>
                          {task.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: '#f7fafc', color: '#4a5568' }}>
                            {task.priority}
                          </span>
                          <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: '#edf2f7', color: '#4a5568' }}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p style={{ 
                          margin: '0 0 1rem 0', 
                          color: theme.textSecondary, 
                          lineHeight: '1.5'
                        }}>
                          {task.description}
                        </p>
                      )}
                      
                      <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                        Created by: <span style={{ fontWeight: '500', color: theme.text }}>{task.creatorName}</span>
                        {task.assigneeName && (
                          <span style={{ marginLeft: '1rem' }}>
                            • Assigned to: <span style={{ fontWeight: '500', color: theme.text }}>{task.assigneeName}</span>
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => loadTasks(page)}
                />
              </div>
            )}
          </div>

          {/* Task Details & Comments */}
          {selectedTask && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: theme.text }}>
                Task Details
              </h3>
              
              {/* Task Info */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', color: '#2d3748' }}>
                    {selectedTask.title}
                  </h2>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(selectedTask.createdBy === Number(user?.id) || selectedTask.assignedTo === Number(user?.id)) && (
                      <Button onClick={() => handleEditTask(selectedTask)} variant="primary" size="sm">
                        Edit
                      </Button>
                    )}
                    {selectedTask.createdBy === Number(user?.id) && (
                      <Button onClick={() => handleDeleteTask(selectedTask.id)} variant="danger" size="sm">
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                
                {selectedTask.description && (
                  <p style={{ margin: '0 0 1rem 0', color: '#718096', lineHeight: '1.5' }}>
                    {selectedTask.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Badge variant="priority" type={selectedTask.priority}>
                    {selectedTask.priority}
                  </Badge>
                  <Badge variant="status" type={selectedTask.status}>
                    {selectedTask.status}
                  </Badge>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#4a5568' }}>
                      Status
                    </label>
                    <div style={{ maxWidth: '200px' }}>
                      <Input
                        value={selectedTask.status}
                        onChange={(e) => handleStatusUpdate(selectedTask.id, e.target.value)}
                        options={[
                          { value: 'Todo', label: 'Todo' },
                          { value: 'In Progress', label: 'In Progress' },
                          { value: 'Done', label: 'Done' }
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#4a5568' }}>
                      Created by
                    </label>
                    <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', fontSize: '0.9rem', maxWidth: '300px' }}>
                      {selectedTask.creatorName}
                    </div>
                  </div>
                </div>

                {selectedTask.assigneeName && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#4a5568' }}>
                      Assigned to
                    </label>
                    <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', fontSize: '0.9rem' }}>
                      {selectedTask.assigneeName}
                    </div>
                  </div>
                )}
              </Card>

              {/* Comments Section */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
                  Comments ({comments.length})
                </h4>
                
                {/* Add Comment */}
                <Card>
                  <form onSubmit={handleAddComment}>
                    <div style={{ maxWidth: '500px' }}>
                      <Input
                        multiline
                        placeholder="Add your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <Button type="submit" variant="primary" size="sm">
                        Post Comment
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Comments List */}
                <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                  {comments.length === 0 ? (
                    <Card>
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                        <p style={{ margin: 0 }}>No comments yet. Be the first to comment!</p>
                      </div>
                    </Card>
                  ) : (
                    comments.map(comment => (
                      <CommentCard key={comment.id} comment={comment} onUpdate={() => loadComments(selectedTask.id)} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Task Modal */}
        {editingTask && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
                Edit Task
              </h3>
              <form onSubmit={handleUpdateTask}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                      Title *
                    </label>
                    <Input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                      Description
                    </label>
                    <Input
                      multiline
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>
                      Priority
                    </label>
                    <Input
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                      options={[
                        { value: 'Low', label: 'Low' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High' }
                      ]}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
                    <Button type="submit" variant="success" size="sm">
                      Update Task
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setEditingTask(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Help Text - only show when there are visible tasks but none selected */}
        {!selectedTask && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: theme.text }}>Select a task to view details</h3>
              <p style={{ margin: 0, color: theme.textSecondary }}>Click on any task above to see details, update status, and add comments</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tasks;