import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCandidateForm from './AddCandidateForm';
import { API_BASE_URL } from '../services/candidateService';

// Mock de useNavigate de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock del componente FileUploader para simplificar el test
jest.mock('./FileUploader', () => {
    return function MockFileUploader() {
        return <div data-testid="file-uploader">File Uploader Mock</div>;
    };
});

// Mock de react-datepicker
jest.mock('react-datepicker', () => {
    return function MockDatePicker({ placeholderText }) {
        return <input placeholder={placeholderText} />;
    };
});

describe('AddCandidateForm', () => {
    beforeEach(() => {
        // Reset de mocks antes de cada test
        jest.clearAllMocks();
        mockNavigate.mockClear();
        // Usar fake timers para controlar setTimeout
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Restaurar fetch después de cada test
        jest.restoreAllMocks();
        // Restaurar timers reales
        jest.useRealTimers();
    });

    it('renderiza el formulario correctamente', () => {
        render(<AddCandidateForm />);

        // Verificar que los campos principales están presentes
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
    });

    it('permite rellenar los campos del formulario', async () => {
        render(<AddCandidateForm />);

        const nombreInput = screen.getByLabelText(/nombre/i);
        const apellidoInput = screen.getByLabelText(/apellido/i);
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const telefonoInput = screen.getByLabelText(/teléfono/i);

        await userEvent.type(nombreInput, 'Juan');
        await userEvent.type(apellidoInput, 'Pérez');
        await userEvent.type(emailInput, 'juan.perez@email.com');
        await userEvent.type(telefonoInput, '123456789');

        expect(nombreInput).toHaveValue('Juan');
        expect(apellidoInput).toHaveValue('Pérez');
        expect(emailInput).toHaveValue('juan.perez@email.com');
        expect(telefonoInput).toHaveValue('123456789');
    });

    it('envía el formulario con los datos correctos y llama al backend', async () => {
        // Mock de fetch para simular respuesta exitosa del backend
        const mockFetch = jest.fn().mockResolvedValue({
            status: 201,
            json: () => Promise.resolve({ id: 1, message: 'Candidato creado' })
        });
        global.fetch = mockFetch;

        render(<AddCandidateForm />);

        // Rellenar los campos
        const nombreInput = screen.getByLabelText(/nombre/i);
        const apellidoInput = screen.getByLabelText(/apellido/i);
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const telefonoInput = screen.getByLabelText(/teléfono/i);

        await userEvent.type(nombreInput, 'María');
        await userEvent.type(apellidoInput, 'García');
        await userEvent.type(emailInput, 'maria.garcia@email.com');
        await userEvent.type(telefonoInput, '987654321');

        // Enviar el formulario
        const submitButton = screen.getByRole('button', { name: /enviar/i });
        fireEvent.click(submitButton);

        // Verificar que fetch fue llamado con los datos correctos
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        // Verificar la URL y el método
        expect(mockFetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/candidates`,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: expect.any(String)
            })
        );

        // Verificar los datos enviados en el body
        const callArgs = mockFetch.mock.calls[0];
        const bodyData = JSON.parse(callArgs[1].body);

        expect(bodyData).toMatchObject({
            firstName: 'María',
            lastName: 'García',
            email: 'maria.garcia@email.com',
            phone: '987654321'
        });

        // Verificar que aparece el mensaje de éxito
        await waitFor(() => {
            expect(screen.getByText(/candidato añadido con éxito/i)).toBeInTheDocument();
        });
    });

    it('muestra mensaje de error cuando el envío falla', async () => {
        // Mock de fetch para simular error
        const mockFetch = jest.fn().mockResolvedValue({
            status: 500,
            json: () => Promise.resolve({ message: 'Error del servidor' })
        });
        global.fetch = mockFetch;

        render(<AddCandidateForm />);

        // Rellenar campos mínimos (incluyendo teléfono que ahora es obligatorio)
        await userEvent.type(screen.getByLabelText(/nombre/i), 'Test');
        await userEvent.type(screen.getByLabelText(/apellido/i), 'User');
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/teléfono/i), '123456789');

        // Enviar formulario
        fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

        // Verificar mensaje de error
        await waitFor(() => {
            expect(screen.getByText(/error al añadir candidato/i)).toBeInTheDocument();
        });
    });

    it('muestra errores de validación cuando los campos están vacíos', async () => {
        render(<AddCandidateForm />);

        // Enviar formulario sin rellenar ningún campo
        const submitButton = screen.getByRole('button', { name: /enviar/i });
        fireEvent.click(submitButton);

        // Verificar que se muestran los mensajes de error
        await waitFor(() => {
            const errorMessages = screen.getAllByText('Este campo es obligatorio');
            expect(errorMessages.length).toBe(4); // firstName, lastName, email, phone
        });
    });

    it('muestra error de formato de correo inválido', async () => {
        render(<AddCandidateForm />);

        // Rellenar campos con email inválido
        await userEvent.type(screen.getByLabelText(/nombre/i), 'Test');
        await userEvent.type(screen.getByLabelText(/apellido/i), 'User');
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'correo-invalido');
        await userEvent.type(screen.getByLabelText(/teléfono/i), '123456789');

        // Enviar formulario
        fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

        // Verificar mensaje de error de formato de correo
        await waitFor(() => {
            expect(screen.getByText('Formato de correo no válido')).toBeInTheDocument();
        });
    });

    it('no llama al backend cuando hay errores de validación', async () => {
        const mockFetch = jest.fn();
        global.fetch = mockFetch;

        render(<AddCandidateForm />);

        // Enviar formulario sin rellenar campos
        fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

        // Esperar un momento y verificar que fetch NO fue llamado
        await waitFor(() => {
            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    it('limpia el error de un campo cuando el usuario lo modifica', async () => {
        render(<AddCandidateForm />);

        // Enviar formulario vacío para generar errores
        fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

        // Verificar que hay errores
        await waitFor(() => {
            expect(screen.getAllByText('Este campo es obligatorio').length).toBe(4);
        });

        // Escribir en el campo nombre
        await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');

        // Verificar que ahora hay un error menos (3 en vez de 4)
        await waitFor(() => {
            expect(screen.getAllByText('Este campo es obligatorio').length).toBe(3);
        });
    });
});

