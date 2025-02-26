import { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./HomePage.css";

export const Home: FC = () => {
  return (
    <div className="homeBackground">
      <Container className="homeContainer">
        <Row className="homeRow">
          <Col md={8} className="textCol">
            <h1 className="homeTitle">Планирование запусков спутников</h1>
            <p className="homeDescription">
              Добро пожаловать в сервис планирования запусков с космодрома Восточный!
              Здесь вы можете отслеживать предстоящие запуски, управлять заявками
              на запуск спутников и изучать их параметры. Погрузитесь в мир космических технологий вместе с нами!
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
