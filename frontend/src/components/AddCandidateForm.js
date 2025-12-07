import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, FormControl, Row, Col } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import FileUploader from './FileUploader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddCandidateForm.css';
import Loader from './Loader';
import { API_BASE_URL } from '../services/candidateService';

// Ilustración SVG de recruiting moderna y atractiva
const RecruitingIllustration = () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fondo decorativo con círculos */}
        <circle cx="200" cy="200" r="180" fill="url(#bgGradient)" opacity="0.15"/>
        <circle cx="320" cy="80" r="40" fill="#8b5cf6" opacity="0.2"/>
        <circle cx="80" cy="320" r="30" fill="#4f6df5" opacity="0.25"/>
        
        {/* Documento/CV principal */}
        <rect x="130" y="80" width="140" height="180" rx="12" fill="white" filter="url(#shadow)"/>
        <rect x="145" y="100" width="80" height="8" rx="4" fill="#e5e7eb"/>
        <rect x="145" y="118" width="110" height="6" rx="3" fill="#f3f4f6"/>
        <rect x="145" y="132" width="95" height="6" rx="3" fill="#f3f4f6"/>
        <rect x="145" y="146" width="105" height="6" rx="3" fill="#f3f4f6"/>
        
        {/* Foto del candidato en el CV */}
        <circle cx="200" cy="195" r="28" fill="#ddd6fe"/>
        <circle cx="200" cy="188" r="12" fill="#a78bfa"/>
        <ellipse cx="200" cy="212" rx="16" ry="10" fill="#a78bfa"/>
        
        {/* Checkmark de aprobación */}
        <circle cx="250" cy="100" r="20" fill="#10b981"/>
        <path d="M240 100 L247 107 L260 93" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* Persona reclutadora */}
        <ellipse cx="300" cy="330" rx="50" ry="40" fill="#4f6df5"/>
        <circle cx="300" cy="250" r="40" fill="#fcd5b8"/>
        <path d="M260 240 Q265 210 300 205 Q335 210 340 240 Q335 230 300 227 Q265 230 260 240" fill="#4a3728"/>
        <circle cx="285" cy="248" r="5" fill="#2d2d2d"/>
        <circle cx="315" cy="248" r="5" fill="#2d2d2d"/>
        <path d="M288 268 Q300 278 312 268" stroke="#2d2d2d" strokeWidth="3" strokeLinecap="round" fill="none"/>
        
        {/* Lupa de búsqueda */}
        <circle cx="100" cy="150" r="35" fill="none" stroke="#6b5ce7" strokeWidth="8"/>
        <line x1="125" y1="175" x2="150" y2="200" stroke="#6b5ce7" strokeWidth="8" strokeLinecap="round"/>
        
        {/* Persona candidato pequeña dentro de lupa */}
        <circle cx="100" cy="145" r="12" fill="#fcd5b8"/>
        <ellipse cx="100" cy="165" rx="10" ry="8" fill="#8b5cf6"/>
        
        {/* Estrellas decorativas */}
        <path d="M350 180 L353 188 L362 188 L355 194 L358 202 L350 197 L342 202 L345 194 L338 188 L347 188 Z" fill="#fbbf24"/>
        <path d="M60 100 L62 106 L68 106 L63 110 L65 116 L60 112 L55 116 L57 110 L52 106 L58 106 Z" fill="#fbbf24"/>
        
        {/* Líneas de conexión */}
        <path d="M135 200 Q100 200 100 180" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
        <path d="M265 180 Q300 200 300 230" stroke="#4f6df5" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
        
        {/* Definiciones de gradientes y filtros */}
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f6df5"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15"/>
            </filter>
        </defs>
    </svg>
);

const AddCandidateForm = () => {
    const navigate = useNavigate();
    const navigationTimeoutRef = useRef(null);

    // Cleanup del timeout de navegación al desmontar el componente
    useEffect(() => {
        return () => {
            if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
        };
    }, []);

    // En ambiente de test, omitimos el loader para que los tests puedan acceder al formulario inmediatamente
    const isTestEnv = process.env.NODE_ENV === 'test';
    const [isLoading, setIsLoading] = useState(!isTestEnv);
    const [candidate, setCandidate] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        educations: [],
        workExperiences: [],
        cv: null
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Expresión regular simple para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Función de validación de campos
    const validateFields = () => {
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        };
        let isValid = true;

        if (!candidate.firstName.trim()) {
            newErrors.firstName = 'Este campo es obligatorio';
            isValid = false;
        }

        if (!candidate.lastName.trim()) {
            newErrors.lastName = 'Este campo es obligatorio';
            isValid = false;
        }

        if (!candidate.email.trim()) {
            newErrors.email = 'Este campo es obligatorio';
            isValid = false;
        } else if (!emailRegex.test(candidate.email)) {
            newErrors.email = 'Formato de correo no válido';
            isValid = false;
        }

        if (!candidate.phone.trim()) {
            newErrors.phone = 'Este campo es obligatorio';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Función para limpiar el error de un campo específico
    const clearFieldError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    useEffect(() => {
        // En ambiente de test, el loader se oculta inmediatamente para no bloquear los tests
        const loaderDuration = process.env.NODE_ENV === 'test' ? 0 : 1000;
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, loaderDuration);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e, index, section) => {
        const updatedSection = [...candidate[section]];
        if (updatedSection[index]) {
            updatedSection[index][e.target.name] = e.target.value;
            setCandidate({ ...candidate, [section]: updatedSection });
        }
    };

    const handleDateChange = (date, index, section, field) => {
        const updatedSection = [...candidate[section]];
        if (updatedSection[index]) {
            updatedSection[index][field] = date;
            setCandidate({ ...candidate, [section]: updatedSection });
        }
    };

    const handleAddSection = (section) => {
        const newSection = section === 'educations' ? { institution: '', title: '', startDate: '', endDate: '' } : { company: '', position: '', description: '', startDate: '', endDate: '' };
        setCandidate({ ...candidate, [section]: [...candidate[section], newSection] });
    };

    const handleRemoveSection = (index, section) => {
        const updatedSection = [...candidate[section]];
        updatedSection.splice(index, 1);
        setCandidate({ ...candidate, [section]: updatedSection });
    };

    const handleCVUpload = (fileData) => {
        setCandidate({ ...candidate, cv: fileData });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar campos antes de enviar
        if (!validateFields()) {
            return;
        }

        try {
            const candidateData = {
                ...candidate,
                cv: candidate.cv ? {
                    filePath: candidate.cv.filePath,
                    fileType: candidate.cv.fileType
                } : null
            };

            // Format date fields to YYYY-MM-DD before sending to the endpoint
            candidateData.educations = candidateData.educations.map(education => ({
                ...education,
                startDate: education.startDate ? education.startDate.toISOString().slice(0, 10) : '',
                endDate: education.endDate ? education.endDate.toISOString().slice(0, 10) : ''
            }));
            candidateData.workExperiences = candidateData.workExperiences.map(experience => ({
                ...experience,
                startDate: experience.startDate ? experience.startDate.toISOString().slice(0, 10) : '',
                endDate: experience.endDate ? experience.endDate.toISOString().slice(0, 10) : ''
            }));

            const res = await fetch(`${API_BASE_URL}/candidates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(candidateData)
            });

            if (res.status === 201) {
                setSuccessMessage('Candidato añadido con éxito');
                setError('');
                // Navegar a la lista de candidatos después de 2 segundos
                navigationTimeoutRef.current = setTimeout(() => {
                    navigate('/candidates');
                }, 2000);
            } else if (res.status === 400) {
                const errorData = await res.json();
                throw new Error('Datos inválidos: ' + errorData.message);
            } else if (res.status === 500) {
                throw new Error('Error interno del servidor');
            } else {
                throw new Error('Error al enviar datos del candidato');
            }
        } catch (error) {
            setError('Error al añadir candidato: ' + error.message);
            setSuccessMessage('');
        }
    };

    // Mientras isLoading es true, mostrar solo el Loader
    if (isLoading) {
        return <Loader />;
    }

    // Cuando isLoading pasa a false, renderizar la card con la animación main-card-reveal
    return (
        <div className="add-candidate-page">
            {/* Card principal única con animación mainCardReveal aplicada en el primer render */}
            <div className="add-candidate-main-card main-card-reveal">
                {/* Lado izquierdo: Ilustración de recruiting */}
                <div className="main-card-illustration">
                    <div className="illustration-wrapper">
                        <RecruitingIllustration />
                    </div>
                    <div className="illustration-content">
                        <h2 className="illustration-title">Talento Excepcional</h2>
                        <p className="illustration-description">
                            Encuentra a los mejores candidatos para tu equipo. 
                            Nuestro sistema te ayuda a gestionar el proceso de selección de forma eficiente.
                        </p>
                        <div className="illustration-badges">
                            <span className="badge-item">✓ Rápido</span>
                            <span className="badge-item">✓ Eficiente</span>
                            <span className="badge-item">✓ Intuitivo</span>
                        </div>
                    </div>
                </div>

                {/* Lado derecho: Formulario */}
                <div className="main-card-form">
                    <h1 className="form-title">Agregar Candidato</h1>
                    <p className="form-subtitle">Complete los datos del nuevo candidato</p>
                    
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="firstName" className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        required
                                        placeholder="Ingrese el nombre"
                                        isInvalid={!!errors.firstName}
                                        onChange={(e) => {
                                            setCandidate({ ...candidate, firstName: e.target.value });
                                            clearFieldError('firstName');
                                        }}
                                    />
                                    {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="lastName" className="mb-3">
                                    <Form.Label>Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        required
                                        placeholder="Ingrese el apellido"
                                        isInvalid={!!errors.lastName}
                                        onChange={(e) => {
                                            setCandidate({ ...candidate, lastName: e.target.value });
                                            clearFieldError('lastName');
                                        }}
                                    />
                                    {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                placeholder="ejemplo@correo.com"
                                isInvalid={!!errors.email}
                                onChange={(e) => {
                                    setCandidate({ ...candidate, email: e.target.value });
                                    clearFieldError('email');
                                }}
                            />
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="phone" className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        placeholder="+34 600 000 000"
                                        isInvalid={!!errors.phone}
                                        onChange={(e) => {
                                            setCandidate({ ...candidate, phone: e.target.value });
                                            clearFieldError('phone');
                                        }}
                                    />
                                    {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="address" className="mb-3">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="Ciudad, País"
                                        onChange={(e) => setCandidate({ ...candidate, address: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="cv" className="mb-3">
                            <Form.Label>CV</Form.Label>
                            <FileUploader
                                onChange={handleCVUpload}
                                onUpload={handleCVUpload}
                            />
                        </Form.Group>

                        {/* Sección de Educación */}
                        <div className="form-section-title">Educación</div>
                        <Button 
                            onClick={() => handleAddSection('educations')} 
                            className="btn btn-primary btn-sm mb-3"
                        >
                            Añadir Educación
                        </Button>
                        
                        {candidate.educations.map((education, index) => (
                            <div key={index} className="mb-3 p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <FormControl
                                            placeholder="Institución"
                                            name="institution"
                                            value={education.institution}
                                            onChange={(e) => handleInputChange(e, index, 'educations')}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormControl
                                            placeholder="Título"
                                            name="title"
                                            value={education.title}
                                            onChange={(e) => handleInputChange(e, index, 'educations')}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <DatePicker
                                            selected={education.startDate}
                                            onChange={(date) => handleDateChange(date, index, 'educations', 'startDate')}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Fecha de Inicio"
                                            className="form-control"
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <DatePicker
                                            selected={education.endDate}
                                            onChange={(date) => handleDateChange(date, index, 'educations', 'endDate')}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Fecha de Fin"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                <Button variant="danger" size="sm" onClick={() => handleRemoveSection(index, 'educations')}>
                                    <Trash /> Eliminar
                                </Button>
                            </div>
                        ))}

                        {/* Sección de Experiencia Laboral */}
                        <div className="form-section-title">Experiencia Laboral</div>
                        <Button 
                            onClick={() => handleAddSection('workExperiences')} 
                            className="btn btn-primary btn-sm mb-3"
                        >
                            Añadir Experiencia Laboral
                        </Button>
                        
                        {candidate.workExperiences.map((experience, index) => (
                            <div key={index} className="mb-3 p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <FormControl
                                            placeholder="Empresa"
                                            name="company"
                                            value={experience.company}
                                            onChange={(e) => handleInputChange(e, index, 'workExperiences')}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormControl
                                            placeholder="Puesto"
                                            name="position"
                                            value={experience.position}
                                            onChange={(e) => handleInputChange(e, index, 'workExperiences')}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <DatePicker
                                            selected={experience.startDate}
                                            onChange={(date) => handleDateChange(date, index, 'workExperiences', 'startDate')}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Fecha de Inicio"
                                            className="form-control"
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <DatePicker
                                            selected={experience.endDate}
                                            onChange={(date) => handleDateChange(date, index, 'workExperiences', 'endDate')}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Fecha de Fin"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                <Button variant="danger" size="sm" onClick={() => handleRemoveSection(index, 'workExperiences')}>
                                    <Trash /> Eliminar
                                </Button>
                            </div>
                        ))}

                        <Button type="submit" className="btn btn-primary w-100 mt-4">
                            Enviar
                        </Button>
                        
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AddCandidateForm;
