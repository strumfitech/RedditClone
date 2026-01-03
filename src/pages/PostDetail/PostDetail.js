import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Dropdown, Modal } from 'react-bootstrap';
import Post from '../../components/Post/Post';
import './PostDetail.css';

function PostDetail({ posts, updatePost, deletePost, addComment, updateComment, deleteComment, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('best');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="post-detail-container">
        <Alert variant="danger">Post not found</Alert>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const sortComments = (comments) => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'best':
        return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'top':
        return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'new':
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'old':
        return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      default:
        return sorted;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffMs = now - commentTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const sortedComments = sortComments(post.comments || []);

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentContent);
  };

  const handleSaveComment = (commentId) => {
    if (editCommentText.trim()) {
      updateComment(post.id, commentId, editCommentText.trim());
      setEditingCommentId(null);
      setEditCommentText('');
    }
  };

  const handleDeleteComment = (commentId) => {
    setDeleteCommentId(commentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = () => {
    if (deleteCommentId) {
      deleteComment(post.id, deleteCommentId);
      setShowDeleteModal(false);
      setDeleteCommentId(null);
    }
  };

  return (
    <div className="post-detail-container">
      <Post post={post} updatePost={updatePost} deletePost={deletePost} user={user} />

      {/* Comment Form */}
      <Card className="comment-form-card">
        <Card.Body>
          {user ? (
            <Form onSubmit={handleCommentSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="comment-label">
                  Comment as <strong>{user.username}</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="What are your thoughts?"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="comment-textarea"
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="text-end">
                <Button type="submit" className="comment-submit-btn">
                  Comment
                </Button>
              </div>
            </Form>
          ) : (
            <div className="login-prompt">
              <p>Log in or sign up to leave a comment</p>
              <div>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/login')}
                  className="me-2"
                >
                  Log In
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Comments Section */}
      <Card className="comments-section-card">
        <Card.Body>
          <div className="comments-header">
            <div className="comments-sort">
              <span className="sort-label">Sort by:</span>
              <Button 
                variant="link" 
                className={`sort-btn ${sortBy === 'best' ? 'active' : ''}`}
                onClick={() => setSortBy('best')}
              >
                Best
              </Button>
              <Button 
                variant="link" 
                className={`sort-btn ${sortBy === 'top' ? 'active' : ''}`}
                onClick={() => setSortBy('top')}
              >
                Top
              </Button>
              <Button 
                variant="link" 
                className={`sort-btn ${sortBy === 'new' ? 'active' : ''}`}
                onClick={() => setSortBy('new')}
              >
                New
              </Button>
              <Button 
                variant="link" 
                className={`sort-btn ${sortBy === 'old' ? 'active' : ''}`}
                onClick={() => setSortBy('old')}
              >
                Old
              </Button>
            </div>
          </div>

          {sortedComments.length > 0 ? (
            <div className="comments-list">
              {sortedComments.map(comment => {
                const isCommentAuthor = user && user.username === comment.author;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className="comment">
                    <div className="comment-vote">
                      <button className="comment-vote-btn">
                        <i className="bi bi-arrow-up"></i>
                      </button>
                      <span className="comment-score">
                        {comment.upvotes - comment.downvotes}
                      </span>
                      <button className="comment-vote-btn">
                        <i className="bi bi-arrow-down"></i>
                      </button>
                    </div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">u/{comment.author}</span>
                        <span className="comment-dot">•</span>
                        <span className="comment-time">{formatTime(comment.timestamp)}</span>
                        {comment.edited && <span className="edited-badge-comment">(edited)</span>}
                      </div>
                      
                      {isEditing ? (
                        <div className="comment-edit-form">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="comment-edit-textarea"
                          />
                          <div className="comment-edit-actions">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              variant="primary" 
                              onClick={() => handleSaveComment(comment.id)}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="comment-content">{comment.content}</div>
                      )}
                      
                      <div className="comment-actions">
                        <button className="comment-action-btn">
                          <i className="bi bi-reply me-1"></i>
                          Reply
                        </button>
                        <button className="comment-action-btn">
                          <i className="bi bi-share me-1"></i>
                          Share
                        </button>
                        
                        {isCommentAuthor && !isEditing && (
                          <>
                            <button 
                              className="comment-action-btn"
                              onClick={() => handleEditComment(comment.id, comment.content)}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Edit
                            </button>
                            <button 
                              className="comment-action-btn text-danger"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </>
                        )}
                        
                        {!isCommentAuthor && (
                          <button className="comment-action-btn">
                            <i className="bi bi-flag me-1"></i>
                            Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-comments">
              <i className="bi bi-chat" style={{ fontSize: '48px', color: 'var(--reddit-gray)' }}></i>
              <p>No comments yet</p>
              <p className="text-muted">Be the first to share what you think!</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Comment Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteComment}>
            Delete Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostDetail;
