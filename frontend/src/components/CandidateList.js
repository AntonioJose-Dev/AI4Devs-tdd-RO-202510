import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { EyeFill, ArrowLeft, PeopleFill } from 'react-bootstrap-icons';
import { getAllCandidates } from '../services/candidateService';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllCandidates();
                setCandidates(data);
            } catch (err) {
                setError('Error al cargar los candidatos. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-3">Cargando candidatos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <Link to="/">
                        <Button variant="outline-danger">
                            <ArrowLeft className="me-2" />
                            Volver al Dashboard
                        </Button>
                    </Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Link to="/" className="text-decoration-none mb-4 d-inline-block">
                <Button variant="outline-secondary" size="sm">
                    <ArrowLeft className="me-2" />
                    Volver al Dashboard
                </Button>
            </Link>

            <Card className="shadow mt-3">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">
                        <PeopleFill className="me-2" />
                        Listado de Candidatos
                    </h4>
                </Card.Header>
                <Card.Body>
                    {candidates.length === 0 ? (
                        <Alert variant="info">
                            No hay candidatos registrados en el sistema.
                            <Link to="/add-candidate" className="ms-2">
                                <Button variant="primary" size="sm">Añadir candidato</Button>
                            </Link>
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={candidate.id}>
                                        <td>{index + 1}</td>
                                        <td>{candidate.firstName}</td>
                                        <td>{candidate.lastName}</td>
                                        <td>{candidate.email || '-'}</td>
                                        <td>{candidate.phone || '-'}</td>
                                        <td className="text-center">
                                            <Link to={`/candidates/${candidate.id}`}>
                                                <Button variant="info" size="sm">
                                                    <EyeFill className="me-1" />
                                                    Ver detalle
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
                <Card.Footer className="text-muted">
                    Total: {candidates.length} candidato(s)
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default CandidateList;

