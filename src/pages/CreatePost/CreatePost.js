import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Nav, Alert } from 'react-bootstrap';
import './CreatePost.css';

function CreatePost({ addPost, communities }) {
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [community, setCommunity] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 300) {
      setError('Title must be 300 characters or less');
      return;
    }

    if (!community) {
      setError('Please select a community');
      return;
    }

    if (postType === 'text' && !content.trim()) {
      setError('Post content is required');
      return;
    }

    if (postType === 'link' && !content.trim()) {
      setError('Link URL is required');
      return;
    }

    if (postType === 'link' && !content.match(/^https?:\/\/.+/)) {
      setError('Please enter a valid URL');
      return;
    }

    const postId = addPost({
      title: title.trim(),
      content: content.trim(),
      community,
      type: postType
    });

    navigate(`/post/${postId}`);
  };

  return (
    <Container className="create-post-container">
      <Card className="create-post-card">
        <Card.Header className="create-post-header">
          <h4>Create a post</h4>
        </Card.Header>
        <Card.Body>
          {/* Community Selection */}
          <Form.Group className="mb-3">
            <Form.Select 
              size="lg"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="community-select"
            >
              <option value="">Choose a community</option>
              {communities.map(comm => (
                <option key={comm.id} value={comm.name}>
                  {comm.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Post Type Tabs */}
          <Nav variant="tabs" className="post-type-tabs mb-3">
            <Nav.Item>
              <Nav.Link 
                active={postType === 'text'} 
                onClick={() => setPostType('text')}
              >
                <i className="bi bi-file-text me-2"></i>
                Post
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={postType === 'link'} 
                onClick={() => setPostType('link')}
              >
                <i className="bi bi-link-45deg me-2"></i>
                Link
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={postType === 'image'} 
                onClick={() => setPostType('image')}
              >
                <i className="bi bi-image me-2"></i>
                Image
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
              />
              <Form.Text className="text-muted">
                {title.length}/300
              </Form.Text>
            </Form.Group>

            {/* Content */}
            {postType === 'text' && (
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={10}
                  placeholder="Text (optional)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="content-input"
                />
              </Form.Group>
            )}

            {postType === 'link' && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="url"
                  placeholder="Url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="content-input"
                />
              </Form.Group>
            )}

            {postType === 'image' && (
              <div className="upload-area">
                <i className="bi bi-image upload-icon"></i>
                <p>Drag and drop images or click to upload</p>
                <Button variant="outline-primary">Upload</Button>
                <Form.Text className="text-muted d-block mt-2">
                  Image upload feature coming soon!
                </Form.Text>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="submit-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
                className="me-2"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="submit-btn"
                disabled={postType === 'image'}
              >
                Post
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Rules Card */}
      <Card className="rules-card">
        <Card.Header className="rules-header">
          <i className="bi bi-shield-check me-2"></i>
          Posting to Reddit
        </Card.Header>
        <Card.Body>
          <ol className="rules-list">
            <li>Remember the human</li>
            <li>Behave like you would in real life</li>
            <li>Look for the original source of content</li>
            <li>Search for duplicates before posting</li>
            <li>Read the community's rules</li>
          </ol>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreatePost;
