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

// Payload de ejemplo basado en el README
const validCandidatePayload = {
  firstName: 'Albert',
  lastName: 'Saelices',
  email: 'albert.saelices@gmail.com',
  phone: '656874937',
  address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
  educations: [
    {
      institution: 'UC3M',
      title: 'Computer Science',
      startDate: '2006-12-31',
      endDate: '2010-12-26',
    },
  ],
  workExperiences: [
    {
      company: 'Coca Cola',
      position: 'SWE',
      description: '',
      startDate: '2011-01-13',
      endDate: '2013-01-17',
    },
  ],
  cv: {
    filePath: 'uploads/1715760936750-cv.pdf',
    fileType: 'application/pdf',
  },
};

describe('POST /candidates', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creación exitosa de candidato', () => {
    it('debería crear un candidato con datos válidos y devolver status 201', async () => {
      // Datos que simulan la respuesta de la base de datos al crear el candidato
      const mockCreatedCandidate = {
        id: 1,
        firstName: validCandidatePayload.firstName,
        lastName: validCandidatePayload.lastName,
        email: validCandidatePayload.email,
        phone: validCandidatePayload.phone,
        address: validCandidatePayload.address,
      };

      // Datos que simulan la respuesta de la base de datos al crear educación
      const mockCreatedEducation = {
        id: 1,
        candidateId: 1,
        institution: validCandidatePayload.educations[0].institution,
        title: validCandidatePayload.educations[0].title,
        startDate: new Date(validCandidatePayload.educations[0].startDate),
        endDate: new Date(validCandidatePayload.educations[0].endDate),
      };

      // Datos que simulan la respuesta de la base de datos al crear experiencia laboral
      const mockCreatedWorkExperience = {
        id: 1,
        candidateId: 1,
        company: validCandidatePayload.workExperiences[0].company,
        position: validCandidatePayload.workExperiences[0].position,
        description: validCandidatePayload.workExperiences[0].description,
        startDate: new Date(validCandidatePayload.workExperiences[0].startDate),
        endDate: new Date(validCandidatePayload.workExperiences[0].endDate),
      };

      // Datos que simulan la respuesta de la base de datos al crear el CV
      const mockCreatedResume = {
        id: 1,
        candidateId: 1,
        filePath: validCandidatePayload.cv.filePath,
        fileType: validCandidatePayload.cv.fileType,
        uploadDate: new Date(),
      };

      // Configurar los mocks de Prisma
      (prisma.candidate.create as jest.Mock).mockResolvedValue(mockCreatedCandidate);
      (prisma.education.create as jest.Mock).mockResolvedValue(mockCreatedEducation);
      (prisma.workExperience.create as jest.Mock).mockResolvedValue(mockCreatedWorkExperience);
      (prisma.resume.create as jest.Mock).mockResolvedValue(mockCreatedResume);

      // Realizar la llamada HTTP
      const response = await request(app)
        .post('/candidates')
        .send(validCandidatePayload);

      // Verificar el status de la respuesta
      expect(response.status).toBe(201);

      // Verificar que el cuerpo de la respuesta contiene los datos esperados
      expect(response.body).toMatchObject({
        id: mockCreatedCandidate.id,
        firstName: validCandidatePayload.firstName,
        lastName: validCandidatePayload.lastName,
        email: validCandidatePayload.email,
      });

      // Verificar que prisma.candidate.create fue llamado una vez
      expect(prisma.candidate.create).toHaveBeenCalledTimes(1);

      // Verificar que prisma.candidate.create fue llamado con los datos correctos
      expect(prisma.candidate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            firstName: validCandidatePayload.firstName,
            lastName: validCandidatePayload.lastName,
            email: validCandidatePayload.email,
          }),
        })
      );

      // Verificar que se crearon las entidades relacionadas
      expect(prisma.education.create).toHaveBeenCalledTimes(1);
      expect(prisma.workExperience.create).toHaveBeenCalledTimes(1);
      expect(prisma.resume.create).toHaveBeenCalledTimes(1);
    });

    it.todo('debería crear un candidato con datos mínimos (sin educations, workExperiences ni cv)');
  });

  describe('Validación de datos', () => {
    it.todo('debería devolver error 400 si falta el campo firstName');

    it.todo('debería devolver error 400 si falta el campo lastName');

    it.todo('debería devolver error 400 si falta el campo email');

    it.todo('debería devolver error 400 si el email tiene formato inválido');
  });

  describe('Manejo de errores de base de datos', () => {
    it.todo('debería devolver error 400 si el email ya existe (constraint único)');

    it.todo('debería manejar errores de conexión a la base de datos');
  });
});

