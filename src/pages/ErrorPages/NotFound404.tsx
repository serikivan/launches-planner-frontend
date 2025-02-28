import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const NotFound404: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container className="error-page">
            <Row className="justify-content-center align-items-center">
                <Col xs={12} md={8} className="text-center">
                    <h1 className="error-code">404</h1>
                    <h2 className="error-title">Страница не найдена</h2>
                    <p className="error-description">
                        Запрашиваемая страница не существует или была удалена.
                    </p>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/')}
                        className="error-button"
                        style={{ backgroundColor: '#2050a0', borderColor: '#2050a0' }}
                    >
                        Вернуться на главную
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound404; 