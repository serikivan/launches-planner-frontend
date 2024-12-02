import { FC } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SatelliteCard.css';
import defaultImage from '../../assets/defaultSatelliteImage.png';

interface SatelliteCardProps {
    satellite_id: number;
    title: string;
    image_url: string;
    expected_date: string;
    weight?: number;
}

const SatelliteCard: FC<SatelliteCardProps> = ({ satellite_id, title, image_url, expected_date, weight }) => {

    return (
        <Link to={`/satellites/${satellite_id}`} className="satelliteCardLink">
            <Card className="satelliteCard">
                <Card.Img
                    variant="top"
                    src={image_url || defaultImage}  // Проверка на наличие image_url
                    className="satelliteCardImage"
                    alt={title}  // Альтернативный текст для изображения
                />
                <Card.Body>
                    <Card.Title className="satelliteCardTitle">{title}</Card.Title>
                    <Card.Text className="satelliteCardDetails">
                        <br/>
                        <strong>Ожидаемая дата запуска: до {expected_date}</strong>
                        <br/>
                        <strong>Масса:</strong> {weight ? `${weight} кг` : 'Не указано'}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default SatelliteCard;
