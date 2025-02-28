import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Col, Row, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getLaunches, moderateLaunchAsync } from '../../slices/launchesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './LaunchesList.css';

const LaunchesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { launches, loading, error } = useSelector((state: RootState) => state.launches);
    const { isStaff, isAuthenticated } = useSelector((state: RootState) => state.user);

    const [filter, setFilter] = useState({
        status: '',
        date_start: '',
        date_end: ''
    });

    const navigate = useNavigate();

    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedQR, setSelectedQR] = useState<string | undefined>(undefined);
    const [isQREnlarged, setIsQREnlarged] = useState(false);

    const fetchLaunches = () => {
        if (isAuthenticated) {
            dispatch(getLaunches(filter));
        }
    };

    // Эффект для первоначальной загрузки и проверки авторизации
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (window.location.pathname.includes('/moderate') && !isStaff) {
            navigate('/403');
            return;
        }
    }, [isAuthenticated, isStaff, navigate]);

    // Эффект для short polling
    useEffect(() => {
        fetchLaunches();
        const intervalId = setInterval(fetchLaunches, 10000);
        return () => clearInterval(intervalId);
    }, [filter]);

    const handleFilterChange = (field: string, value: string) => {
        setFilter(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilter({
            status: '',
            date_start: '',
            date_end: ''
        });
    };

    const handleModerate = async (e: React.MouseEvent, id: number, status: 'completed' | 'rejected') => {
        e.stopPropagation();
        try {
            await dispatch(moderateLaunchAsync({ id: id.toString(), status })).unwrap();
            dispatch(getLaunches(filter)); // Обновляем список после модерации
        } catch (error) {
            console.error('Error moderating launch:', error);
        }
    };

    const handleShowQR = (qr: string | undefined) => {
        console.log('QR data:', qr); // Для отладки
        if (qr) {
            const qrUrl = `data:image/png;base64,${qr}`;
            console.log('QR URL:', qrUrl); // Для отладки
            setSelectedQR(qrUrl);
            setShowQRModal(true);
        }
    };

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
        <>
            <Container className="mt-4">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.LAUNCHES }
                    ]}
                />
                
                <Container fluid className="min-vh-100">
                    <Row className="justify-content-center mt-5 mb-5">
                        <Col xs={12}>
                            <h2 className="mb-4 text-center">Список запусков</h2>
                            
                            {/* Фильтры */}
                            <div className="filter-section mb-4">
                                <Row className="g-3 align-items-end">
                                    <Col xs={12} md={3}>
                                        <Form.Group>
                                            <Form.Label>Статус запуска</Form.Label>
                                            <Form.Select 
                                                value={filter.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                            >
                                                <option value="">Все статусы</option>
                                                <option value="formed">Сформирован</option>
                                                <option value="completed">Утвержден</option>
                                                <option value="rejected">Отклонен</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Group>
                                            <Form.Label>Дата начала</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={filter.date_start}
                                                onChange={(e) => handleFilterChange('date_start', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Group>
                                            <Form.Label>Дата окончания</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={filter.date_end}
                                                onChange={(e) => handleFilterChange('date_end', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={3} className="d-flex justify-content-end align-items-center">
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={clearFilters}
                                            className="w-100"
                                        >
                                            Сбросить фильтры
                                        </Button>
                                    </Col>
                                </Row>
                            </div>

                            {/* Таблица */}
                            <div className="table-responsive">
                                <Table striped bordered hover className="launches-table">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '70px' }}>ID</th>
                                            <th style={{ minWidth: '150px' }}>Ракета-носитель</th>
                                            <th style={{ minWidth: '120px' }}>Дата запуска</th>
                                            <th style={{ minWidth: '120px' }}>Дата формирования</th>
                                            <th style={{ minWidth: '120px' }}>Создатель</th>
                                            <th style={{ minWidth: '100px' }}>Статус</th>
                                            <th style={{ minWidth: '100px' }}>Результат</th>
                                            <th style={{ minWidth: '100px' }}>QR</th>
                                            {isStaff && <th style={{ minWidth: '200px' }}>Действия модератора</th>}
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

                                                // Определяем текст результата
                                                let resultText;
                                                switch (launch.status) {
                                                    case 'completed':
                                                        resultText = launch.success ? 'Успех' : 'Неудача';
                                                        break;
                                                    case 'rejected':
                                                        resultText = 'Запуск отклонен';
                                                        break;
                                                    default:
                                                        resultText = 'Не определен';
                                                }

                                                return (
                                                    <tr key={launch.launch_id}
                                                        onClick={() => navigate(`/launches/${launch.launch_id}`)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>{launch.launch_id}</td>
                                                        <td>{launch.rocket || 'Без названия'}</td>
                                                        <td>{launch.date ? new Date(launch.date).toLocaleDateString() : 'Не назначена'}</td>
                                                        <td>{launch.formed_at ? new Date(launch.formed_at).toLocaleDateString() : 'Неизвестно'}</td>
                                                        <td>{launch.creator}</td>
                                                        <td>{statusText}</td>
                                                        <td>{resultText}</td>
                                                        <td>
                                                            {launch.qr && launch.status === 'completed' ? (
                                                                <Button
                                                                    variant="link"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleShowQR(launch.qr);
                                                                    }}
                                                                >
                                                                    Открыть QR
                                                                </Button>
                                                            ) : (
                                                                <span className="text-muted">Недоступен</span>
                                                            )}
                                                        </td>
                                                        {isStaff && (
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    {launch.status === 'formed' && (
                                                                        <>
                                                                            <Button
                                                                                variant="outline-success"
                                                                                size="sm"
                                                                                onClick={(e) => handleModerate(e, launch.launch_id, 'completed')}
                                                                            >
                                                                                Завершить
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline-danger"
                                                                                size="sm"
                                                                                onClick={(e) => handleModerate(e, launch.launch_id, 'rejected')}
                                                                            >
                                                                                Отклонить
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={isStaff ? 8 : 7} className="text-center">
                                                    Нет данных о запусках
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Modal 
                show={showQRModal} 
                onHide={() => {
                    setShowQRModal(false);
                    setIsQREnlarged(false);
                }}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>QR-код запуска</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedQR && (
                        <img 
                            src={selectedQR}
                            alt="QR Code" 
                            className={`qr-image ${isQREnlarged ? 'enlarged' : ''}`}
                            onClick={() => setIsQREnlarged(!isQREnlarged)}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LaunchesList;