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

// Import Firebase services
import {
  firebaseAuth,
  postService,
  commentService,
  communityService,
  userService,
  voteService,
  firebaseUtils
} from './services/firebaseService';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get additional user data from Firestore
          const userResult = await userService.getUserByUid(firebaseUser.uid);
          if (userResult.success) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...userResult.user
            });
          } else {
            // Fallback to basic Firebase user data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              username: firebaseUser.displayName || firebaseUser.email,
              karma: 0
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            username: firebaseUser.displayName || firebaseUser.email,
            karma: 0
          });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (authLoading) return;

      try {
        setLoading(true);

        // Load communities
        const communitiesResult = await communityService.getCommunities();
        if (communitiesResult.success) {
          setCommunities(communitiesResult.communities);
        }

        // Load posts
        const postsResult = await postService.getPosts();
        if (postsResult.success) {
          setPosts(postsResult.posts);
        }

      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [authLoading]);

  // Firebase Authentication Functions
  const login = async (email, password) => {
    try {
      const result = await firebaseAuth.login(email, password);
      return result.success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await firebaseAuth.register(email, password, username);
      return result.success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const result = await firebaseAuth.logout();
      if (result.success) {
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Firebase Data Functions
  const addPost = async (postData) => {
    if (!user) return null;

    try {
      // Find community by name
      const community = communities.find(c => c.name === postData.community);
      if (!community) {
        console.error('Community not found:', postData.community);
        return null;
      }

      const post = {
        title: postData.title,
        content: postData.content,
        type: postData.type || 'text',
        communityId: community.id,
        communityName: community.name
      };

      const result = await postService.createPost(post, user);
      if (result.success) {
        // Refresh posts
        const postsResult = await postService.getPosts();
        if (postsResult.success) {
          setPosts(postsResult.posts);
        }
        return result.postId;
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    return null;
  };

  const updatePost = async (postId, updates) => {
    try {
      if (updates.upvotes !== undefined || updates.downvotes !== undefined) {
        // Update votes
        const result = await postService.updatePostVotes(postId, updates.upvotes, updates.downvotes);
        if (result.success) {
          // Refresh posts
          const postsResult = await postService.getPosts();
          if (postsResult.success) {
            setPosts(postsResult.posts);
          }
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (postId) => {
    if (!user) return;

    try {
      const result = await postService.deletePost(postId, user.uid);
      if (result.success) {
        // Refresh posts
        const postsResult = await postService.getPosts();
        if (postsResult.success) {
          setPosts(postsResult.posts);
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const addComment = async (postId, commentContent) => {
    if (!user) return;

    try {
      const result = await commentService.addComment(postId, commentContent, user);
      if (result.success) {
        // Refresh posts to get updated comment count
        const postsResult = await postService.getPosts();
        if (postsResult.success) {
          setPosts(postsResult.posts);
        }
        return result.commentId;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    return null;
  };

  const updateComment = async (postId, commentId, content) => {
    // Comments are updated directly in the component using Firebase
    // This function is kept for compatibility but may not be needed
    console.log('updateComment called - implement if needed');
  };

  const deleteComment = async (postId, commentId) => {
    // Comments are deleted directly in the component using Firebase
    // This function is kept for compatibility but may not be needed
    console.log('deleteComment called - implement if needed');
  };

  const addCommunity = async (communityData) => {
    if (!user) return null;

    try {
      const community = {
        name: `r/${communityData.name}`,
        displayName: communityData.name,
        description: communityData.description,
        rules: communityData.rules || '',
        isPrivate: false,
        isRestricted: false
      };

      const result = await communityService.createCommunity(community, user);
      if (result.success) {
        // Refresh communities
        const communitiesResult = await communityService.getCommunities();
        if (communitiesResult.success) {
          setCommunities(communitiesResult.communities);
        }
        return result.communityId;
      }
    } catch (error) {
      console.error('Error creating community:', error);
    }
    return null;
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
