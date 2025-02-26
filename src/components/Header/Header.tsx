import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Header.css';
import hamburgerIcon from '../../assets/hamburger.jpg';
import {Link} from "react-router-dom";

const navbarStyle = {
  backgroundColor: '#2050A0',
};

function Header() {
  return (
    <Navbar style={navbarStyle} expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={"/"} className="navbar-text-white">
          Планирование запусков
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggle">
          <img src={hamburgerIcon} alt="Меню" className="custom-hamburger" />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Navbar.Brand as={Link} to={"/satellites"} className="navbar-text-white">
              Спутники
            </Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
