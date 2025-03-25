import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignupPage";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // Adjust the endpoint as necessary
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch posts for the selected user
    const fetchPosts = async () => {
      if (selectedUser) {
        const response = await fetch(`/api/users/${selectedUser}/posts`);
        const data = await response.json();
        setPosts(data);
      }
    };

    fetchPosts();
  }, [selectedUser]);

  return (
    <div>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select a user</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>

      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
