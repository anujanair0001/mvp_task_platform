import React, { useState } from 'react';
import { Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { commentAPI } from '../../utils/api';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface CommentCardProps {
  comment: Comment;
  onUpdate: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const canModify = user?.id === comment.userId;

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    setLoading(true);
    try {
      await commentAPI.updateComment(comment.id, { content: editContent });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setLoading(true);
    try {
      await commentAPI.deleteComment(comment.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {comment.userName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: '600', color: '#2d3748' }}>
            {comment.userName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {canModify && !isEditing && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button onClick={() => setIsEditing(true)} variant="primary" size="sm">
                Edit
              </Button>
              <Button onClick={handleDelete} variant="danger" size="sm" disabled={loading}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            multiline
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button onClick={handleEdit} variant="success" size="sm" disabled={loading}>
              Save
            </Button>
            <Button onClick={() => { setIsEditing(false); setEditContent(comment.content); }} variant="secondary" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p style={{ 
          margin: 0, 
          color: '#4a5568', 
          lineHeight: '1.6',
          padding: '0.75rem',
          background: '#f7fafc',
          borderRadius: '8px',
          borderLeft: '4px solid #667eea'
        }}>
          {comment.content}
        </p>
      )}
    </Card>
  );
};

export default CommentCard;