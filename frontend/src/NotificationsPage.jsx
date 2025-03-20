import { useState } from 'react';

const NotificationsPage = () => {
  // Mock notifications data
  const [notifications] = useState([
    {
      _id: '1', // Use _id to be consistent with MongoDB
      type: 'like',
      user: {
        username: 'ghosthunter',
        displayName: 'Ghost Hunter',
        profilePicture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61'
      },
      content: 'liked your post about the abandoned asylum',
      timestamp: '5 minutes ago',
      postPreview: 'The sounds I recorded in the east wing defy explanation...'
    },
    {
      _id: '2', // Use _id to be consistent with MongoDB
      type: 'comment',
      user: {
        username: 'midnightwalker',
        displayName: 'Midnight Walker',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
      },
      content: 'commented on your post',
      comment: 'I had a similar experience at that location. Did you notice the temperature drops in the basement?',
      timestamp: '2 hours ago',
      postPreview: 'This entity followed me home from my investigation last night.'
    },
    {
      _id: '3', // Use _id to be consistent with MongoDB
      type: 'follow',
      user: {
        username: 'paranormalexpert',
        displayName: 'Paranormal Expert',
        profilePicture: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12'
      },
      content: 'started following you',
      timestamp: '1 day ago'
    },
    {
      _id: '4', // Use _id to be consistent with MongoDB
      type: 'mention',
      user: {
        username: 'hauntedhistorian',
        displayName: 'Haunted Historian',
        profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
      },
      content: 'mentioned you in a post',
      postPreview: '@darkexplorer has documented some of the most compelling evidence I\'ve seen from Blackwood Asylum.',
      timestamp: '2 days ago'
    },
    {
      _id: '5', // Use _id to be consistent with MongoDB
      type: 'like',
      user: {
        username: 'cryptidchaser',
        displayName: 'Cryptid Chaser',
        profilePicture: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e'
      },
      content: 'liked your post about Whisper Woods',
      timestamp: '3 days ago',
      postPreview: 'The locals call this "Whisper Woods" for a reason...'
    }
  ]);

  // Function to render notification icon based on type
  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <span style={styles.likeIcon}>❤️</span>;
      case 'comment':
        return <span style={styles.commentIcon}>💬</span>;
      case 'follow':
        return <span style={styles.followIcon}>👤</span>;
      case 'mention':
        return <span style={styles.mentionIcon}>@</span>;
      default:
        return <span style={styles.defaultIcon}>🔔</span>;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>
      
      <div style={styles.notificationsContainer}>
        {notifications.map(notification => (
          <div key={notification._id} style={styles.notificationCard}>
            <div style={styles.iconContainer}>
              {renderNotificationIcon(notification.type)}
            </div>
            
            <div style={styles.notificationContent}>
              <div style={styles.userInfo}>
                <img 
                  src={notification.user.profilePicture} 
                  alt={notification.user.displayName} 
                  style={styles.userImage}
                />
                <div>
                  <span style={styles.userName}>{notification.user.displayName}</span>
                  <span style={styles.userAction}> {notification.content}</span>
                </div>
              </div>
              
              {notification.postPreview && (
                <div style={styles.postPreview}>
                  <p style={styles.previewText}>{notification.postPreview}</p>
                </div>
              )}
              
              {notification.comment && (
                <div style={styles.commentPreview}>
                  <p style={styles.commentText}>{notification.comment}</p>
                </div>
              )}
              
              <span style={styles.timestamp}>{notification.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#ff4757',
  },
  notificationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  notificationCard: {
    display: 'flex',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  iconContainer: {
    marginRight: '15px',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '5px',
  },
  likeIcon: {
    fontSize: '20px',
    color: '#ff4757',
  },
  commentIcon: {
    fontSize: '20px',
    color: '#3498db',
  },
  followIcon: {
    fontSize: '20px',
    color: '#2ecc71',
  },
  mentionIcon: {
    fontSize: '20px',
    color: '#f39c12',
    fontWeight: 'bold',
  },
  defaultIcon: {
    fontSize: '20px',
    color: '#e0e0e0',
  },
  notificationContent: {
    flex: 1,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  userImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    objectFit: 'cover',
  },
  userName: {
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  userAction: {
    color: '#e0e0e0',
  },
  postPreview: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
  previewText: {
    margin: 0,
    color: '#b0b0b0',
    fontSize: '14px',
  },
  commentPreview: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    borderLeft: '3px solid #3498db',
  },
  commentText: {
    margin: 0,
    color: '#b0b0b0',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  timestamp: {
    color: '#888',
    fontSize: '12px',
  }
};

export default NotificationsPage;