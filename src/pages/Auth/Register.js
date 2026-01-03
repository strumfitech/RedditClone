import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Auth.css';

function Register({ register }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const success = await register(username, email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Email might already be in use.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <div className="auth-wrapper">
        <Card className="auth-card">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="auth-title">Sign Up</h2>
              <p className="text-muted">
                By continuing, you agree to our User Agreement and Privacy Policy.
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="lg"
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Choose wisely—usernames are permanent
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="lg"
                  disabled={loading}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 auth-button mb-3"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>

            <div className="text-center">
              <span className="text-muted">Already a redditor? </span>
              <Link to="/login" className="auth-link">Log In</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Register;
