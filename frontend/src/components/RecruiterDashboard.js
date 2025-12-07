import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PersonPlusFill, PeopleFill } from 'react-bootstrap-icons';
import logo from '../assets/lti-logo.png'; // Ruta actualizada para importar desde src/assets

const RecruiterDashboard = () => {
    return (
        <Container className="mt-5">
            <div className="text-center"> {/* Contenedor para el logo */}
                <img src={logo} alt="LTI Logo" style={{ width: '150px' }} />
            </div>
            <h1 className="mb-4 text-center">Dashboard del Reclutador</h1>
            <Row>
                <Col md={6}>
                    <Card className="shadow p-4 mb-4">
                        <h5 className="mb-4">
                            <PersonPlusFill className="me-2" />
                            Añadir Candidato
                        </h5>
                        <Link to="/add-candidate">
                            <Button variant="primary" className="btn-block">Añadir Nuevo Candidato</Button>
                        </Link>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow p-4 mb-4">
                        <h5 className="mb-4">
                            <PeopleFill className="me-2" />
                            Ver Candidatos
                        </h5>
                        <Link to="/candidates">
                            <Button variant="info" className="btn-block">Ver Listado de Candidatos</Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RecruiterDashboard;