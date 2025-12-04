import React from 'react';
import { Task } from '../../types';
import Card from '../UI/Card';
import Badge from '../UI/Badge';

interface TaskCardProps {
  task: Task;
  selected: boolean;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, selected, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: selected ? '0 8px 25px rgba(102, 126, 234, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
        border: selected ? '2px solid #667eea' : '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: selected ? 'translateY(-2px)' : 'none',
        position: 'relative',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        }
      }}
    >
      {/* Click indicator */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        fontSize: '0.75rem',
        color: '#a0aec0',
        opacity: selected ? 0 : 0.7
      }}>
        Click to view
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#2d3748' }}>
          {task.title}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'none' }}>
          <Badge variant="priority" type={task.priority}>
            {task.priority}
          </Badge>
          <Badge variant="status" type={task.status}>
            {task.status}
          </Badge>
        </div>
      </div>
      
      {task.description && (
        <p style={{ 
          margin: '0 0 1rem 0', 
          color: '#718096', 
          lineHeight: '1.5',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {task.description}
        </p>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#a0aec0' }}>
        <div>
          Created by: <span style={{ fontWeight: '500', color: '#4a5568' }}>{task.creatorName}</span>
        </div>
        {task.assigneeName && (
          <div>
            Assigned to: <span style={{ fontWeight: '500', color: '#4a5568' }}>{task.assigneeName}</span>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#a0aec0' }}>
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;