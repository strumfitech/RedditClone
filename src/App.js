import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CreatePost from './pages/CreatePost/CreatePost';
import PostDetail from './pages/PostDetail/PostDetail';
import Community from './pages/Community/Community';
import Profile from './pages/Profile/Profile';
import CreateCommunity from './pages/CreateCommunity/CreateCommunity';
import Search from './pages/Search/Search';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load posts from localStorage
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      const samplePosts = [
        {
          id: 1,
          title: "Welcome to Reddit Clone!",
          content: "This is a fully functional Reddit clone built with React, HTML, CSS, and Bootstrap. Feel free to explore all features!",
          author: "admin",
          community: "r/announcements",
          upvotes: 42,
          downvotes: 2,
          comments: [],
          timestamp: new Date().toISOString(),
          type: "text"
        },
        {
          id: 2,
          title: "Check out this amazing React tutorial!",
          content: "https://react.dev",
          author: "developer",
          community: "r/programming",
          upvotes: 156,
          downvotes: 12,
          comments: [],
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "link"
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('posts', JSON.stringify(samplePosts));
    }

    // Load communities from localStorage
    const savedCommunities = localStorage.getItem('communities');
    if (savedCommunities) {
      setCommunities(JSON.parse(savedCommunities));
    } else {
      // Initialize with sample communities
      const sampleCommunities = [
        { id: 1, name: "r/announcements", members: 1250, description: "Official announcements" },
        { id: 2, name: "r/programming", members: 5420, description: "Programming discussions" },
        { id: 3, name: "r/funny", members: 8930, description: "Funny content" },
        { id: 4, name: "r/technology", members: 3210, description: "Technology news" },
        { id: 5, name: "r/gaming", members: 6540, description: "Gaming community" }
      ];
      setCommunities(sampleCommunities);
      localStorage.setItem('communities', JSON.stringify(sampleCommunities));
    }
  }, []);

  const login = (username, password) => {
    // Simple authentication (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
      const userData = { username, karma: users[username].karma || 0 };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (username, email, password) => {
    // Simple registration (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      return false; // User already exists
    }
    users[username] = { email, password, karma: 0, joinDate: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify(users));
    const userData = { username, karma: 0 };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now(),
      author: user.username,
      upvotes: 1,
      downvotes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    return newPost.id;
  };

  const updatePost = (postId, updates) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const updateComment = (postId, commentId, content) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment =>
          comment.id === commentId ? { ...comment, content, edited: true } : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const deleteComment = (postId, commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter(comment => comment.id !== commentId);
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: user.username,
          content: comment,
          upvotes: 1,
          downvotes: 0,
          timestamp: new Date().toISOString()
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const addCommunity = (community) => {
    const newCommunity = {
      ...community,
      id: Date.now(),
      members: 1,
      createdBy: user.username,
      createdAt: new Date().toISOString()
    };
    const updatedCommunities = [...communities, newCommunity];
    setCommunities(updatedCommunities);
    localStorage.setItem('communities', JSON.stringify(updatedCommunities));
    return newCommunity.id;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} logout={logout} />
        <div className="main-container">
          <Routes>
            <Route path="/" element={
              <div className="content-wrapper">
                <Home posts={posts} updatePost={updatePost} deletePost={deletePost} user={user} />
                <Sidebar communities={communities} user={user} />
              </div>
            } />
            <Route path="/search" element={
              <Search posts={posts} communities={communities} updatePost={updatePost} user={user} />
            } />
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login login={login} />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" /> : <Register register={register} />
            } />
            <Route path="/submit" element={
              user ? <CreatePost addPost={addPost} communities={communities} /> : <Navigate to="/login" />
            } />
            <Route path="/post/:id" element={
              <div className="content-wrapper">
                <PostDetail 
                  posts={posts} 
                  updatePost={updatePost} 
                  deletePost={deletePost}
                  addComment={addComment} 
                  updateComment={updateComment}
                  deleteComment={deleteComment}
                  user={user} 
                />
                <Sidebar communities={communities} user={user} />
              </div>
            } />
            <Route path="/r/:community" element={
              <div className="content-wrapper">
                <Community posts={posts} communities={communities} updatePost={updatePost} deletePost={deletePost} user={user} />
                <Sidebar communities={communities} user={user} />
              </div>
            } />
            <Route path="/user/:username" element={
              <div className="content-wrapper">
                <Profile posts={posts} updatePost={updatePost} deletePost={deletePost} user={user} />
                <Sidebar communities={communities} user={user} />
              </div>
            } />
            <Route path="/create-community" element={
              user ? <CreateCommunity addCommunity={addCommunity} /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
