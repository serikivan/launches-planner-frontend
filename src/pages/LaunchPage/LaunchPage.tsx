import React, {FC, useEffect, useState} from 'react';
import {Container, Row, Col, Alert, Spinner, Button, Form, Card} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {Launch, LaunchSatellite} from '../../api/Api';
import SatelliteCard from '../../components/LaunchCard/SatelliteCard';
import {BreadCrumbs} from '../../components/BreadCrumbs/BreadCrumbs';
import {ROUTE_LABELS} from '../../Routes';
import './LaunchPage.css';
import {getLaunch, removeSatelliteFromLaunch, updateLaunchAsync, deleteLaunch, submitLaunch, updateSatelliteLaunch} from '../../slices/draftSlice';

// Расширяем интерфейс Launch для включения satellites
interface LaunchWithSatellites extends Launch {
    satellites?: Array<{
        satellite_id: number;
        title: string;
        description: string;
        weight?: number | null;
        image_url?: string | null;
        expected_date: string;
    }>;
}

const LaunchPage: FC = () => {
    const {launch_id} = useParams<{ launch_id: number }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {loading, error, launchData, isDraft, satellites} = useSelector((state: RootState) => state.draft);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    const [launchDate, setLaunchDate] = useState<string>('');
    const [rocket, setRocket] = useState<string>('');
    const [isSaved, setIsSaved] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isAuthenticated && launch_id) {
            dispatch(getLaunch(launch_id));
        }
    }, [dispatch, launch_id, isAuthenticated]);

    useEffect(() => {
        if (launchData) {
            setLaunchDate(launchData.date || '');
            setRocket(launchData.rocket || '');
            setIsSaved(Boolean(launchData.rocket?.trim()));
        }
    }, [launchData]);

    useEffect(() => {
        setIsReady(Boolean(rocket?.trim() && launchDate));
    }, [rocket, launchDate]);

    const handleSave = () => {
        if (launch_id && launchData) {
            dispatch(updateLaunchAsync({
                id: launch_id,
                data: {
                    rocket: rocket,
                    date: launchDate
                }
            })).then(() => {
                setIsSaved(true);
            });
        }
    };

    const handleDeleteLaunch = async () => {
        if (launch_id) {
            try {
                await dispatch(deleteLaunch(launch_id));
                navigate('/satellites');
            } catch (error) {
                console.error('Ошибка при удалении запуска:', error);
            }
        }
    };

    const handleSubmitLaunch = async () => {
        if (launch_id) {
            try {
                await dispatch(submitLaunch(launch_id));
                navigate('/launches');
            } catch (error) {
                console.error('Ошибка при формировании запуска:', error);
            }
        }
    };

    const handleUpdateOrder = async (order: string, satellite_id: number) => {
        console.log(order);
        if (order) {
            dispatch(updateSatelliteLaunch(
                {id: satellite_id, order: order}
            ))
        }
    }

    const handleDeleteSuccess = () => {
        if (launch_id) {
            dispatch(getLaunch(Number(launch_id)));
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Для просмотра запуска необходимо авторизоваться
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="mt-5 d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                <Spinner animation="border" variant="primary"/>
                <span className="ms-2">Загрузка...</span>
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

    if (!launchData) {
        return (
            <Container className="mt-5">
                <Alert variant="info">Запуск не найден</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="min-vh-100">
            <BreadCrumbs
                crumbs={[
                    {label: ROUTE_LABELS.LAUNCHES, path: '/launches'},
                    {label: launchData.rocket || `Запуск ${launch_id}`},
                ]}
            />
            <Row className="justify-content-center mt-5 mb-5">
                <Col sm={12} lg={8}>
                    <Card className="shadow-sm p-4">
                        <h2 className="text-center mb-4">Запуск {launch_id}</h2>
                        <hr/>
                        <Form className="launch-form">
                            <Row className="justify-content-center align-items-center">
                                <Col md={8} className="align-items-center justify-content-center">
                                    <Row className="mb-3 align-items-center">
                                        <Form.Label className="text-center">Создатель: <span>{launchData.creator}</span></Form.Label>
                                    </Row>
                                    <hr/>
                                    <Row className="mb-3 align-items-center">
                                        <Col>
                                            <Form.Group controlId="rocket">
                                                <Form.Label>Ракета-носитель</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={(isDraft ? rocket : launchData.rocket) || ""}
                                                    onChange={(e) => setRocket(e.target.value)}
                                                    disabled={!isDraft}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="date">
                                                <Form.Label>Дата запуска</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={launchDate}
                                                    onChange={(e) => setLaunchDate(e.target.value)}
                                                    disabled={!isDraft}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {isDraft && (
                                        <Row className="mb-3">
                                            <Button
                                                variant="success"
                                                onClick={handleSave}
                                                disabled={!rocket}
                                                style={{backgroundColor: '#2050a0', borderColor: '#2050a0'}}
                                            >
                                                Сохранить данные
                                            </Button>
                                        </Row>
                                    )}
                                </Col>
                            </Row>
                        </Form>
                        <hr/>
                        <h4 className="mt-4 mb-3 text-center">Спутники в запуске</h4>
                        <Row className="satellite-cards mt-3">
                            {satellites && satellites.length > 0 ? (
                                satellites.map(({satellite, order}) => (
                                    <Col key={satellite.satellite_id} xs={12} className="mb-4">
                                        <SatelliteCard
                                            satellite_id={satellite.satellite_id}
                                            title={satellite.title}
                                            description={satellite.description}
                                            weight={satellite.weight}
                                            image_url={satellite.image_url}
                                            expected_date={satellite.expected_date}
                                            launchPage={true}
                                            launchId={Number(launch_id)}
                                            order={order}
                                            onDeleteSuccess={handleDeleteSuccess}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center">
                                    <p>В этом запуске нет спутников</p>
                                </Col>
                            )}
                        </Row>
                        <hr/>
                        {isDraft && (
                            <Row className="justify-content-center align-items-center mt-4 gap-2">
                                <Col sm={12} md={"auto"} className="justify-content-center align-items-center">
                                    <Row>
                                        <Button
                                            variant="success"
                                            onClick={handleSubmitLaunch}
                                            disabled={!isReady || !isSaved || satellites?.length === 0}
                                            style={{backgroundColor: '#2050a0', borderColor: '#2050a0'}}
                                        >
                                            Сформировать запуск
                                        </Button>
                                    </Row>
                                </Col>
                                <Col xs={12} md={"auto"} className="justify-content-center align-items-center">
                                    <Row>
                                        <Button
                                            variant="danger"
                                            onClick={handleDeleteLaunch}
                                            style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}
                                        >
                                            Удалить
                                        </Button>
                                    </Row>
                                </Col>
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LaunchPage;