import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Nav, Form, InputGroup } from 'react-bootstrap';
import Post from '../../components/Post/Post';
import './Search.css';

function Search({ posts, communities, updatePost, user }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filter, setFilter] = useState('posts');
  const [sortBy, setSortBy] = useState('relevance');

  const searchPosts = () => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.community.toLowerCase().includes(lowerQuery) ||
      post.author.toLowerCase().includes(lowerQuery)
    );
  };

  const searchCommunities = () => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return communities.filter(community =>
      community.name.toLowerCase().includes(lowerQuery) ||
      community.description.toLowerCase().includes(lowerQuery)
    );
  };

  const sortResults = (results) => {
    const sorted = [...results];
    switch (sortBy) {
      case 'relevance':
        // Simple relevance: title match scores higher
        return sorted.sort((a, b) => {
          const aScore = a.title?.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
          const bScore = b.title?.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
          return bScore - aScore;
        });
      case 'new':
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'top':
        return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      default:
        return sorted;
    }
  };

  const postResults = filter === 'posts' ? sortResults(searchPosts()) : [];
  const communityResults = filter === 'communities' ? searchCommunities() : [];

  return (
    <div className="search-container">
      <div className="search-content">
        <Card className="search-header-card">
          <Card.Body>
            <h5 className="search-results-title">
              Search results for "{query}"
            </h5>
            <p className="text-muted">
              {filter === 'posts' && `${postResults.length} post${postResults.length !== 1 ? 's' : ''} found`}
              {filter === 'communities' && `${communityResults.length} communit${communityResults.length !== 1 ? 'ies' : 'y'} found`}
            </p>
          </Card.Body>
        </Card>

        <Card className="search-filter-card">
          <div className="search-filters">
            <Nav variant="pills" className="filter-nav">
              <Nav.Item>
                <Nav.Link 
                  active={filter === 'posts'} 
                  onClick={() => setFilter('posts')}
                  className="filter-link"
                >
                  <i className="bi bi-file-text me-2"></i>
                  Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={filter === 'communities'} 
                  onClick={() => setFilter('communities')}
                  className="filter-link"
                >
                  <i className="bi bi-people me-2"></i>
                  Communities
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {filter === 'posts' && (
              <Form.Select 
                size="sm" 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="new">New</option>
                <option value="top">Top</option>
              </Form.Select>
            )}
          </div>
        </Card>

        <div className="search-results">
          {filter === 'posts' && (
            <>
              {postResults.length > 0 ? (
                postResults.map(post => (
                  <Post 
                    key={post.id} 
                    post={post} 
                    updatePost={updatePost}
                    user={user}
                  />
                ))
              ) : (
                <Card className="empty-state">
                  <Card.Body className="text-center">
                    <i className="bi bi-search" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                    <h4 className="mt-3">No results found</h4>
                    <p className="text-muted">
                      Try different keywords or check your spelling
                    </p>
                  </Card.Body>
                </Card>
              )}
            </>
          )}

          {filter === 'communities' && (
            <>
              {communityResults.length > 0 ? (
                <Card className="communities-results-card">
                  <Card.Body>
                    {communityResults.map(community => (
                      <div key={community.id} className="community-result-item">
                        <div className="community-result-icon">
                          <i className="bi bi-reddit"></i>
                        </div>
                        <div className="community-result-info">
                          <a href={`/r/${community.name.replace('r/', '')}`} className="community-result-name">
                            {community.name}
                          </a>
                          <p className="community-result-description">{community.description}</p>
                          <span className="community-result-members">
                            <i className="bi bi-people me-1"></i>
                            {community.members.toLocaleString()} members
                          </span>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              ) : (
                <Card className="empty-state">
                  <Card.Body className="text-center">
                    <i className="bi bi-search" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
                    <h4 className="mt-3">No communities found</h4>
                    <p className="text-muted">
                      Try different keywords or create a new community
                    </p>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
