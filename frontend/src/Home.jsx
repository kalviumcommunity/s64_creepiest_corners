import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';

const Home = () => {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // User state
  const [user, setUser] = useState({
    username: 'darkexplorer',
    displayName: 'The Dark Explorer',
    profilePicture: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
  });

  // Feed posts state
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo/mock data that will always be displayed
  const mockPosts = [
    {
      _id: '1',
      userId: 'ghosthunter',
      user: {
        username: 'ghosthunter',
        displayName: 'Ghost Hunter',
        profilePicture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61'
      },
      content: 'Found this creepy abandoned hospital last night. The sounds coming from the third floor were unexplainable...',
      mediaUrl: 'https://images.unsplash.com/photo-1635224983665-8f0b34a82487',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      likes: [1, 2, 3],
      comments: [
        { _id: 1, text: 'This is terrifying!', userId: 'user1', createdAt: new Date() },
        { _id: 2, text: 'I need to visit this place', userId: 'user2', createdAt: new Date() }
      ]
    },
    {
      _id: '2',
      userId: 'midnightwalker',
      user: {
        username: 'midnightwalker',
        displayName: 'Midnight Walker',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
      },
      content: 'This strange figure appears in my photos whenever I visit this forest. No one else can see it.',
      mediaUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likes: [1, 2, 3, 4, 5],
      comments: [
        { _id: 3, text: 'Have you tried sage?', userId: 'user3', createdAt: new Date() },
        { _id: 4, text: 'This happened to me once', userId: 'user4', createdAt: new Date() }
      ]
    },
    {
      _id: '3',
      userId: 'paranormalexpert',
      user: {
        username: 'paranormalexpert',
        displayName: 'Paranormal Expert',
        profilePicture: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12'
      },
      content: 'The legend of the crying woman has been documented in over 17 countries. Here\'s my encounter from last week.',
      mediaUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c',
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      likes: [1, 2, 3, 4, 5, 6, 7],
      comments: [
        { _id: 5, text: 'I grew up near there!', userId: 'user5', createdAt: new Date() },
        { _id: 6, text: 'Did you record anything?', userId: 'user6', createdAt: new Date() }
      ]
    },
    {
      _id: '4',
      userId: 'hauntedhistorian',
      user: {
        username: 'hauntedhistorian',
        displayName: 'Haunted Historian',
        profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
      },
      content: 'Researching the Blackwood Asylum case. Multiple witnesses reported seeing the same apparition in the east wing. @darkexplorer has documented some of the most compelling evidence.',
      mediaUrl: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e',
      createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      likes: [1, 2, 3, 4, 5, 6, 7, 8],
      comments: [
        { _id: 7, text: 'I need to see this!', userId: 'user7', createdAt: new Date() },
        { _id: 8, text: 'Can you share more details?', userId: 'user8', createdAt: new Date() }
      ]
    }
  ];

  // Fetch user profile and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          // Set mock data even if not logged in
          setFeedPosts(mockPosts);
          return;
        }
        
        // Fetch user profile
        console.log('Making request to /api/user/profile with token:', token);
        try {
          const profileResponse = await axios.get('http://localhost:8000/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('Profile response:', profileResponse);
          
          const userData = profileResponse.data.user;
          setUser({
            username: userData.username || 'user',
            displayName: userData.displayName || 'User',
            profilePicture: userData.profilePicture || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
          });
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          console.error('Error response:', profileError.response);
          // Continue with mock data for user
        }
        
        // Fetch all posts
        try {
          const postsResponse = await axios.get('http://localhost:8000/api/posts', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Combine API data with mock data
          const apiPosts = postsResponse.data || [];
          setFeedPosts([...apiPosts, ...mockPosts]);
        } catch (postsError) {
          console.error('Error fetching posts:', postsError);
          // Use mock data if API fails
          setFeedPosts(mockPosts);
        }
        
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('Error fetching data. Please try again.');
        
        // Still display mock data even if API fails
        setFeedPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // State for comments
  const [commentText, setCommentText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Handle post submission
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if ((!newPostContent.trim() && !selectedMedia)) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post content');
      return;
    }
    
    setIsPosting(true);
    
    // Simulate API call with setTimeout
    // In a real app, this would be an actual API call with the token
    setTimeout(() => {
      const newPost = {
        _id: Date.now().toString(), // Use _id to be consistent with MongoDB
        user: {
          username: user.username,
          displayName: user.displayName,
          profilePicture: user.profilePicture
        },
        content: newPostContent,
        mediaUrl: mediaPreview, // Use mediaUrl to be consistent with backend model
        timestamp: 'Just now',
        likes: [],
        comments: []
      };
      
      setFeedPosts([newPost, ...feedPosts]);
      setNewPostContent('');
      
      // Clean up media states
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview); // Clean up the object URL
      }
      setSelectedMedia(null);
      setMediaPreview(null);
      
      setIsPosting(false);
    }, 1000);
  };
  
  // Handle like/unlike post
  const handleLikePost = async (postId) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to like posts');
      return;
    }
    
    // Optimistic update
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          // Check if user already liked the post
          const userId = user.username; // Using username as ID for demo
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
    
    // In a real app, you would make an API call here
    // try {
    //   await axios.post(`http://localhost:8000/api/posts/${postId}/like`, {}, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error liking/unliking post:', error);
    //   // Revert optimistic update if API call fails
    // }
  };
  
  // Handle adding a comment
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to comment');
      return;
    }
    
    // Optimistic update
    const newComment = {
      _id: Date.now().toString(), // Use _id to be consistent with MongoDB
      text: commentText,
      user: {
        username: user.username,
        displayName: user.displayName
      },
      timestamp: 'Just now'
    };
    
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      })
    );
    
    // Reset comment form
    setCommentText('');
    
    // In a real app, you would make an API call here
    // try {
    //   await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, {
    //     text: commentText
    //   }, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error adding comment:', error);
    //   // Revert optimistic update if API call fails
    // }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Home</h1>
      
      {/* Post Creation Form */}
      <div style={styles.postFormContainer}>
        <img 
          src={user.profilePicture} 
          alt={user.displayName} 
          style={styles.userAvatar}
        />
        <form onSubmit={handlePostSubmit} style={styles.postForm}>
          <textarea
            placeholder="Share your creepiest discovery..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            style={styles.postInput}
            disabled={isPosting}
          />
          {/* Media Preview */}
          {mediaPreview && (
            <div style={styles.mediaPreviewContainer}>
              {selectedMedia.type.startsWith('image') ? (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  style={styles.mediaPreview} 
                />
              ) : (
                <video 
                  src={mediaPreview} 
                  controls 
                  style={styles.mediaPreview} 
                />
              )}
              <button 
                onClick={() => {
                  setSelectedMedia(null);
                  setMediaPreview(null);
                }} 
                style={styles.removeMediaButton}
              >
                ✕
              </button>
            </div>
          )}
          
          <div style={styles.postFormFooter}>
            <div style={styles.postFormActions}>
              <label style={styles.mediaLabel}>
                <input
                  type="file"
                  accept="image/*, video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedMedia(file);
                      setMediaPreview(URL.createObjectURL(file));
                    }
                  }}
                  style={styles.mediaInput}
                />
                <span style={styles.mediaIcon}>📷</span>
              </label>
            </div>
            <button 
              type="submit" 
              style={styles.postButton}
              disabled={(!newPostContent.trim() && !selectedMedia) || isPosting}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Feed */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p>{error}</p>
        </div>
      ) : (
        <div style={styles.feedContainer}>
          {feedPosts.map(post => (
          <div key={post._id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <img 
                src={post.user?.profilePicture || reactLogo} 
                alt={post.user?.displayName || 'User'} 
                style={styles.postUserImage}
              />
              <div style={styles.postUserInfo}>
                <span style={styles.postUserName}>{post.user?.displayName || 'User'}</span>
                <span style={styles.postUsername}>@{post.user?.username || post.userId || 'user'}</span>
                <span style={styles.postTimestamp}> · {post.timestamp || post.createdAt || 'Recently'}</span>
              </div>
            </div>
            
            <p style={styles.postContent}>{post.content}</p>
            
            {/* Display media if available */}
            {post.mediaUrl && (
              <div style={styles.mediaContainer}>
                {post.mediaType === 'video' ? (
                  <video 
                    src={post.mediaUrl}
                    controls
                    style={styles.postImage}
                    onError={(e) => {
                      console.error('Error loading video:', e);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <img 
                    src={post.mediaUrl}
                    alt="Post content" 
                    style={styles.postImage}
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.target.src = reactLogo; // Use fallback image
                      e.target.style.objectFit = 'contain';
                      e.target.style.height = '100px';
                    }}
                  />
                )}
              </div>
            )}
            
            <div style={styles.postFooter}>
              <div 
                style={styles.postAction}
                onClick={() => handleLikePost(post._id)}
              >
                <span style={styles.actionIcon}>
                  {post.likes.includes(user.username) ? '❤️' : '🤍'}
                </span>
                <span>{post.likes.length}</span>
              </div>
              <div 
                style={styles.postAction}
                onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
              >
                <span style={styles.actionIcon}>💬</span>
                <span>{post.comments ? post.comments.length : 0}</span>
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
                {post.comments && post.comments.length > 0 && (
                  <div style={styles.commentsList}>
                    {post.comments.map(comment => (
                      <div key={comment._id} style={styles.commentItem}>
                        <div style={styles.commentHeader}>
                          <span style={styles.commentUser}>{comment.user?.displayName || comment.userId || 'User'}</span>
                          <span style={styles.commentTimestamp}>{comment.timestamp || comment.createdAt || 'Recently'}</span>
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
  );
};
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#ff4757',
  },
  postFormContainer: {
    display: 'flex',
    marginBottom: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '15px',
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '15px',
    objectFit: 'cover',
  },
  postForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  postInput: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    fontSize: '16px',
    minHeight: '80px',
    resize: 'none',
    marginBottom: '10px',
    outline: 'none',
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginBottom: '15px',
    borderRadius: '10px',
    overflow: 'hidden',
    maxHeight: '300px',
  },
  mediaPreview: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    backgroundColor: '#2a2a2a',
    borderRadius: '10px',
  },
  removeMediaButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
  },
  postFormFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postFormActions: {
    display: 'flex',
    gap: '10px',
  },
  mediaLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#2a2a2a',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#3a3a3a',
    },
  },
  mediaInput: {
    display: 'none',
  },
  mediaIcon: {
    fontSize: '18px',
  },
  postButton: {
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  feedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  postCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '15px',
  },
  postHeader: {
    display: 'flex',
    marginBottom: '10px',
  },
  postUserImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    objectFit: 'cover',
  },
  postUserInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  postUserName: {
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginRight: '5px',
  },
  postUsername: {
    color: '#888',
    marginRight: '5px',
  },
  postTimestamp: {
    color: '#888',
  },
  postContent: {
    marginBottom: '15px',
    lineHeight: '1.5',
    color: '#e0e0e0',
  },
  mediaContainer: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '15px',
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  postImage: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '15px',
    maxHeight: '400px',
    objectFit: 'cover',
    display: 'block',
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
  }
};

export default Home;