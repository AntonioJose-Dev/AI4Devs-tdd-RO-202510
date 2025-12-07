import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCandidateForm from './AddCandidateForm';

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
    });

    afterEach(() => {
        // Restaurar fetch después de cada test
        jest.restoreAllMocks();
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
            'http://localhost:3010/candidates',
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

        // Rellenar campos mínimos
        await userEvent.type(screen.getByLabelText(/nombre/i), 'Test');
        await userEvent.type(screen.getByLabelText(/apellido/i), 'User');
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');

        // Enviar formulario
        fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

        // Verificar mensaje de error
        await waitFor(() => {
            expect(screen.getByText(/error al añadir candidato/i)).toBeInTheDocument();
        });
    });
});

