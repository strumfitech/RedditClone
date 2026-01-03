import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './CreateCommunity.css';

function CreateCommunity({ addCommunity }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('public');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Community name is required');
      return;
    }

    if (name.length < 3 || name.length > 21) {
      setError('Community name must be between 3 and 21 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setError('Community name can only contain letters, numbers, and underscores');
      return;
    }

    if (!description.trim()) {
      setError('Community description is required');
      return;
    }

    const communityId = addCommunity({
      name: `r/${name}`,
      description: description.trim(),
      type
    });

    navigate(`/r/${name}`);
  };

  return (
    <Container className="create-community-container">
      <Card className="create-community-card">
        <Card.Header className="create-community-header">
          <h4>Create a community</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="form-label-bold">Name</Form.Label>
              <p className="form-help-text">
                Community names including capitalization cannot be changed.
              </p>
              <div className="name-input-wrapper">
                <span className="name-prefix">r/</span>
                <Form.Control
                  type="text"
                  placeholder="community_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="name-input"
                  maxLength={21}
                />
              </div>
              <Form.Text className="text-muted">
                {name.length}/21 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Tell people what your community is about"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="description-input"
                maxLength={500}
              />
              <Form.Text className="text-muted">
                {description.length}/500 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-bold">Community Type</Form.Label>
              <div className="community-type-options">
                <Form.Check
                  type="radio"
                  id="public"
                  name="communityType"
                  label={
                    <div>
                      <div className="type-label">
                        <i className="bi bi-person me-2"></i>
                        Public
                      </div>
                      <div className="type-description">
                        Anyone can view, post, and comment to this community
                      </div>
                    </div>
                  }
                  value="public"
                  checked={type === 'public'}
                  onChange={(e) => setType(e.target.value)}
                  className="type-radio"
                />
                <Form.Check
                  type="radio"
                  id="restricted"
                  name="communityType"
                  label={
                    <div>
                      <div className="type-label">
                        <i className="bi bi-eye me-2"></i>
                        Restricted
                      </div>
                      <div className="type-description">
                        Anyone can view this community, but only approved users can post
                      </div>
                    </div>
                  }
                  value="restricted"
                  checked={type === 'restricted'}
                  onChange={(e) => setType(e.target.value)}
                  className="type-radio"
                />
                <Form.Check
                  type="radio"
                  id="private"
                  name="communityType"
                  label={
                    <div>
                      <div className="type-label">
                        <i className="bi bi-lock me-2"></i>
                        Private
                      </div>
                      <div className="type-description">
                        Only approved users can view and submit to this community
                      </div>
                    </div>
                  }
                  value="private"
                  checked={type === 'private'}
                  onChange={(e) => setType(e.target.value)}
                  className="type-radio"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="nsfw"
                label="18+ community"
                className="nsfw-checkbox"
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

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
                className="create-btn"
              >
                Create Community
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateCommunity;
