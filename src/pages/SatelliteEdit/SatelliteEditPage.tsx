import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { 
    getSatelliteById, 
    updateSatelliteAsync, 
    uploadSatelliteImageAsync 
} from '../../slices/satellitesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './SatelliteEditPage.css';
import { fetchSatellite } from '../../slices/satellitesSlice';


const SatelliteEditPage: React.FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const [error, setError] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        satellite_id: '',
        title: '',
        description: '',
        full_desc: '',
        weight: '',
        orbit: '',
        expected_date: '',
        status: true
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchSatellite(Number(id)))
                .unwrap()
                .then((data) => {
                    setFormData({
                        satellite_id: data.satellite_id,
                        title: data.title || '',
                        description: data.description || '',
                        full_desc: data.full_desc || '',
                        weight: data.weight || '',
                        orbit: data.orbit || '',
                        expected_date: data.expected_date || '',
                        status: data.status
                    });
                })
                .catch((err) => setError('Ошибка при загрузке данных спутника'));
        }
    }, [dispatch, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(updateSatelliteAsync(formData)).unwrap();
            navigate(ROUTES.SATELLITES_TABLE);
        } catch (err) {
            setError('Не удалось обновить данные спутника. Пожалуйста, проверьте введенные данные и попробуйте снова');
            console.error('Ошибка:', err);
        }
    };

    const handleImageUpload = async () => {
        if (imageFile && id) {
            try {
                await dispatch(uploadSatelliteImageAsync({
                    id: parseInt(id),
                    file: imageFile
                })).unwrap();
                
                await dispatch(fetchSatellite(Number(id)));
                
                setShowImageModal(false);
                setImageFile(null);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить изображение. Пожалуйста, проверьте формат файла и попробуйте снова');
                console.error('Ошибка загрузки изображения:', err);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Для редактирования спутника необходимо авторизоваться
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.SATELLITES_TABLE, path: ROUTES.SATELLITES_TABLE },
                    { label: ROUTE_LABELS.SATELLITE_EDIT }
                ]}
            />
            <div className="service-edit-form">
                <h2>Редактирование спутника</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Краткое описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Полное описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="full_desc"
                            value={formData.full_desc}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Вес (кг)</Form.Label>
                        <Form.Control
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Орбита</Form.Label>
                        <Form.Control
                            type="text"
                            name="orbit"
                            value={formData.orbit}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ожидаемая дата запуска</Form.Label>
                        <Form.Control
                            type="date"
                            name="expected_date"
                            value={formData.expected_date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-2 justify-content-between">
                        <Button
                            variant="info"
                            onClick={() => setShowImageModal(true)}
                        >
                            Изменить изображение
                        </Button>
                        
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(ROUTES.SATELLITES_TABLE)}
                                className="me-2"
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                style={{ backgroundColor: '#2050a0', borderColor: '#2050a0' }}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>

            <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Загрузка изображения</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Выберите файл</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                        Закрыть
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleImageUpload}
                        disabled={!imageFile}
                    >
                        Загрузить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SatelliteEditPage; 