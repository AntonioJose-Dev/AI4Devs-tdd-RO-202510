import request from 'supertest';
import app from '../src/index';

// Mock del módulo prismaClient
jest.mock('../src/infrastructure/prismaClient', () => {
  return {
    prisma: {
      candidate: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      education: {
        create: jest.fn(),
      },
      workExperience: {
        create: jest.fn(),
      },
      resume: {
        create: jest.fn(),
      },
    },
    Prisma: {
      PrismaClientInitializationError: class PrismaClientInitializationError extends Error {},
    },
  };
});

// Importar el mock después de configurarlo
import { prisma } from '../src/infrastructure/prismaClient';

describe('GET /candidates/:id', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver un candidato existente con status 200', async () => {
    // Datos que simulan la respuesta de la base de datos
    const mockCandidate = {
      id: 1,
      firstName: 'Albert',
      lastName: 'Saelices',
      email: 'albert.saelices@gmail.com',
      phone: '656874937',
      address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
    };

    // Configurar el mock de Prisma para findUnique
    (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(mockCandidate);

    // Realizar la llamada HTTP
    const response = await request(app).get('/candidates/1');

    // Verificar el status de la respuesta
    expect(response.status).toBe(200);

    // Verificar que el cuerpo de la respuesta contiene los datos esperados
    expect(response.body).toMatchObject({
      id: 1,
      firstName: mockCandidate.firstName,
      lastName: mockCandidate.lastName,
      email: mockCandidate.email,
    });

    // Verificar que prisma.candidate.findUnique fue llamado una vez
    expect(prisma.candidate.findUnique).toHaveBeenCalledTimes(1);

    // Verificar que findUnique fue llamado con los parámetros esperados
    expect(prisma.candidate.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
      })
    );
  });

  it('debería devolver status 404 si el candidato no existe', async () => {
    // Configurar el mock de Prisma para devolver null (candidato no encontrado)
    (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(null);

    // Realizar la llamada HTTP
    const response = await request(app).get('/candidates/999');

    // Verificar el status de la respuesta
    expect(response.status).toBe(404);

    // Verificar que el cuerpo de la respuesta contiene el mensaje de error esperado
    expect(response.body).toEqual({ message: 'Candidate not found' });

    // Verificar que prisma.candidate.findUnique fue llamado una vez
    expect(prisma.candidate.findUnique).toHaveBeenCalledTimes(1);

    // Verificar que findUnique fue llamado con el ID correcto
    expect(prisma.candidate.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 999 },
      })
    );
  });

  it('debería devolver status 500 si ocurre un error de base de datos', async () => {
    // Configurar el mock de Prisma para rechazar con un error
    (prisma.candidate.findUnique as jest.Mock).mockRejectedValue(
      new Error('DB error')
    );

    // Realizar la llamada HTTP
    const response = await request(app).get('/candidates/1');

    // Verificar el status de la respuesta
    expect(response.status).toBe(500);

    // Verificar que el cuerpo de la respuesta contiene un mensaje de error genérico
    expect(response.body).toHaveProperty('message');
    expect(typeof response.body.message).toBe('string');

    // Verificar que prisma.candidate.findUnique fue llamado una vez
    expect(prisma.candidate.findUnique).toHaveBeenCalledTimes(1);
  });
});

