import { useState } from 'react';

const Home = () => {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // Mock user data
  const user = {
    username: 'darkexplorer',
    displayName: 'The Dark Explorer',
    profilePicture: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
  };

  // Mock feed data
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 1,
      user: {
        username: 'ghosthunter',
        displayName: 'Ghost Hunter',
        profilePicture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61'
      },
      content: 'Found this creepy abandoned hospital last night. The sounds coming from the third floor were unexplainable...',
      imageUrl: 'https://images.unsplash.com/photo-1635224983665-8f0b34a82487',
      timestamp: '2 hours ago',
      likes: 42,
      comments: 13
    },
    {
      id: 2,
      user: {
        username: 'midnightwalker',
        displayName: 'Midnight Walker',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
      },
      content: 'This strange figure appears in my photos whenever I visit this forest. No one else can see it.',
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3',
      timestamp: '5 hours ago',
      likes: 128,
      comments: 27
    },
    {
      id: 3,
      user: {
        username: 'paranormalexpert',
        displayName: 'Paranormal Expert',
        profilePicture: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12'
      },
      content: 'The legend of the crying woman has been documented in over 17 countries. Here\'s my encounter from last week.',
      imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c',
      timestamp: '1 day ago',
      likes: 89,
      comments: 31
    },
    {
      id: 4,
      user: {
        username: 'hauntedhistorian',
        displayName: 'Haunted Historian',
        profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
      },
      content: 'Researching the Blackwood Asylum case. Multiple witnesses reported seeing the same apparition in the east wing. @darkexplorer has documented some of the most compelling evidence.',
      imageUrl: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e',
      timestamp: '2 days ago',
      likes: 156,
      comments: 42
    }
  ]);

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
        id: Date.now(),
        user: {
          username: user.username,
          displayName: user.displayName,
          profilePicture: user.profilePicture
        },
        content: newPostContent,
        imageUrl: mediaPreview, // Include the media preview URL
        timestamp: 'Just now',
        likes: 0,
        comments: 0
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
      <div style={styles.feedContainer}>
        {feedPosts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <img 
                src={post.user.profilePicture} 
                alt={post.user.displayName} 
                style={styles.postUserImage}
              />
              <div style={styles.postUserInfo}>
                <span style={styles.postUserName}>{post.user.displayName}</span>
                <span style={styles.postUsername}>@{post.user.username}</span>
                <span style={styles.postTimestamp}> · {post.timestamp}</span>
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
  postImage: {
    width: '100%',
    borderRadius: '10px',
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

export default Home;