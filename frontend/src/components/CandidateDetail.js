import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Badge, ListGroup, Button } from 'react-bootstrap';
import { ArrowLeft, EnvelopeFill, TelephoneFill, PersonFill } from 'react-bootstrap-icons';
import { getCandidateById } from '../services/candidateService';

const CandidateDetail = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCandidateById(id);
                setCandidate(data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('not_found');
                } else {
                    setError('network');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-3">Cargando candidato...</p>
            </Container>
        );
    }

    if (error === 'not_found') {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    <Alert.Heading>Candidato no encontrado</Alert.Heading>
                    <p>El candidato con ID {id} no existe en el sistema.</p>
                    <hr />
                    <Link to="/candidates">
                        <Button variant="outline-warning">
                            <ArrowLeft className="me-2" />
                            Volver al listado
                        </Button>
                    </Link>
                </Alert>
            </Container>
        );
    }

    if (error === 'network') {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error al cargar el candidato</Alert.Heading>
                    <p>Ha ocurrido un problema al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.</p>
                    <hr />
                    <Link to="/candidates">
                        <Button variant="outline-danger">
                            <ArrowLeft className="me-2" />
                            Volver al listado
                        </Button>
                    </Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Link to="/candidates" className="text-decoration-none mb-4 d-inline-block">
                <Button variant="outline-secondary" size="sm">
                    <ArrowLeft className="me-2" />
                    Volver al listado
                </Button>
            </Link>

            <Card className="shadow mt-3">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">
                        <PersonFill className="me-2" />
                        {candidate.firstName} {candidate.lastName}
                    </h4>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <h5>Información de Contacto</h5>
                        <p className="mb-2">
                            <EnvelopeFill className="me-2 text-secondary" />
                            <strong>Email:</strong> {candidate.email || 'No disponible'}
                        </p>
                        <p className="mb-0">
                            <TelephoneFill className="me-2 text-secondary" />
                            <strong>Teléfono:</strong> {candidate.phone || 'No disponible'}
                        </p>
                    </div>

                    {candidate.educations && candidate.educations.length > 0 && (
                        <div className="mb-4">
                            <h5>
                                Educación 
                                <Badge bg="secondary" className="ms-2">{candidate.educations.length}</Badge>
                            </h5>
                            <ListGroup variant="flush">
                                {candidate.educations.map((edu, index) => (
                                    <ListGroup.Item key={edu.id || index}>
                                        <strong>{edu.institution}</strong>
                                        {edu.title && <span> - {edu.title}</span>}
                                        {(edu.startDate || edu.endDate) && (
                                            <div className="text-muted small">
                                                {edu.startDate && new Date(edu.startDate).toLocaleDateString()}
                                                {edu.startDate && edu.endDate && ' - '}
                                                {edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    )}

                    {candidate.workExperiences && candidate.workExperiences.length > 0 && (
                        <div className="mb-4">
                            <h5>
                                Experiencia Laboral
                                <Badge bg="secondary" className="ms-2">{candidate.workExperiences.length}</Badge>
                            </h5>
                            <ListGroup variant="flush">
                                {candidate.workExperiences.map((exp, index) => (
                                    <ListGroup.Item key={exp.id || index}>
                                        <strong>{exp.company}</strong>
                                        {exp.position && <span> - {exp.position}</span>}
                                        {exp.description && (
                                            <p className="mb-1 text-muted">{exp.description}</p>
                                        )}
                                        {(exp.startDate || exp.endDate) && (
                                            <div className="text-muted small">
                                                {exp.startDate && new Date(exp.startDate).toLocaleDateString()}
                                                {exp.startDate && exp.endDate && ' - '}
                                                {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Actualmente'}
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    )}

                    {(!candidate.educations || candidate.educations.length === 0) && 
                     (!candidate.workExperiences || candidate.workExperiences.length === 0) && (
                        <Alert variant="info">
                            Este candidato no tiene educación ni experiencia laboral registrada.
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CandidateDetail;

