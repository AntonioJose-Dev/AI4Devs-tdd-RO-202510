import React from 'react';
import { Link } from 'react-router-dom';
import { PersonPlusFill, PeopleFill } from 'react-bootstrap-icons';
import logo from '../assets/lti-logo.png';
import './SharedStyles.css';

const RecruiterDashboard = () => {
    return (
        <div className="page-wrapper">
            <div className="main-card">
                {/* Header con gradiente */}
                <div className="main-card-header" style={{ textAlign: 'center' }}>
                    <img src={logo} alt="LTI Logo" className="dashboard-logo" />
                    <h1 className="card-title">Dashboard del Reclutador</h1>
                    <p className="card-subtitle">Gestiona candidatos de forma eficiente</p>
                </div>

                {/* Body con las acciones */}
                <div className="main-card-body">
                    <div className="dashboard-grid">
                        {/* Card Añadir Candidato */}
                        <div className="dashboard-action-card">
                            <PersonPlusFill className="card-icon" />
                            <h5>Añadir Candidato</h5>
                            <Link to="/add-candidate">
                                <button className="btn-primary-custom">
                                    Añadir Nuevo Candidato
                                </button>
                            </Link>
                        </div>

                        {/* Card Ver Candidatos */}
                        <div className="dashboard-action-card">
                            <PeopleFill className="card-icon" />
                            <h5>Ver Candidatos</h5>
                            <Link to="/candidates">
                                <button className="btn-primary-custom">
                                    Ver Listado de Candidatos
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="main-card-footer" style={{ textAlign: 'center' }}>
                    Sistema de Gestión de Candidatos - LTI
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
