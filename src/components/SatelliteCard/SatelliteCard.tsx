import React, { FC, useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addSatelliteToLaunchAsync, removeSatelliteFromLaunchAsync, getSatellitesList } from '../../slices/launchesSlice';
import { getSatellitesList as getSatellitesListFromSatellitesSlice } from '../../slices/satellitesSlice';
import defaultImage from '../../assets/defaultSatelliteImage.png';
import './SatelliteCard.css';
import { api } from '../../api';

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
    onDeleteSuccess
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const selectedSatellites = useSelector((state: RootState) => state.launches.selectedSatellites);
    const isSelected = selectedSatellites.includes(satellite_id);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleAddToLaunch = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated && !isSelected) {
            try {
                await dispatch(addSatelliteToLaunchAsync({ satelliteId: satellite_id, order: 1 }));
                dispatch(getSatellitesListFromSatellitesSlice());
            } catch (error) {
                console.error('Error adding satellite to launch:', error);
            }
        }
    };

    const handleRemoveFromLaunch = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated && launchPage) {
            setIsRemoving(true);
            try {
                await dispatch(removeSatelliteFromLaunchAsync(satellite_id));
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

    return (
        <Link to={`/satellites/${satellite_id}`} className="satelliteCardLink">
            <Card className={`satelliteCard ${launchPage ? 'launchPageCard' : ''}`}>
                <Card.Body className="p-0">
                    <div style={{ 
                        width: '100%',
                        paddingTop: '75%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={image_url || defaultImage}
                            alt={title}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    <div className="p-3">
                        <Card.Title className="satelliteCardTitle">{title}</Card.Title>
                        {weight && <Card.Text>Масса: {weight} кг</Card.Text>}
                        {expected_date && <Card.Text>Запустить к {expected_date}</Card.Text>}
                        {isAuthenticated && (
                            <Button
                                variant="primary"
                                onClick={handleAddToLaunch}
                                className="mt-2 w-100"
                                style={{
                                    background: '#2050a0',
                                    borderColor: '#2050a0',
                                    color: '#ffffff'
                                }}
                            >
                                Добавить
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default SatelliteCard;