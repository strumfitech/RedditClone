import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Dropdown, Modal, Form, Button } from 'react-bootstrap';
import './Post.css';

function Post({ post, updatePost, deletePost, user, compact = false }) {
  const [userVote, setUserVote] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const navigate = useNavigate();

  const score = post.upvotes - post.downvotes;

  const handleVote = (voteType) => {
    if (!user) {
      navigate('/login');
      return;
    }

    let newUpvotes = post.upvotes;
    let newDownvotes = post.downvotes;

    if (userVote === voteType) {
      // Remove vote
      if (voteType === 'up') newUpvotes--;
      else newDownvotes--;
      setUserVote(null);
    } else {
      // Add or change vote
      if (userVote === 'up') newUpvotes--;
      if (userVote === 'down') newDownvotes--;
      
      if (voteType === 'up') newUpvotes++;
      else newDownvotes++;
      
      setUserVote(voteType);
    }

    updatePost(post.id, { upvotes: newUpvotes, downvotes: newDownvotes });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handlePostClick = (e) => {
    if (e.target.closest('.vote-section') || e.target.closest('.post-actions') || e.target.closest('.dropdown')) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      updatePost(post.id, { 
        title: editTitle.trim(), 
        content: editContent.trim(),
        edited: true 
      });
      setShowEditModal(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    if (deletePost) {
      deletePost(post.id);
      setShowDeleteModal(false);
    }
  };

  const isAuthor = user && user.username === post.author;

  return (
    <>
      <Card className={`post-card ${compact ? 'compact' : ''}`}>
        <div className="post-content-wrapper" onClick={handlePostClick}>
        <div className="vote-section">
          <button 
            className={`vote-btn ${userVote === 'up' ? 'voted' : ''}`}
            onClick={() => handleVote('up')}
          >
            <i className="bi bi-arrow-up"></i>
          </button>
          <span className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}>
            {score}
          </span>
          <button 
            className={`vote-btn ${userVote === 'down' ? 'voted' : ''}`}
            onClick={() => handleVote('down')}
          >
            <i className="bi bi-arrow-down"></i>
          </button>
        </div>

        <div className="post-body">
          <div className="post-header">
            <Link to={`/r/${post.community.replace('r/', '')}`} className="post-community">
              {post.community}
            </Link>
            <span className="post-dot">•</span>
            <span className="post-meta">
              Posted by <Link to={`/user/${post.author}`} className="post-author">u/{post.author}</Link>
            </span>
            <span className="post-dot">•</span>
            <span className="post-time">{formatTime(post.timestamp)}</span>
          </div>

          <h3 className="post-title">
            {post.title}
            {post.edited && <span className="edited-badge">(edited)</span>}
          </h3>

          {!compact && post.content && (
            <div className="post-text">
              {post.type === 'link' ? (
                <a href={post.content} target="_blank" rel="noopener noreferrer" className="post-link">
                  {post.content}
                </a>
              ) : (
                <p>{post.content}</p>
              )}
            </div>
          )}

          <div className="post-actions">
            <Link to={`/post/${post.id}`} className="action-btn">
              <i className="bi bi-chat"></i>
              <span>{post.comments?.length || 0} Comments</span>
            </Link>
            <button className="action-btn">
              <i className="bi bi-share"></i>
              <span>Share</span>
            </button>
            <button className="action-btn">
              <i className="bi bi-bookmark"></i>
              <span>Save</span>
            </button>
            
            <Dropdown show={showMenu} onToggle={(isOpen) => setShowMenu(isOpen)}>
              <Dropdown.Toggle as="button" className="action-btn dropdown-toggle-custom">
                <i className="bi bi-three-dots"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                {isAuthor && (
                  <>
                    <Dropdown.Item onClick={handleEdit}>
                      <i className="bi bi-pencil me-2"></i>
                      Edit Post
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleDelete} className="text-danger">
                      <i className="bi bi-trash me-2"></i>
                      Delete Post
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </>
                )}
                <Dropdown.Item>
                  <i className="bi bi-flag me-2"></i>
                  Report
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="bi bi-share me-2"></i>
                  Share
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </Card>

    {/* Edit Modal */}
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={300}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Delete Confirmation Modal */}
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="delete-preview">
          <strong>{post.title}</strong>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirmDelete}>
          Delete Post
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default Post;
