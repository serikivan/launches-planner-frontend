import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ROUTES } from '../../Routes';
import './NavbarComponent.css';
// logo from '../../assets/logo.svg';

const navbarStyle = {
  backgroundColor: '#2050A0',
};

function NavbarComponent() {
  return (
    <Navbar style={navbarStyle} expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href={ROUTES.HOME} className="navbar-text-white">
          Планирование запусков
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={ROUTES.SATELLITES} className="navbar-text-white">
              Спутники
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
