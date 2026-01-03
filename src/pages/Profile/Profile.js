import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Nav, Button } from 'react-bootstrap';
import Post from '../../components/Post/Post';
import './Profile.css';

function Profile({ posts, updatePost, deletePost, user }) {
  const { username } = useParams();
  const [tab, setTab] = useState('posts');

  const userPosts = posts.filter(p => p.author === username);
  const userComments = [];

  // Calculate user karma
  const postKarma = userPosts.reduce((sum, post) => sum + (post.upvotes - post.downvotes), 0);
  const commentKarma = 0; // Would come from comments

  // Get user info from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const userInfo = users[username];
  const joinDate = userInfo?.joinDate ? new Date(userInfo.joinDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) : 'Jan 1, 2024';

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-info-bar">
          <div className="profile-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="profile-details">
            <h1 className="profile-username">u/{username}</h1>
            <p className="profile-karma">
              <i className="bi bi-trophy me-2"></i>
              {postKarma + commentKarma} karma
            </p>
          </div>
          {user && user.username === username && (
            <Button variant="outline-primary" className="edit-profile-btn">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-main">
          <Card className="profile-tabs-card">
            <Nav variant="tabs" className="profile-tabs">
              <Nav.Item>
                <Nav.Link 
                  active={tab === 'posts'} 
                  onClick={() => setTab('posts')}
                >
                  Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={tab === 'comments'} 
                  onClick={() => setTab('comments')}
                >
                  Comments
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={tab === 'saved'} 
                  onClick={() => setTab('saved')}
                >
                  Saved
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={tab === 'upvoted'} 
                  onClick={() => setTab('upvoted')}
                >
                  Upvoted
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>

          {tab === 'posts' && (
            <div className="profile-posts">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <Post 
                    key={post.id} 
                    post={post} 
                    updatePost={updatePost}
                    deletePost={deletePost}
                    user={user}
                  />
                ))
              ) : (
                <Card className="empty-state">
                  <Card.Body className="text-center">
                    <i className="bi bi-file-text" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                    <h4 className="mt-3">No posts yet</h4>
                    <p className="text-muted">u/{username} hasn't posted anything</p>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}

          {tab === 'comments' && (
            <Card className="empty-state">
              <Card.Body className="text-center">
                <i className="bi bi-chat" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                <h4 className="mt-3">No comments yet</h4>
                <p className="text-muted">u/{username} hasn't commented anything</p>
              </Card.Body>
            </Card>
          )}

          {tab === 'saved' && (
            <Card className="empty-state">
              <Card.Body className="text-center">
                <i className="bi bi-bookmark" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                <h4 className="mt-3">No saved posts</h4>
                <p className="text-muted">Save posts to see them here</p>
              </Card.Body>
            </Card>
          )}

          {tab === 'upvoted' && (
            <Card className="empty-state">
              <Card.Body className="text-center">
                <i className="bi bi-arrow-up-circle" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                <h4 className="mt-3">No upvoted posts</h4>
                <p className="text-muted">Upvote posts to see them here</p>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <Card className="profile-card">
            <Card.Body>
              <div className="profile-card-header">
                <i className="bi bi-person-circle me-2"></i>
                u/{username}
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="stat-label">Karma</div>
                  <div className="stat-value">
                    <i className="bi bi-trophy me-1"></i>
                    {postKarma + commentKarma}
                  </div>
                </div>
                <div className="profile-stat">
                  <div className="stat-label">Cake day</div>
                  <div className="stat-value">
                    <i className="bi bi-cake2 me-1"></i>
                    {joinDate}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
