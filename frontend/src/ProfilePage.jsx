import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  // User state
  const [user, setUser] = useState({
    username: 'darkexplorer',
    displayName: 'The Dark Explorer',
    bio: 'Venturing into the unexplained and documenting the horrors that lurk in the shadows. Professional paranormal investigator.',
    profilePicture: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    coverPhoto: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e',
    stats: {
      posts: 0,
      followers: 1337,
      following: 256
    }
  });

  // Posts state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    username: '',
    bio: ''
  });
  
  // Comment state
  const [commentText, setCommentText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }
        
        // Fetch user profile
        const profileResponse = await axios.get('http://localhost:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = profileResponse.data.user;
        setUser({
          username: userData.username || 'user',
          displayName: userData.displayName || 'User',
          bio: userData.bio || 'No bio yet',
          profilePicture: userData.profilePicture || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
          coverPhoto: userData.coverPhoto || 'https://images.unsplash.com/photo-1494972308805-463bc619d34e',
          stats: userData.stats || { posts: 0, followers: 0, following: 0 }
        });
        
        // Fetch user posts
        const postsResponse = await axios.get(`http://localhost:8000/api/posts/user/${userData._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
        
        // For demo purposes, set mock data if API fails
        setPosts([
          {
            _id: 1,
            content: 'Just returned from the abandoned asylum on Blackwood Hill. The EVP recordings I captured will haunt your dreams...',
            mediaUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            likes: [1, 2, 3], // Array of user IDs who liked the post
            comments: [
              { _id: 1, text: 'This is terrifying!', userId: 'user1', createdAt: new Date() },
              { _id: 2, text: 'I need to visit this place', userId: 'user2', createdAt: new Date() }
            ]
          },
          {
            _id: 2,
            content: 'This entity followed me home from my investigation last night. It appears in every mirror but only when I\'m not looking directly at it.',
            mediaUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec139dfb',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            likes: [1, 2, 3, 4, 5],
            comments: [
              { _id: 3, text: 'Have you tried sage?', userId: 'user3', createdAt: new Date() },
              { _id: 4, text: 'This happened to me once', userId: 'user4', createdAt: new Date() }
            ]
          },
          {
            _id: 3,
            content: 'The locals call this "Whisper Woods" for a reason. If you listen carefully at midnight, you can hear the voices of those who never left...',
            mediaUrl: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d',
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            likes: [1, 2, 3, 4, 5, 6, 7],
            comments: [
              { _id: 5, text: 'I grew up near there!', userId: 'user5', createdAt: new Date() },
              { _id: 6, text: 'Did you record anything?', userId: 'user6', createdAt: new Date() }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle like/unlike post
  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to like posts');
        return;
      }
      
      // Get user ID from token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.id;
      
      // Optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            // Check if user already liked the post
            const alreadyLiked = post.likes.includes(userId);
            
            return {
              ...post,
              likes: alreadyLiked 
                ? post.likes.filter(id => id !== userId) 
                : [...post.likes, userId]
            };
          }
          return post;
        })
      );
      
      // API call
      await axios.post(`http://localhost:8000/api/posts/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      setError('Error liking post. Please try again.');
      // Revert optimistic update if API call fails
      // This would require keeping track of the previous state
    }
  };
  
  // Handle adding a comment
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to comment');
        return;
      }
      
      // Get user ID from token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.id;
      
      // Optimistic update
      const newComment = {
        _id: Date.now(), // Temporary ID
        text: commentText,
        userId: userId,
        createdAt: new Date()
      };
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        })
      );
      
      // Reset comment form
      setCommentText('');
      setActiveCommentPostId(null);
      
      // API call
      await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, {
        text: commentText
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment. Please try again.');
      // Revert optimistic update if API call fails
    }
  };
  
  // Handle opening edit profile modal
  const handleOpenEditModal = () => {
    setEditFormData({
      displayName: user.displayName,
      username: user.username,
      bio: user.bio
    });
    setShowEditModal(true);
  };
  
  // Handle edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle saving profile changes
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to edit your profile');
        return;
      }
      
      // Optimistic update
      setUser(prev => ({
        ...prev,
        displayName: editFormData.displayName,
        username: editFormData.username,
        bio: editFormData.bio
      }));
      
      setShowEditModal(false);
      
      // Make API call to update the user profile
      await axios.put('http://localhost:8000/api/user/profile', editFormData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
      
      // Revert optimistic update if API call fails
      if (error.response && error.response.status === 400) {
        // Username already taken
        setError('Username already taken. Please choose a different username.');
        setShowEditModal(true); // Reopen the modal
      }
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

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

        <button 
          style={styles.editProfileButton}
          onClick={handleOpenEditModal}
        >
          Edit Profile
        </button>
      </div>

      {/* Posts Section */}
      <div style={styles.postsSection}>
        <h2 style={styles.sectionTitle}>Posts</h2>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <p>Loading posts...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p>No posts yet. Share your creepy discoveries!</p>
          </div>
        ) : (
          <div style={styles.postsContainer}>
            {posts.map(post => (
              <div key={post._id} style={styles.postCard}>
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
                    <span style={styles.postTimestamp}> · {formatTimestamp(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <p style={styles.postContent}>{post.content}</p>
              
              {post.mediaUrl && (
                <img 
                  src={post.mediaUrl}
                  alt="Post content" 
                  style={styles.postImage}
                />
              )}
              
              <div style={styles.postFooter}>
                <div 
                  style={styles.postAction}
                  onClick={() => handleLikePost(post._id)}
                >
                  <span style={styles.actionIcon}>❤️</span>
                  <span>{post.likes.length}</span>
                </div>
                <div 
                  style={styles.postAction}
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                >
                  <span style={styles.actionIcon}>💬</span>
                  <span>{post.comments.length}</span>
                </div>
                <div style={styles.postAction}>
                  <span style={styles.actionIcon}>🔄</span>
                </div>
                <div style={styles.postAction}>
                  <span style={styles.actionIcon}>🔗</span>
                </div>
              </div>
              
              {/* Comments section */}
              {activeCommentPostId === post._id && (
                <div style={styles.commentsSection}>
                  {post.comments.length > 0 && (
                    <div style={styles.commentsList}>
                      {post.comments.map(comment => (
                        <div key={comment._id} style={styles.commentItem}>
                          <div style={styles.commentHeader}>
                            <span style={styles.commentUser}>{comment.user?.displayName || comment.userId || 'User'}</span>
                            <span style={styles.commentTimestamp}>{formatTimestamp(comment.createdAt)}</span>
                          </div>
                          <p style={styles.commentText}>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={styles.commentForm}>
                    <textarea
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={styles.commentInput}
                    />
                    <button 
                      onClick={() => handleAddComment(post._id)}
                      style={styles.commentButton}
                      disabled={!commentText.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Edit Profile</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Display Name</label>
              <input
                type="text"
                name="displayName"
                value={editFormData.displayName}
                onChange={handleEditFormChange}
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Username</label>
              <input
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleEditFormChange}
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Bio</label>
              <textarea
                name="bio"
                value={editFormData.bio}
                onChange={handleEditFormChange}
                style={{...styles.formInput, minHeight: '100px'}}
              />
            </div>
            
            <div style={styles.modalActions}>
              <button 
                onClick={() => setShowEditModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
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
    cursor: 'pointer',
  },
  actionIcon: {
    fontSize: '16px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '20px',
    color: '#888',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '20px',
    color: '#ff4757',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '20px',
    color: '#888',
  },
  commentsSection: {
    marginTop: '15px',
    borderTop: '1px solid #333',
    paddingTop: '15px',
  },
  commentsList: {
    marginBottom: '15px',
  },
  commentItem: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#e0e0e0',
    fontSize: '14px',
  },
  commentTimestamp: {
    color: '#888',
    fontSize: '12px',
  },
  commentText: {
    margin: '0',
    color: '#e0e0e0',
    fontSize: '14px',
  },
  commentForm: {
    display: 'flex',
    gap: '10px',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    color: '#e0e0e0',
    fontSize: '14px',
    resize: 'none',
    minHeight: '40px',
  },
  commentButton: {
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0 15px',
    fontSize: '14px',
    cursor: 'pointer',
    '&:disabled': {
      backgroundColor: '#555',
      cursor: 'not-allowed',
    },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#ff4757',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '5px',
    color: '#e0e0e0',
    fontSize: '14px',
  },
  formInput: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    color: '#e0e0e0',
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#e0e0e0',
    border: '1px solid #555',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  }
};

export default ProfilePage;