import React, { useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { getSatellitesList, deleteSatelliteAsync } from '../../slices/satellitesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import './SatellitesTablePage.css';
import { ROUTE_LABELS } from '../../Routes';

const SatellitesTablePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { satellites, loading, error } = useSelector((state: RootState) => state.satellites);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        dispatch(getSatellitesList());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот спутник?')) {
            try {
                await dispatch(deleteSatelliteAsync(id));
                dispatch(getSatellitesList()); // Обновляем список после удаления
            } catch (error) {
                console.error('Ошибка при удалении спутника:', error);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Для просмотра спутников необходимо авторизоваться
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" style={{ color: '#2050a0' }} />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.SATELLITES_TABLE }
                ]}
            />
            
            <Container fluid className="min-vh-100">
                <Row className="justify-content-center mt-5 mb-5">
                    <Col sm={12} lg={8}>
                        <h2 className="mb-4 text-center">Таблица спутников</h2>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Вес (кг)</th>
                                    <th>Ожидаемая дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {satellites.map((satellite) => (
                                    <tr key={satellite.satellite_id}>
                                        <td>{satellite.satellite_id}</td>
                                        <td>{satellite.title}</td>
                                        <td>{satellite.weight}</td>
                                        <td>{satellite.expected_date}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/satellites/${satellite.satellite_id}/edit`)}
                                                    style={{ borderColor: '#2050a0', color: '#2050a0' }}
                                                >
                                                    Редактировать
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => navigate(`/satellites/${satellite.satellite_id}`)}
                                                >
                                                    Подробнее
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(satellite.satellite_id)}
                                                >
                                                    Удалить
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            <Button 
                                onClick={() => navigate('/satellites/create')}
                                style={{ backgroundColor: '#2050a0', borderColor: '#2050a0' }}
                            >
                                Создать спутник
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default SatellitesTablePage; 