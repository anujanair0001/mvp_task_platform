import React from 'react';
import { User } from '../../types';
import Card from '../UI/Card';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface TaskFormProps {
  newTask: {
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    assignedTo: string;
  };
  setNewTask: (task: any) => void;
  users: User[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ newTask, setNewTask, users, onSubmit, onCancel }) => {
  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  const userOptions = [
    { value: '', label: 'Assign to...' },
    ...users.map(user => ({ value: user.id.toString(), label: user.name }))
  ];

  return (
    <Card>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
          Create New Task
        </h3>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#718096' }}>
          Fill out the form below to create a new task
        </p>
      </div>
      
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
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
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
            Description
          </label>
          <Input
            multiline
            placeholder="Describe the task..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={4}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
              Priority
            </label>
            <Input
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              options={priorityOptions}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
              Assign To
            </label>
            <Input
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              options={userOptions}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" variant="success">
            Create Task
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;