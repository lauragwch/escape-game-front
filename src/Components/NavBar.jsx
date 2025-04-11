import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/NavBar.css'; 

const NavBar = () => {
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // C'est le système d'authentification
  const isConnected = !!token;

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top" 
      className={`mb-4 ${scroll ? 'active' : ''}`} 
    >
      <Navbar.Brand onClick={() => navigate('/')}>Escape Adventure</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link onClick={() => navigate('/')}>Accueil</Nav.Link>
          <Nav.Link onClick={() => navigate('/escape-games')}>
            Escape Games
          </Nav.Link>
          <Nav.Link onClick={() => navigate('/reservations')}>
            Réservations
          </Nav.Link>
          <Nav.Link onClick={() => navigate('/contact')}>Contact</Nav.Link>
        </Nav>
        {isConnected ? (
          <NavDropdown title="Mon Compte" id="account-dropdown">
            <NavDropdown.Item onClick={() => navigate('/espace-client')}>
              Espace Client
            </NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Déconnexion</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <Nav.Link onClick={() => navigate('/login')}>Connexion</Nav.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;