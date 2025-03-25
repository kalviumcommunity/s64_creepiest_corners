import { useState } from 'react';
import axios from 'axios';

const UploadFormPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Clear previous selections
    previews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    
    setPreviews(newPreviews);
  };

  // Remove a file from selection
  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setError('');
    
    const formData = new FormData();
    // Backend expects a single file with key 'media'
    if (selectedFiles.length > 0) {
      formData.append('media', selectedFiles[0]);
    }
    
    if (caption) {
      formData.append('caption', caption);
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to upload files');
        setUploading(false);
        return;
      }
      
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      // Add uploaded files to the list
      setUploadedFiles([...uploadedFiles, ...response.data.files || []]);
      
      // Clear form
      setSelectedFiles([]);
      setPreviews([]);
      setCaption('');
      setUploadProgress(0);
      
      // Show success message
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      
      // Check if it's a token-related error
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.toLowerCase().includes('token') || 
          errorMessage.toLowerCase().includes('unauthorized') ||
          error.response?.status === 401 ||
          error.response?.status === 403) {
        
        setError('Authentication error: Your session may have expired. Please log out and log back in to continue uploading.');
        
        // Add a logout button to the error message
        const logoutButton = document.createElement('button');
        logoutButton.innerText = 'Log Out';
        logoutButton.style.marginLeft = '10px';
        logoutButton.onclick = () => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        };
        
        // Append the button to the error message element
        setTimeout(() => {
          const errorElement = document.querySelector('[style*="errorMessage"]');
          if (errorElement) {
            errorElement.appendChild(logoutButton);
          }
        }, 100);
        
      } else {
        setError(errorMessage || 'Error uploading files. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Creepy Content</h1>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* File Selection Area */}
        <div style={styles.fileInputContainer}>
          <label htmlFor="file-input" style={styles.fileInputLabel}>
            <div style={styles.fileInputContent}>
              <span style={styles.fileInputIcon}>📷</span>
              <span style={styles.fileInputText}>
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} file(s) selected` 
                  : 'Click to select images or videos'}
              </span>
            </div>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*, video/*"
            multiple
            onChange={handleFileSelect}
            style={styles.fileInput}
            disabled={uploading}
          />
        </div>
        
        {/* Caption Input */}
        <div style={styles.captionContainer}>
          <textarea
            placeholder="Add a caption to your creepy discovery..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={styles.captionInput}
            disabled={uploading}
          />
        </div>
        
        {/* Preview Area */}
        {previews.length > 0 && (
          <div style={styles.previewsContainer}>
            {previews.map((preview, index) => (
              <div key={index} style={styles.previewItem}>
                {preview.type.startsWith('image') ? (
                  <img src={preview.url} alt={`Preview ${index}`} style={styles.previewImage} />
                ) : (
                  <video src={preview.url} controls style={styles.previewVideo} />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  style={styles.removeButton}
                  disabled={uploading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload Progress */}
        {uploading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${uploadProgress}%`
                }}
              />
            </div>
            <div style={styles.progressText}>{uploadProgress}% Uploaded</div>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          style={styles.submitButton}
          disabled={uploading || selectedFiles.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div style={styles.uploadedContainer}>
          <h2 style={styles.uploadedTitle}>Uploaded Files</h2>
          <div style={styles.uploadedGrid}>
            {uploadedFiles.map((file, index) => (
              <div key={index} style={styles.uploadedItem}>
                {file.type?.startsWith('image') ? (
                  <img 
                    src={file.url || URL.createObjectURL(file)} 
                    alt={`Uploaded ${index}`} 
                    style={styles.uploadedMedia} 
                  />
                ) : (
                  <video 
                    src={file.url || URL.createObjectURL(file)} 
                    controls 
                    style={styles.uploadedMedia} 
                  />
                )}
              </div>
            ))}
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
    padding: '20px',
    color: '#e0e0e0',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#ff4757',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    color: '#ff4757',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fileInputContainer: {
    marginBottom: '15px',
  },
  fileInputLabel: {
    display: 'block',
    backgroundColor: '#1e1e1e',
    border: '2px dashed #333',
    borderRadius: '10px',
    padding: '30px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#ff4757',
      backgroundColor: '#2a2a2a',
    },
  },
  fileInputContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  fileInputIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  fileInputText: {
    fontSize: '16px',
    color: '#888',
  },
  fileInput: {
    display: 'none',
  },
  captionContainer: {
    marginBottom: '15px',
  },
  captionInput: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '10px',
    padding: '15px',
    color: '#e0e0e0',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical',
    outline: 'none',
    '&:focus': {
      borderColor: '#ff4757',
    },
  },
  previewsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  previewItem: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
    aspectRatio: '1/1',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeButton: {
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
    '&:hover': {
      backgroundColor: 'rgba(255, 71, 87, 0.8)',
    },
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#2a2a2a',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff4757',
    transition: 'width 0.3s ease',
  },
  progressText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#888',
  },
  submitButton: {
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#ff2c40',
    },
    '&:disabled': {
      backgroundColor: '#555',
      cursor: 'not-allowed',
    },
  },
  uploadedContainer: {
    marginTop: '40px',
  },
  uploadedTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#e0e0e0',
  },
  uploadedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
  },
  uploadedItem: {
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
    aspectRatio: '1/1',
  },
  uploadedMedia: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default UploadFormPage;