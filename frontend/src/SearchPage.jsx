import { useState } from 'react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for search results
  const mockPosts = [
    {
      _id: '1', // Use _id to be consistent with MongoDB
      username: 'ghosthunter',
      content: 'Found this creepy abandoned hospital last night. The sounds coming from the third floor were unexplainable...',
      imageUrl: 'https://images.unsplash.com/photo-1635224983665-8f0b34a82487',
      timestamp: '2 hours ago',
      likes: 42,
      comments: 13
    },
    {
      _id: '2', // Use _id to be consistent with MongoDB
      username: 'midnightwalker',
      content: 'This strange figure appears in my photos whenever I visit this forest. No one else can see it.',
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3',
      timestamp: '5 hours ago',
      likes: 128,
      comments: 27
    },
    {
      _id: '3', // Use _id to be consistent with MongoDB
      username: 'paranormalexpert',
      content: 'The legend of the crying woman has been documented in over 17 countries. Here\'s my encounter from last week.',
      imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c',
      timestamp: '1 day ago',
      likes: 89,
      comments: 31
    }
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Filter mock posts based on search query
      const filteredResults = mockPosts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Search Creepy Content</h1>
      
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search for creepy posts, users, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <p>Searching the darkest corners...</p>
        </div>
      ) : (
        <div style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            searchResults.map(post => (
              <div key={post._id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <h3 style={styles.username}>@{post.username}</h3>
                  <span style={styles.timestamp}>{post.timestamp}</span>
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
                  <span style={styles.postStat}>{post.likes} likes</span>
                  <span style={styles.postStat}>{post.comments} comments</span>
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <p style={styles.noResults}>No creepy findings match your search...</p>
          ) : (
            <p style={styles.initialMessage}>
              Search for the most disturbing content from the darkest corners of the internet.
            </p>
          )}
        </div>
      )}
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
  searchForm: {
    display: 'flex',
    marginBottom: '30px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '30px 0 0 30px',
    border: '1px solid #333',
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    outline: 'none',
  },
  searchButton: {
    padding: '12px 20px',
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '0 30px 30px 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#888',
  },
  resultsContainer: {
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  username: {
    margin: 0,
    color: '#ff4757',
    fontSize: '18px',
  },
  timestamp: {
    color: '#888',
    fontSize: '14px',
  },
  postContent: {
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  postImage: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  postFooter: {
    display: 'flex',
    gap: '15px',
  },
  postStat: {
    color: '#888',
    fontSize: '14px',
  },
  noResults: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#888',
  },
  initialMessage: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#888',
    fontStyle: 'italic',
  }
};

export default SearchPage;