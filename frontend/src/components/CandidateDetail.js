import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { ArrowLeft, EnvelopeFill, TelephoneFill, PersonFill, MortarboardFill, BriefcaseFill } from 'react-bootstrap-icons';
import { getCandidateById } from '../services/candidateService';
import './SharedStyles.css';
import './CandidateDetail.css';

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
            <div className="loading-wrapper">
                <Spinner animation="border" role="status" variant="primary" />
                <p>Cargando candidato...</p>
            </div>
        );
    }

    if (error === 'not_found') {
        return (
            <div className="page-wrapper">
                <div className="main-card" style={{ maxWidth: '600px' }}>
                    <div className="main-card-body">
                        <div className="alert-custom" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#92400e' }}>
                            <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Candidato no encontrado</h4>
                            <p style={{ marginBottom: '16px' }}>El candidato con ID {id} no existe en el sistema.</p>
                            <hr style={{ borderColor: 'rgba(146, 64, 14, 0.2)', margin: '16px 0' }} />
                            <Link to="/candidates">
                                <button className="btn-secondary-custom">
                                    <ArrowLeft className="me-2" />
                                    Volver al listado
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error === 'network') {
        return (
            <div className="page-wrapper">
                <div className="main-card" style={{ maxWidth: '600px' }}>
                    <div className="main-card-body">
                        <div className="alert-custom alert-danger-custom">
                            <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Error al cargar el candidato</h4>
                            <p style={{ marginBottom: '16px' }}>Ha ocurrido un problema al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.</p>
                            <hr style={{ borderColor: 'rgba(153, 27, 27, 0.2)', margin: '16px 0' }} />
                            <Link to="/candidates">
                                <button className="btn-secondary-custom">
                                    <ArrowLeft className="me-2" />
                                    Volver al listado
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="main-card candidate-detail-card">
                {/* Header elegante dentro de la card */}
                <div className="main-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <PersonFill className="header-icon" />
                            <div>
                                <h4 className="card-title" style={{ fontSize: '1.75rem', marginBottom: '4px' }}>
                                    {candidate.firstName} {candidate.lastName}
                                </h4>
                                <p className="card-subtitle" style={{ margin: 0 }}>
                                    Información de contacto
                                </p>
                            </div>
                        </div>
                        <Link to="/candidates">
                            <button className="btn-secondary-custom" style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
                                <ArrowLeft className="me-2" />
                                Volver al listado
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Body con información del candidato */}
                <div className="main-card-body">
                    {/* Sección de Información de Contacto */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            Información de Contacto
                        </div>
                        <div className="detail-info-grid">
                            <div className="detail-info-item">
                                <EnvelopeFill className="detail-info-icon" />
                                <div>
                                    <span className="detail-info-label">Email</span>
                                    <span className="detail-info-value">{candidate.email || 'No disponible'}</span>
                                </div>
                            </div>
                            <div className="detail-info-item">
                                <TelephoneFill className="detail-info-icon" />
                                <div>
                                    <span className="detail-info-label">Teléfono</span>
                                    <span className="detail-info-value">{candidate.phone || 'No disponible'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Educación */}
                    {candidate.educations && candidate.educations.length > 0 && (
                        <div className="detail-section">
                            <div className="detail-section-title">
                                <MortarboardFill className="section-icon" />
                                Educación
                                <Badge className="detail-badge">{candidate.educations.length}</Badge>
                            </div>
                            <div className="detail-items-list">
                                {candidate.educations.map((edu, index) => (
                                    <div key={edu.id || index} className="detail-list-item">
                                        <div className="detail-item-main">
                                            <strong>{edu.institution}</strong>
                                            {edu.title && <span className="detail-item-subtitle"> — {edu.title}</span>}
                                        </div>
                                        {(edu.startDate || edu.endDate) && (
                                            <div className="detail-item-dates">
                                                {edu.startDate && new Date(edu.startDate).toLocaleDateString()}
                                                {edu.startDate && edu.endDate && ' - '}
                                                {edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sección de Experiencia Laboral */}
                    {candidate.workExperiences && candidate.workExperiences.length > 0 && (
                        <div className="detail-section">
                            <div className="detail-section-title">
                                <BriefcaseFill className="section-icon" />
                                Experiencia Laboral
                                <Badge className="detail-badge">{candidate.workExperiences.length}</Badge>
                            </div>
                            <div className="detail-items-list">
                                {candidate.workExperiences.map((exp, index) => (
                                    <div key={exp.id || index} className="detail-list-item">
                                        <div className="detail-item-main">
                                            <strong>{exp.company}</strong>
                                            {exp.position && <span className="detail-item-subtitle"> — {exp.position}</span>}
                                        </div>
                                        {exp.description && (
                                            <p className="detail-item-description">{exp.description}</p>
                                        )}
                                        {(exp.startDate || exp.endDate) && (
                                            <div className="detail-item-dates">
                                                {exp.startDate && new Date(exp.startDate).toLocaleDateString()}
                                                {exp.startDate && exp.endDate && ' - '}
                                                {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Actualmente'}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mensaje cuando no hay educación ni experiencia */}
                    {(!candidate.educations || candidate.educations.length === 0) && 
                     (!candidate.workExperiences || candidate.workExperiences.length === 0) && (
                        <div className="alert-custom alert-info-custom" style={{ marginTop: '16px' }}>
                            Este candidato no tiene educación ni experiencia laboral registrada.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateDetail;
