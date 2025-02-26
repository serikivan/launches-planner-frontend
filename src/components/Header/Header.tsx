import React from "react";
import {Container, Navbar, Nav, Button} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logoutUserAsync } from "../../slices/userSlice";
import logo from '../../assets/logo192.png';

const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { email, isAuthenticated } = useSelector((state: RootState) => state.user);

    const handleLogout = () => {
        dispatch(logoutUserAsync()).then(() => navigate("/"));
    };

    return (
        <Navbar className="sticky-top header" expand="lg">
            <Container>
                <Navbar.Brand href="/" className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <img
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block"
                            alt="Восточный логотип"
                            style={{ marginTop: '4px' }}
                        />
                    </div>
                    <div className="ms-3">
                        <h1 className="logo mb-0">ВОСТОЧНЫЙ</h1>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to="/satellites" className="logo-button larger-font">Спутники</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/launches" className="logo-button larger-font">Запуски</Link>
                                <div className="user-controls">
                                    <Link to="/profile" className="logo-button">{email}</Link>
                                    <Nav.Link as={Button} className="logout-button" onClick={handleLogout}>Выйти</Nav.Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="logo-button">Войти</Link>
                                <Link to="/register" className="logo-button">Регистрация</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
