import React, { useState, useEffect } from 'react';
import { activityAPI } from '../utils/api';
import { Activity } from '../types';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActivityCount, setNewActivityCount] = useState(0);

  useEffect(() => {
    loadActivities();
    
    // Real-time polling every 3 seconds
    const interval = setInterval(() => {
      loadActivities();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const loadActivities = async () => {
    try {
      const response = await activityAPI.getActivities();
      const newActivities = response.data;
      
      // Count new activities
      if (activities.length > 0 && newActivities.length > activities.length) {
        const newCount = newActivities.length - activities.length;
        setNewActivityCount(newCount);
        setTimeout(() => setNewActivityCount(0), 5000);
      }
      
      setActivities(newActivities);
    } catch (error) {
      console.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created': return '📝';
      case 'task_updated': return '✏️';
      case 'task_deleted': return '🗑️';
      case 'comment_added': return '💬';
      default: return '📋';
    }
  };

  if (loading) return <div>Loading activities...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Header />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '700', color: '#2d3748' }}>
              📊 Team Activity Feed
            </h1>
            {newActivityCount > 0 && (
              <div style={{
                fontSize: '0.8rem',
                color: '#3182ce',
                background: '#ebf8ff',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                border: '1px solid #90cdf4'
              }}>
                +{newActivityCount} new
              </div>
            )}
          </div>
          <p style={{ fontSize: '1.25rem', color: '#718096', margin: 0 }}>
            Stay updated with recent team activities and collaboration
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {activities.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#4a5568' }}>No activities yet</h3>
                <p style={{ margin: 0 }}>Start creating tasks to see team activity!</p>
              </div>
            </Card>
          ) : (
            activities.map(activity => (
              <Card key={activity.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    fontSize: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '500', color: '#2d3748' }}>
                      {activity.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
                      <span>👤 {activity.userName}</span>
                      <span>•</span>
                      <span>🕒 {new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ℹ️</div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>About This Feed</h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.125rem', lineHeight: '1.6' }}>
                This public activity feed shows recent team activities including task creation, 
                updates, and collaboration. No sensitive information is displayed here.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;