import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CandidateList from './CandidateList';
import { getAllCandidates } from '../services/candidateService';

// Mock del servicio candidateService
jest.mock('../services/candidateService', () => ({
    getAllCandidates: jest.fn()
}));

// Wrapper para proveer el Router necesario para los Links
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('CandidateList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('muestra el spinner de carga inicialmente', () => {
        // Mock que nunca resuelve para mantener el estado de carga
        getAllCandidates.mockImplementation(() => new Promise(() => {}));

        renderWithRouter(<CandidateList />);

        expect(screen.getByText(/cargando candidatos/i)).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renderiza la lista con 2 candidatos y muestra sus nombres y emails', async () => {
        // Mock de getAllCandidates devolviendo 2 candidatos de ejemplo
        const mockCandidates = [
            {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@email.com',
                phone: '123456789'
            },
            {
                id: 2,
                firstName: 'María',
                lastName: 'García',
                email: 'maria.garcia@email.com',
                phone: '987654321'
            }
        ];

        getAllCandidates.mockResolvedValue(mockCandidates);

        renderWithRouter(<CandidateList />);

        // Esperar a que se carguen los datos
        await waitFor(() => {
            expect(screen.queryByText(/cargando candidatos/i)).not.toBeInTheDocument();
        });

        // Verificar que se llamó al servicio
        expect(getAllCandidates).toHaveBeenCalledTimes(1);

        // Verificar que aparecen los nombres de los candidatos
        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText('María')).toBeInTheDocument();

        // Verificar que aparecen los apellidos
        expect(screen.getByText('Pérez')).toBeInTheDocument();
        expect(screen.getByText('García')).toBeInTheDocument();

        // Verificar que aparecen los emails
        expect(screen.getByText('juan.perez@email.com')).toBeInTheDocument();
        expect(screen.getByText('maria.garcia@email.com')).toBeInTheDocument();

        // Verificar que aparece el contador de candidatos
        expect(screen.getByText(/total: 2 candidato\(s\)/i)).toBeInTheDocument();
    });

    it('muestra mensaje cuando no hay candidatos', async () => {
        getAllCandidates.mockResolvedValue([]);

        renderWithRouter(<CandidateList />);

        await waitFor(() => {
            expect(screen.queryByText(/cargando candidatos/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/no hay candidatos registrados/i)).toBeInTheDocument();
    });

    it('muestra mensaje de error cuando falla la carga', async () => {
        getAllCandidates.mockRejectedValue(new Error('Error de red'));

        renderWithRouter(<CandidateList />);

        await waitFor(() => {
            expect(screen.queryByText(/cargando candidatos/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/error al cargar los candidatos/i)).toBeInTheDocument();
    });

    it('renderiza los botones de "Ver detalle" para cada candidato', async () => {
        const mockCandidates = [
            { id: 1, firstName: 'Ana', lastName: 'López', email: 'ana@email.com', phone: '111' },
            { id: 2, firstName: 'Pedro', lastName: 'Sánchez', email: 'pedro@email.com', phone: '222' }
        ];

        getAllCandidates.mockResolvedValue(mockCandidates);

        renderWithRouter(<CandidateList />);

        await waitFor(() => {
            expect(screen.queryByText(/cargando candidatos/i)).not.toBeInTheDocument();
        });

        // Verificar que hay 2 botones de "Ver detalle"
        const detailButtons = screen.getAllByRole('button', { name: /ver detalle/i });
        expect(detailButtons).toHaveLength(2);
    });
});

