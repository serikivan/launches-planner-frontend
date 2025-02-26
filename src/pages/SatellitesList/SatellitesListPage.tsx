import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import { satelliteFields, getSatellitesByName } from '../../modules/LaunchesAPI';
import InputField from '../../components/InputField/InputField';
import SatelliteCard from '../../components/SatelliteCard/SatelliteCard';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../../Routes';
import { SATELLITES_MOCK } from '../../modules/mock';
import './SatellitesListPage.css';

const SatellitesListPage: FC = () => {
    const searchValue = useSelector((state: RootState) => state.search.searchTerm);
    const [satellites, setSatellites] = useState<satelliteFields[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        getSatellitesByName(searchValue).then((response) => {
            setSatellites(response.satellites)
            setLoading(false)
        }).catch(() => {
            const filteredMock = SATELLITES_MOCK.satellites.filter((satellite) =>
                satellite.title.toLowerCase().includes(searchValue.toLowerCase())
            );
            setSatellites(filteredMock);
            setLoading(false)
        })
    }

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className='background'>
            <div className="satellite-page">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SATELLITES }]} />
                <InputField
                    onSubmit={handleSearch}
                    loading={loading}
                    placeholder="Поиск спутника по названию"
                />

                {loading && (
                    <div className="loadingBg d-flex justify-content-center align-items-center">
                        <Spinner
                            animation="border"
                            className="custom-spinner"
                        />
                    </div>
                )}

                <Container className="card-container">
                    <Row md={3} className="g-4 justify-content-center w-100" style={{marginTop: '10px'}}>
                        {satellites.map((satellite, index) => (
                            <Col key={index}>
                                <SatelliteCard {...satellite} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default SatellitesListPage;