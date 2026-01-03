import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Auth.css';

function Login({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
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
              <h2 className="auth-title">Log In</h2>
              <p className="text-muted">
                By continuing, you agree to our User Agreement and Privacy Policy.
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
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

              <Button
                variant="primary"
                type="submit"
                className="w-100 auth-button mb-3"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Log In'}
              </Button>
            </Form>

            <div className="text-center">
              <span className="text-muted">New to Reddit Clone? </span>
              <Link to="/register" className="auth-link">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
