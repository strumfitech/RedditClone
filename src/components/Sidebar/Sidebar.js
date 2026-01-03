import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, ListGroup } from 'react-bootstrap';
import './Sidebar.css';

function Sidebar({ communities, user }) {
  const topCommunities = communities.slice(0, 5).sort((a, b) => (b.memberCount || b.members || 0) - (a.memberCount || a.members || 0));

  return (
    <div className="sidebar">
      {/* Home Card */}
      <Card className="sidebar-card mb-3">
        <Card.Body>
          <div className="home-header">
            <i className="bi bi-house-door-fill"></i>
            <h5>Home</h5>
          </div>
          <p className="home-description">
            Your personal Reddit frontpage. Come here to check in with your favorite communities.
          </p>
          <div className="d-grid gap-2">
            <Button 
              as={Link} 
              to="/submit" 
              variant="primary" 
              className="sidebar-btn-primary"
              disabled={!user}
            >
              Create Post
            </Button>
            <Button 
              as={Link} 
              to="/create-community" 
              variant="outline-primary"
              className="sidebar-btn-outline"
              disabled={!user}
            >
              Create Community
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Top Communities */}
      <Card className="sidebar-card">
        <Card.Header className="sidebar-header">
          <i className="bi bi-graph-up me-2"></i>
          Top Communities
        </Card.Header>
        <ListGroup variant="flush">
          {topCommunities.map((community, index) => (
            <ListGroup.Item 
              key={community.id} 
              as={Link} 
              to={`/r/${community.name.replace('r/', '')}`}
              className="community-item"
            >
              <div className="community-info">
                <div className="community-rank">{index + 1}</div>
                <div className="community-icon">
                  <i className="bi bi-reddit"></i>
                </div>
                <div className="community-details">
                  <div className="community-name">{community.name}</div>
                  <div className="community-members">
                    {(community.memberCount || community.members || 0).toLocaleString()} members
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Footer className="text-center">
          <Button variant="link" size="sm" className="view-all-btn">
            View All
          </Button>
        </Card.Footer>
      </Card>

      {/* Policy Links */}
      <div className="policy-links">
        <a href="#" className="policy-link">User Agreement</a>
        <a href="#" className="policy-link">Privacy Policy</a>
        <a href="#" className="policy-link">Content Policy</a>
        <a href="#" className="policy-link">Moderator Code of Conduct</a>
      </div>

      <div className="copyright">
        Reddit Clone © 2024. All rights reserved.
      </div>
    </div>
  );
}

export default Sidebar;
