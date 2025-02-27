import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Col, Button, Badge, Spinner} from 'react-bootstrap';
import {RootState, AppDispatch} from '../../store';
import {getSatellitesList} from '../../slices/satellitesSlice';
import SatelliteCard from '../../components/SatelliteCard/SatelliteCard';
import {BreadCrumbs} from '../../components/BreadCrumbs/BreadCrumbs';
import {ROUTE_LABELS} from '../../Routes';
import {useNavigate} from 'react-router-dom';
import './SatellitesListPage.css';
import SearchBar from '../../components/SearchBar/SearchBar';

const SatellitesListPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {satellites, loading, error, launchid} = useSelector((state: RootState) => state.satellites);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const {satellitesCount} = useSelector((state: RootState) => state.draft);

    useEffect(() => {
        // При загрузке компонента запрашиваем список спутников
        // Это также обновит launchid в состоянии, если пользователь авторизован
        dispatch(getSatellitesList());
    }, [dispatch, isAuthenticated]);

    const handleLaunchClick = () => {
        console.log("Current launchid:", launchid); // Для отладки

        if (launchid) {
            // Если launchid существует, переходим на страницу этого запуска
            navigate(`/launches/${launchid}`);
        } else {
            // Если launchid не существует, переходим на страницу создания нового запуска
            navigate('/launches/new');
        }
    };

    return (
        <Container fluid className="satellites-section">
            <div className="content">
                <Row className="satellites-header w-100 justify-content-between align-items-center mb-4">
                    <Col>
                        <BreadCrumbs crumbs={[{label: ROUTE_LABELS.SATELLITES}]}/>
                    </Col>
                    <Col className="text-end">
                        {isAuthenticated && (
                            <Button
                                style={{
                                    backgroundColor: '#2050a0',
                                    position: 'relative', // Делаем кнопку относительным контейнером
                                }}
                                variant="primary"
                                onClick={handleLaunchClick}
                                disabled={satellitesCount === 0}
                                className="launch-button"
                            >
                                ЗАПУСК
                                {satellitesCount !== 0 && (
                                    <Badge
                                        bg="secondary"
                                        className="satellite-count-badge"
                                        style={{
                                            borderRadius: '50%',
                                            position: 'absolute', // Абсолютное позиционирование
                                            top: 0,              // Сдвиг вверх
                                            right: 0,            // Сдвиг вправо
                                            transform: 'translate(50%, -50%)', // Смещение на половину размера Badge
                                        }}
                                    >
                                        {satellitesCount}
                                    </Badge>
                                )}
                            </Button>
                        )}
                    </Col>
                </Row>

                <SearchBar placeholder="Введите название спутника для поиска"/>

                {loading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" role="status"/>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger mt-5">{error}</div>
                ) : satellites.length > 0 ? (
                    <Row xs={1} sm={1} md={2} lg={3} xl={4} className="g-4 justify-content-center">
                        {satellites.map((satellite) => (
                            <Col key={satellite.satellite_id}>
                                <SatelliteCard
                                    satellite_id={satellite.satellite_id}
                                    title={satellite.title}
                                    description={satellite.description}
                                    image_url={satellite.image_url}
                                    weight={satellite.weight}
                                    orbit={satellite.orbit}
                                    expected_date={satellite.expected_date}
                                    status={satellite.status}
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p className="text-center mt-5">Ничего не найдено</p>
                )}
            </div>
        </Container>
    );
};

export default SatellitesListPage;