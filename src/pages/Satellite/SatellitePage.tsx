import "./SatellitePage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useParams } from "react-router-dom";
import { satelliteFields, getSatelliteById } from "../../modules/LaunchesAPI";
import { Spinner, Image } from "react-bootstrap";
import { SATELLITES_MOCK } from "../../modules/mock";
import defaultImage from '../../assets/defaultSatelliteImage.png';

export const SatellitePage: FC = () => {
    const [satellites, setSatellites] = useState<satelliteFields>();

    const { satellite_id } = useParams();

    useEffect(() => {
        if (!satellite_id) return;
        getSatelliteById(satellite_id)
          .then((response) => setSatellites(response))
          .catch(() => {
            setSatellites(SATELLITES_MOCK.satellites.find((satellites) => String(satellites.satellite_id) == satellite_id))
          })
      }, [satellite_id]);


    return (
    <div className="satellitePageWrapper">
        <BreadCrumbs
            crumbs={[
                { label: ROUTE_LABELS.SATELLITES, path: ROUTES.SATELLITES },
                { label: satellites?.title || "Спутник" },
            ]}
        />
        {satellites ? (
            <div className="satelliteContent">
                <h1 className="satelliteTitle">{satellites.title}</h1>
                <div className="satelliteRow">
                    <div className="satelliteImageWrapper">
                        <Image
                            className="satelliteImage"
                            src={satellites.image_url || defaultImage}
                        />
                    </div>
                    <div className="satelliteDetails">
                        <p className="satelliteField">
                            {satellites.full_desc}
                        </p>
                        <p className="satelliteField">
                            <strong>Орбита:</strong> {satellites.orbit}
                        </p>
                        <p className="satelliteField">
                            <strong>Масса:</strong> {satellites.weight} кг
                        </p>
                        <p className="satelliteField">
                            <strong>Ожидаемая дата запуска: не позднее {satellites.expected_date}</strong>
                        </p>
                    </div>
                </div>
            </div>
        ) : (
                <div className="loadingBg d-flex justify-content-center align-items-center">
                    <Spinner
                        animation="border"
                        className="custom-spinner"
                    />
                </div>
        )}
    </div>
);

};