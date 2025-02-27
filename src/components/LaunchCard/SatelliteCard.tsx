import React, {FC, useState, useEffect} from 'react';
import {Card, Button, Row, Col, Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {addSatelliteToLaunchAsync, removeSatelliteFromLaunchAsync} from '../../slices/launchesSlice';
import { updateSatelliteLaunch, getLaunch } from "../../slices/draftSlice.ts";
import defaultImage from '../../assets/defaultSatelliteImage.png';
import './SatelliteCard.css';
import {api} from '../../api';
import { getSatellitesList } from '../../slices/satellitesSlice';

interface SatelliteCardProps {
    satellite_id: number;
    title: string;
    description?: string;
    image_url?: string;
    expected_date?: string;
    weight?: number;
    orbit?: string;
    status?: boolean;
    launchPage?: boolean;
    order?: number;
    launchId?: number;
    onDeleteSuccess?: () => void;
    isDraft?: boolean;
}

const SatelliteCard: FC<SatelliteCardProps> = ({
    satellite_id,
    title,
    description,
    image_url,
    expected_date,
    weight,
    orbit,
    status,
    launchPage = false,
    order,
    launchId,
    onDeleteSuccess,
    isDraft = false
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const selectedSatellites = useSelector((state: RootState) => state.launches.selectedSatellites);
    const isSelected = selectedSatellites.includes(satellite_id);
    const [isRemoving, setIsRemoving] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<string>(order?.toString() || '');

    useEffect(() => {
        setCurrentOrder(order?.toString() || '');
    }, [order]);

    const handleRemoveFromLaunch = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated && launchPage) {
            setIsRemoving(true);
            try {
                await dispatch(removeSatelliteFromLaunchAsync(satellite_id));
                if (launchId) {
                    dispatch(getLaunch(launchId));
                }
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } catch (error) {
                console.error('Error removing satellite:', error);
            } finally {
                setIsRemoving(false);
            }
        }
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentOrder(e.target.value);
    };

    const handleUpdateOrder = async () => {
        if (isAuthenticated && launchPage && currentOrder) {
            try {
                await api.satellites.satellitesManageDraftUpdate(satellite_id.toString(), {
                    order: currentOrder
                });
                if (launchId) {
                    dispatch(getLaunch(launchId));
                }
            } catch (error) {
                console.error('Error updating order:', error);
            }
        }
    };

    const handleInputClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (isAuthenticated && launchPage && currentOrder) {
                try {
                    await api.satellites.satellitesManageDraftUpdate(satellite_id.toString(), {
                        order: currentOrder
                    });
                    if (launchId) {
                        dispatch(getLaunch(launchId));
                    }
                } catch (error) {
                    console.error('Error updating order:', error);
                }
            }
        }
    };

    return (
        <Link to={`/satellites/${satellite_id}`} className="satelliteCardLink">
            <Card className={`satelliteCard ${launchPage ? 'launchPageCard' : ''}`}>
                    <Row className="g-0">
                        <Col xs={4}>
                            <img
                                src={image_url || defaultImage}
                                alt={title}
                                className="satelliteCardImage"
                            />
                        </Col>
                        <Col xs={8}>
                            <Card.Body>
                                <Card.Title className="satelliteCardTitle">{title}</Card.Title>
                                {weight && <Card.Text>Масса: {weight} кг</Card.Text>}
                                {expected_date && <Card.Text>Ожидает запуск до: {expected_date}</Card.Text>}
                                {launchPage && (
                                    <Form.Group controlId="orderInput">
                                        <Form.Label>Порядок</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={currentOrder}
                                            onChange={handleOrderChange}
                                            onBlur={handleUpdateOrder}
                                            onClick={handleInputClick}
                                            onFocus={handleInputClick}
                                            onKeyPress={handleKeyPress}
                                            size="sm"
                                            min="1"
                                            placeholder="Введите порядок"
                                        />
                                    </Form.Group>
                                )}
                                {isDraft && (
                                    <Button
                                        variant="danger"
                                        onClick={handleRemoveFromLaunch}
                                        disabled={isRemoving}
                                        size="sm"
                                        className="mt-2"
                                    >
                                        {isRemoving ? 'Удаление...' : 'Удалить'}
                                    </Button>
                                )}
                            </Card.Body>
                        </Col>
                    </Row>
            </Card>
        </Link>
    );
};

export default SatelliteCard;