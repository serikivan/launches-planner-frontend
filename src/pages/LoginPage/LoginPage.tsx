import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import './LoginPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAsync } from '../../slices/userSlice';
import { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error } = useSelector((state: RootState) => state.user);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUserAsync({ email: email, password })).then((result: { meta: { requestStatus: string; }; }) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            }
        });
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 login-card">
                <h2 className="text-center mb-4">Вход в учетную запись</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-4">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        style={{ backgroundColor: '#2050a0', borderColor: '#2050a0' }}
                    >
                        Войти
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default LoginPage;
