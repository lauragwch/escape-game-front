import { Navbar, Nav } from 'react-bootstrap';
import '../Styles/NavBar.css';

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand href="/">Escape Adventure</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Accueil</Nav.Link>
          {/* Ajouter d'autres liens plus tard */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;