import { useState } from 'react';

const ProfilePage = () => {
  // Mock user data
  const [user] = useState({
    username: 'darkexplorer',
    displayName: 'The Dark Explorer',
    bio: 'Venturing into the unexplained and documenting the horrors that lurk in the shadows. Professional paranormal investigator.',
    profilePicture: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    coverPhoto: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e',
    stats: {
      posts: 42,
      followers: 1337,
      following: 256
    }
  });

  // Mock posts data
  const [posts] = useState([
    {
      id: 1,
      content: 'Just returned from the abandoned asylum on Blackwood Hill. The EVP recordings I captured will haunt your dreams...',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
      timestamp: '2 hours ago',
      likes: 128,
      comments: 43
    },
    {
      id: 2,
      content: 'This entity followed me home from my investigation last night. It appears in every mirror but only when I\'m not looking directly at it.',
      imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec139dfb',
      timestamp: '1 day ago',
      likes: 256,
      comments: 89
    },
    {
      id: 3,
      content: 'The locals call this "Whisper Woods" for a reason. If you listen carefully at midnight, you can hear the voices of those who never left...',
      imageUrl: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d',
      timestamp: '3 days ago',
      likes: 512,
      comments: 147
    }
  ]);

  return (
    <div style={styles.container}>
      {/* Cover Photo */}
      <div style={{
        ...styles.coverPhoto,
        backgroundImage: `url(${user.coverPhoto})`
      }}>
        <div style={styles.profilePictureContainer}>
          <img 
            src={user.profilePicture} 
            alt={user.displayName} 
            style={styles.profilePicture}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div style={styles.profileInfo}>
        <h1 style={styles.displayName}>{user.displayName}</h1>
        <h2 style={styles.username}>@{user.username}</h2>
        <p style={styles.bio}>{user.bio}</p>

        <div style={styles.statsContainer}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{user.stats.posts}</span>
            <span style={styles.statLabel}>Posts</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{user.stats.followers}</span>
            <span style={styles.statLabel}>Followers</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{user.stats.following}</span>
            <span style={styles.statLabel}>Following</span>
          </div>
        </div>

        <button style={styles.editProfileButton}>
          Edit Profile
        </button>
      </div>

      {/* Posts Section */}
      <div style={styles.postsSection}>
        <h2 style={styles.sectionTitle}>Posts</h2>
        
        <div style={styles.postsContainer}>
          {posts.map(post => (
            <div key={post.id} style={styles.postCard}>
              <div style={styles.postHeader}>
                <div style={styles.postUser}>
                  <img 
                    src={user.profilePicture} 
                    alt={user.displayName} 
                    style={styles.postUserImage}
                  />
                  <div>
                    <h3 style={styles.postUserName}>{user.displayName}</h3>
                    <span style={styles.postUsername}>@{user.username}</span>
                    <span style={styles.postTimestamp}> · {post.timestamp}</span>
                  </div>
                </div>
              </div>
              
              <p style={styles.postContent}>{post.content}</p>
              
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt="Post content" 
                  style={styles.postImage}
                />
              )}
              
              <div style={styles.postFooter}>
                <div style={styles.postAction}>
                  <span style={styles.actionIcon}>❤️</span>
                  <span>{post.likes}</span>
                </div>
                <div style={styles.postAction}>
                  <span style={styles.actionIcon}>💬</span>
                  <span>{post.comments}</span>
                </div>
                <div style={styles.postAction}>
                  <span style={styles.actionIcon}>🔄</span>
                </div>
                <div style={styles.postAction}>
                  <span style={styles.actionIcon}>🔗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  coverPhoto: {
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    borderRadius: '10px 10px 0 0',
    marginBottom: '60px',
  },
  profilePictureContainer: {
    position: 'absolute',
    bottom: '-50px',
    left: '20px',
  },
  profilePicture: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid #121212',
    objectFit: 'cover',
  },
  profileInfo: {
    padding: '0 20px 20px',
  },
  displayName: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#e0e0e0',
  },
  username: {
    fontSize: '16px',
    color: '#888',
    margin: '0 0 15px 0',
    fontWeight: 'normal',
  },
  bio: {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '20px',
    color: '#e0e0e0',
  },
  statsContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  stat: {
    marginRight: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  statLabel: {
    color: '#888',
    fontSize: '14px',
  },
  editProfileButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#ff4757',
    border: '1px solid #ff4757',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  postsSection: {
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#ff4757',
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  postCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  postHeader: {
    marginBottom: '15px',
  },
  postUser: {
    display: 'flex',
    alignItems: 'center',
  },
  postUserImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    objectFit: 'cover',
  },
  postUserName: {
    margin: '0 0 2px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  postUsername: {
    color: '#888',
    fontSize: '14px',
  },
  postTimestamp: {
    color: '#888',
    fontSize: '14px',
  },
  postContent: {
    marginBottom: '15px',
    lineHeight: '1.5',
    color: '#e0e0e0',
  },
  postImage: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '15px',
    maxHeight: '400px',
    objectFit: 'cover',
  },
  postFooter: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  postAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#888',
    fontSize: '14px',
  },
  actionIcon: {
    fontSize: '16px',
  }
};

export default ProfilePage;