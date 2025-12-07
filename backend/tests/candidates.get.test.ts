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

describe('GET /candidates', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver la lista de candidatos con status 200', async () => {
    // Datos que simulan la respuesta de la base de datos con 2 candidatos
    const mockCandidates = [
      {
        id: 1,
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
      },
      {
        id: 2,
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@example.com',
        phone: '612345678',
        address: 'Calle Mayor 10, Madrid',
      },
    ];

    // Configurar el mock de Prisma para findMany
    (prisma.candidate.findMany as jest.Mock).mockResolvedValue(mockCandidates);

    // Realizar la llamada HTTP
    const response = await request(app).get('/candidates');

    // Verificar el status de la respuesta
    expect(response.status).toBe(200);

    // Verificar que el cuerpo de la respuesta es un array con longitud 2
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);

    // Verificar que cada candidato tiene al menos id, firstName, lastName, email
    response.body.forEach((candidate: any) => {
      expect(candidate).toHaveProperty('id');
      expect(candidate).toHaveProperty('firstName');
      expect(candidate).toHaveProperty('lastName');
      expect(candidate).toHaveProperty('email');
    });

    // Verificar que los datos de los candidatos coinciden
    expect(response.body[0]).toMatchObject({
      id: 1,
      firstName: 'Albert',
      lastName: 'Saelices',
      email: 'albert.saelices@gmail.com',
    });

    expect(response.body[1]).toMatchObject({
      id: 2,
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@example.com',
    });

    // Verificar que prisma.candidate.findMany fue llamado una vez
    expect(prisma.candidate.findMany).toHaveBeenCalledTimes(1);

    // Verificar que findMany fue llamado con los parámetros esperados
    expect(prisma.candidate.findMany).toHaveBeenCalledWith(expect.any(Object));
  });

  it('debería devolver un array vacío si no hay candidatos', async () => {
    // Configurar el mock de Prisma para devolver un array vacío
    (prisma.candidate.findMany as jest.Mock).mockResolvedValue([]);

    // Realizar la llamada HTTP
    const response = await request(app).get('/candidates');

    // Verificar el status de la respuesta
    expect(response.status).toBe(200);

    // Verificar que el cuerpo de la respuesta es un array vacío
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);

    // Verificar que prisma.candidate.findMany fue llamado una vez
    expect(prisma.candidate.findMany).toHaveBeenCalledTimes(1);
  });

  it('debería devolver status 500 cuando ocurre un error de base de datos', async () => {
    // Configurar el mock de Prisma para rechazar con un error
    (prisma.candidate.findMany as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    // Realizar la llamada HTTP
    const response = await request(app).get('/candidates');

    // Verificar el status de la respuesta
    expect(response.status).toBe(500);

    // Verificar que el cuerpo de la respuesta contiene un mensaje de error
    expect(response.body).toHaveProperty('message');
    expect(typeof response.body.message).toBe('string');

    // Verificar que prisma.candidate.findMany fue llamado una vez
    expect(prisma.candidate.findMany).toHaveBeenCalledTimes(1);
  });
});

