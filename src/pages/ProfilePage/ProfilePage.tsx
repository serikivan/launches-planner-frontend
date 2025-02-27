import React, { FC, useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { api } from '../../api';
import { updateUserAsync } from '../../slices/userSlice';

// Интерфейс для запроса обновления профиля
interface ProfileUpdateRequest {
  id: number;  // Добавляем id, который требуется в API
  username?: string;
  password?: string;
}

const ProfilePage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Используем updateUserAsync вместо setUser
            const result = await dispatch(updateUserAsync({
                id: user.id,
                email: email,
                password: currentPassword
            }));
            
            if (result.meta.requestStatus === 'fulfilled') {
                setSuccess('Email успешно обновлен');
                setError(null);
                setCurrentPassword('');
            } else {
                setError('Ошибка при обновлении email');
                setSuccess(null);
            }
        } catch (err) {
            setError('Ошибка при обновлении email. Проверьте правильность пароля.');
            setSuccess(null);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Новые пароли не совпадают');
            return;
        }
        try {
            // Используем updateUserAsync вместо setUser
            const result = await dispatch(updateUserAsync({
                id: user.id,
                email: user.email,
                password: newPassword
            }));
            
            if (result.meta.requestStatus === 'fulfilled') {
                setSuccess('Пароль успешно обновлен');
                setError(null);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError('Ошибка при обновлении пароля');
                setSuccess(null);
            }
        } catch (err) {
            setError('Ошибка при обновлении пароля. Проверьте правильность текущего пароля.');
            setSuccess(null);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Личный кабинет</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h4 className="mb-3">Изменить Email</h4>
                            <Form onSubmit={handleEmailUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Новый Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Текущий пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button style={{backgroundColor: '#2050a0'}} type="submit" variant="primary">
                                    Обновить Email
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h4 className="mb-3">Изменить пароль</h4>
                            <Form onSubmit={handlePasswordUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Текущий пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Новый пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Подтвердите новый пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button style={{backgroundColor: '#2050a0'}} type="submit" variant="primary">
                                    Обновить пароль
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
