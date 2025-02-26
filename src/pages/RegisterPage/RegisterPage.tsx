import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUserAsync } from '../../slices/userSlice';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../Routes';
import './RegisterPage.css';

export const RegisterPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '',
        confirmPassword: '' 
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const error = useSelector((state: RootState) => state.user.error);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear password error when user types
        if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
            setPasswordError(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }
        if (formData.email && formData.password) {
            const result = await dispatch(registerUserAsync({ 
                email: formData.email, 
                password: formData.password 
            }));
            if (result.meta.requestStatus === 'fulfilled') {
                navigate(ROUTES.SATELLITES);
            }
        }
    };

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
            <Container style={{ maxWidth: '400px', marginTop: '150px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Регистрация</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email" style={{ marginBottom: '15px' }}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Введите имя пользователя"
                        />
                    </Form.Group>
                    <Form.Group controlId="password" style={{ marginBottom: '15px' }}>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" style={{ marginBottom: '20px' }}>
                        <Form.Label>Подтверждение пароля</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Подтвердите пароль"
                        />
                    </Form.Group>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        style={{ width: '100%', background: '#2050a0', borderColor: '#2050a0' }}
                    >
                        Зарегистрироваться
                    </Button>
                </Form>
            </Container>
        </Container>
    );
};
