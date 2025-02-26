import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getLaunches } from '../../slices/launchesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs.tsx';
import { useNavigate } from 'react-router-dom';

const LaunchesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { launches, loading, error } = useSelector((state: RootState) => state.launches);

    const [filter] = useState({
        status: '',
        date_start: '',
        date_end: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getLaunches(filter));
    }, [dispatch, filter]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" style={{ color: '#2050a0' }} />
                <p className="mt-2">Загрузка...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="min-vh-100">
            <Row className="justify-content-center mt-5 mb-5">
                <Col sm={12} lg={8}>
                    <h2 className="mb-4 text-center">Список запусков</h2>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ракета-носитель</th>
                            <th>Дата запуска</th>
                            <th>Создатель</th>
                            <th>Статус</th>
                            {/* Условный заголовок для результата */}
                            {launches.some(launch => launch.status === 'completed') && (
                                <th>Результат</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                            {launches.length > 0 ? (
                                launches.map((launch) => {
                                    // Определяем текст статуса на русском
                                    let statusText;
                                    switch (launch.status) {
                                        case 'formed':
                                            statusText = 'Сформирован';
                                            break;
                                        case 'rejected':
                                            statusText = 'Отклонен';
                                            break;
                                        case 'draft':
                                            statusText = 'Черновик';
                                            break;
                                        case 'completed':
                                            statusText = 'Утвержден';
                                            break;
                                        case 'deleted':
                                            statusText = 'Удален';
                                            break;
                                        default:
                                            statusText = 'Неизвестный статус';
                                    }

                                    return (
                                        <tr key={launch.launch_id}
                                            onClick={() => navigate(`/launches/${launch.launch_id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{launch.launch_id}</td>
                                            <td>{launch.rocket || 'Без названия'}</td>
                                            <td>{launch.date ? new Date(launch.date).toLocaleDateString() : 'Не назначена'}</td>
                                            <td>{launch.creator}</td>
                                            <td>{statusText}</td>
                                            {launch.status === 'completed' && (
                                                <td>{launch.success ? 'Успешный' : 'Неуспешный'}</td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">Нет данных о запусках</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default LaunchesList;