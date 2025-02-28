import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { addSatelliteAsync, getSatellitesList, uploadSatelliteImageAsync } from '../../slices/satellitesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './SatelliteCreatePage.css';
import { createSatellite } from '../../slices/satellitesSlice';

const SatelliteCreatePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const [error, setError] = useState<string | null>(null);

    const [satelliteData, setSatelliteData] = useState({
        title: '',
        description: '',
        full_desc: '',
        weight: '',
        orbit: '',
        expected_date: '',
        image_file: null as File | null,
        status: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSatelliteData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSatelliteData(prev => ({
                ...prev,
                image_file: e.target.files![0]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!satelliteData.expected_date) {
                setError('Пожалуйста, укажите ожидаемую дату запуска');
                return;
            }

            const result = await dispatch(createSatellite({
                title: satelliteData.title,
                expectedDate: satelliteData.expected_date,
                weight: Number(satelliteData.weight),
                orbit: satelliteData.orbit,
                fullDesc: satelliteData.full_desc,
                description: satelliteData.description,
                imageUrl: satelliteData.image_file
            })).unwrap();

            if (satelliteData.image_file && result.satellite_id) {
                try {
                    await dispatch(uploadSatelliteImageAsync({
                        id: result.satellite_id,
                        file: satelliteData.image_file
                    })).unwrap();
                } catch (err) {
                    console.error('Ошибка при загрузке изображения:', err);
                    setError('Спутник создан, но возникла ошибка при загрузке изображения');
                    return;
                }
            }

            await dispatch(getSatellitesList());
            navigate(ROUTES.SATELLITES_TABLE);
        } catch (err) {
            console.error('Ошибка при создании спутника:', err);
            setError('Не удалось создать спутник. Пожалуйста, проверьте введенные данные и попробуйте снова');
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Для создания спутника необходимо авторизоваться
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.SATELLITES_TABLE, path: ROUTES.SATELLITES_TABLE },
                    { label: ROUTE_LABELS.SATELLITE_CREATE }
                ]}
            />

            <div className="service-create-form">
                <h2 className="mb-4">Добавление нового спутника</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Название спутника</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={satelliteData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Краткое описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={satelliteData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Полное описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="full_desc"
                            value={satelliteData.full_desc}
                            onChange={handleChange}
                            required
                            rows={4}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Вес (кг)</Form.Label>
                        <Form.Control
                            type="number"
                            name="weight"
                            value={satelliteData.weight}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Орбита</Form.Label>
                        <Form.Control
                            type="text"
                            name="orbit"
                            value={satelliteData.orbit}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ожидаемая дата запуска</Form.Label>
                        <Form.Control
                            type="date"
                            name="expected_date"
                            value={satelliteData.expected_date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Изображение</Form.Label>
                        <Form.Control
                            type="file"
                            name="image_file"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </Form.Group>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(ROUTES.SATELLITES_TABLE)}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            style={{ backgroundColor: '#2050a0', borderColor: '#2050a0' }}
                        >
                            Создать спутник
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default SatelliteCreatePage; 