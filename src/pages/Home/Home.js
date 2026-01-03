import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import Post from '../../components/Post/Post';
import './Home.css';

function Home({ posts, updatePost, deletePost, user }) {
  const [filter, setFilter] = useState('hot');

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
      case 'rising':
        return sorted.sort((a, b) => {
          const ageA = Date.now() - new Date(a.timestamp).getTime();
          const ageB = Date.now() - new Date(b.timestamp).getTime();
          const scoreA = a.upvotes - a.downvotes;
          const scoreB = b.upvotes - b.downvotes;
          const risingA = ageA < 86400000 ? scoreA / (ageA / 3600000 + 1) : 0;
          const risingB = ageB < 86400000 ? scoreB / (ageB / 3600000 + 1) : 0;
          return risingB - risingA;
        });
      default:
        return sorted;
    }
  };

  const sortedPosts = sortPosts(posts, filter);

  return (
    <div className="home-container">
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
          <Nav.Item>
            <Nav.Link 
              active={filter === 'rising'} 
              onClick={() => setFilter('rising')}
              className="filter-link"
            >
              <i className="bi bi-graph-up-arrow me-2"></i>
              Rising
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card>

      <div className="posts-container">
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
              <p className="text-muted">Be the first to create a post!</p>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Home;
