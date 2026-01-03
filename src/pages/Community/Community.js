import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Nav } from 'react-bootstrap';
import Post from '../../components/Post/Post';
import './Community.css';

function Community({ posts, communities, updatePost, deletePost, user }) {
  const { community } = useParams();
  const [filter, setFilter] = useState('hot');

  const communityData = communities.find(c => c.name === `r/${community}`);
  const communityPosts = posts.filter(p => p.community === `r/${community}`);

  const sortPosts = (posts, filter) => {
    const sorted = [...posts];
    
    switch (filter) {
      case 'hot':
        return sorted.sort((a, b) => {
          const scoreA = a.upvotes - a.downvotes;
          const scoreB = b.upvotes - b.downvotes;
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          const ageA = Date.now() - timeA;
          const ageB = Date.now() - timeB;
          const hotA = scoreA / Math.pow(ageA / 3600000 + 2, 1.5);
          const hotB = scoreB / Math.pow(ageB / 3600000 + 2, 1.5);
          return hotB - hotA;
        });
      case 'new':
        return sorted.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
      case 'top':
        return sorted.sort((a, b) => 
          (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
        );
      default:
        return sorted;
    }
  };

  const sortedPosts = sortPosts(communityPosts, filter);

  if (!communityData) {
    return (
      <div className="community-container">
        <Card className="community-not-found">
          <Card.Body className="text-center">
            <h4>Community not found</h4>
            <p className="text-muted">This community doesn't exist or has been removed.</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="community-container">
      {/* Community Header */}
      <div className="community-header">
        <div className="community-banner"></div>
        <div className="community-info-bar">
          <div className="community-icon-large">
            <i className="bi bi-reddit"></i>
          </div>
          <div className="community-title-section">
            <h1 className="community-title">{communityData.name}</h1>
            <p className="community-subtitle">r/{community}</p>
          </div>
          <Button variant="primary" className="join-btn">
            <i className="bi bi-plus me-2"></i>
            Join
          </Button>
        </div>
      </div>

      {/* Community Content */}
      <div className="community-content">
        <div className="community-posts">
          <Card className="filter-card">
            <Nav variant="pills" className="filter-nav">
              <Nav.Item>
                <Nav.Link 
                  active={filter === 'hot'} 
                  onClick={() => setFilter('hot')}
                  className="filter-link"
                >
                  <i className="bi bi-fire me-2"></i>
                  Hot
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={filter === 'new'} 
                  onClick={() => setFilter('new')}
                  className="filter-link"
                >
                  <i className="bi bi-star me-2"></i>
                  New
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={filter === 'top'} 
                  onClick={() => setFilter('top')}
                  className="filter-link"
                >
                  <i className="bi bi-bar-chart me-2"></i>
                  Top
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>

          {sortedPosts.length > 0 ? (
            sortedPosts.map(post => (
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
                <i className="bi bi-inbox" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                <h4 className="mt-3">No posts yet</h4>
                <p className="text-muted">Be the first to post in this community!</p>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Community Sidebar */}
        <div className="community-sidebar">
          <Card className="community-about-card">
            <Card.Header className="community-about-header">
              About Community
            </Card.Header>
            <Card.Body>
              <p className="community-description">
                {communityData.description}
              </p>
              <div className="community-stats">
                <div className="stat">
                  <div className="stat-value">{communityData.members.toLocaleString()}</div>
                  <div className="stat-label">Members</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{Math.floor(communityData.members / 20)}</div>
                  <div className="stat-label">Online</div>
                </div>
              </div>
              <hr />
              <div className="community-created">
                <i className="bi bi-cake2 me-2"></i>
                Created {communityData.createdAt ? new Date(communityData.createdAt).toLocaleDateString() : 'Jan 1, 2024'}
              </div>
              {user && (
                <Button variant="primary" className="w-100 mt-3 create-post-btn-sidebar">
                  Create Post
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card className="community-rules-card">
            <Card.Header className="community-rules-header">
              r/{community} Rules
            </Card.Header>
            <Card.Body>
              <ol className="rules-list">
                <li>Be respectful and civil</li>
                <li>No spam or self-promotion</li>
                <li>Stay on topic</li>
                <li>No harassment or bullying</li>
                <li>Follow Reddit's content policy</li>
              </ol>
            </Card.Body>
          </Card>

          <Card className="moderators-card">
            <Card.Header className="moderators-header">
              Moderators
            </Card.Header>
            <Card.Body>
              <div className="moderator-item">
                <i className="bi bi-shield-fill-check me-2 text-success"></i>
                <span>u/{communityData.createdBy || 'admin'}</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Community;
