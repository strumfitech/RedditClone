import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, Form, Button, Dropdown } from 'react-bootstrap';
import './Navbar.css';

function Navbar({ user, logout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar bg="white" expand="lg" fixed="top" className="navbar-custom">
      <Container fluid>
        <BSNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <i className="bi bi-reddit"></i>
          <span className="brand-text">reddit</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Form className="search-form mx-auto" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <Form.Control
                type="search"
                placeholder="Search Reddit"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Form>

          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Button 
                  as={Link} 
                  to="/submit" 
                  variant="outline-primary" 
                  className="create-post-btn me-3"
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Create Post
                </Button>
                
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" className="user-dropdown">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.username}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/user/${user.username}`}>
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/create-community">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Community
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  className="me-2"
                >
                  Log In
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="signup-btn"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
