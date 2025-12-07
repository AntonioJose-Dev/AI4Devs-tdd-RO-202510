import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { EyeFill, ArrowLeft, PeopleFill, SortAlphaDown } from 'react-bootstrap-icons';
import { getAllCandidates } from '../services/candidateService';
import './SharedStyles.css';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('default'); // 'default' | 'name' | 'email'

    // Ordenar candidatos según el criterio seleccionado
    const sortedCandidates = useMemo(() => {
        if (sortBy === 'default') {
            return candidates;
        }
        return candidates.slice().sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = (a.firstName || '').toLowerCase();
                const nameB = (b.firstName || '').toLowerCase();
                return nameA.localeCompare(nameB);
            }
            if (sortBy === 'email') {
                const emailA = (a.email || '').toLowerCase();
                const emailB = (b.email || '').toLowerCase();
                return emailA.localeCompare(emailB);
            }
            return 0;
        });
    }, [candidates, sortBy]);

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
            <div className="loading-wrapper">
                <Spinner animation="border" role="status" variant="primary" />
                <p>Cargando candidatos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper">
                <div className="main-card" style={{ maxWidth: '600px' }}>
                    <div className="main-card-body">
                        <div className="alert-custom alert-danger-custom">
                            <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Error</h4>
                            <p style={{ marginBottom: '16px' }}>{error}</p>
                            <hr style={{ borderColor: 'rgba(153, 27, 27, 0.2)', margin: '16px 0' }} />
                            <Link to="/">
                                <button className="btn-secondary-custom">
                                    <ArrowLeft className="me-2" />
                                    Volver al Dashboard
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
            <div className="main-card">
                {/* Header */}
                <div className="main-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleFill className="header-icon" />
                            <div>
                                <h4 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                                    Listado de Candidatos
                                </h4>
                                <p className="card-subtitle" style={{ margin: 0 }}>
                                    Gestiona y visualiza todos los candidatos
                                </p>
                            </div>
                        </div>
                        <Link to="/">
                            <button className="btn-secondary-custom" style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
                                <ArrowLeft className="me-2" />
                                Volver al Dashboard
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Body */}
                <div className="main-card-body">
                    {candidates.length === 0 ? (
                        <div className="alert-custom alert-info-custom">
                            No hay candidatos registrados en el sistema.
                            <Link to="/add-candidate" className="ms-2">
                                <Button className="btn-primary-custom" size="sm" style={{ padding: '10px 20px' }}>
                                    Añadir candidato
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            {/* Control de ordenación */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                marginBottom: '16px',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <SortAlphaDown style={{ color: '#6366f1', fontSize: '1.2rem' }} />
                                <label htmlFor="sort-select" style={{ 
                                    fontWeight: 600, 
                                    color: '#374151',
                                    fontSize: '0.9rem',
                                    margin: 0
                                }}>
                                    Ordenar por:
                                </label>
                                <select
                                    id="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '2px solid #e2e8f0',
                                        background: '#ffffff',
                                        color: '#374151',
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <option value="default">Orden original</option>
                                    <option value="name">Nombre (A→Z)</option>
                                    <option value="email">Email (A→Z)</option>
                                </select>
                            </div>
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedCandidates.map((candidate, index) => (
                                        <tr key={candidate.id}>
                                            <td>{index + 1}</td>
                                            <td>{candidate.firstName}</td>
                                            <td>{candidate.lastName}</td>
                                            <td>{candidate.email || '-'}</td>
                                            <td>{candidate.phone || '-'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Link to={`/candidates/${candidate.id}`}>
                                                    <button className="btn-info-custom">
                                                        <EyeFill className="me-1" />
                                                        Ver detalle
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="main-card-footer">
                    Total: {candidates.length} candidato(s)
                </div>
            </div>
        </div>
    );
};

export default CandidateList;
