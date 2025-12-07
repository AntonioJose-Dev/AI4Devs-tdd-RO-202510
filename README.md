# AI4Devs-tdd-RO-202510

## 📋 Descripción

Ejercicio práctico de **LIDR Academy** que implementa una aplicación full-stack para la gestión de candidatos en procesos de selección. El backend está desarrollado con **Node.js**, **Express** y **TypeScript**, utilizando **Prisma** como ORM y **PostgreSQL** como base de datos. El frontend está construido con **React** y **React Router**, ofreciendo una interfaz moderna para dar de alta candidatos, listarlos y consultar su detalle.

---

## 🛠️ Tecnologías Principales

| Capa | Tecnologías |
|------|-------------|
| **Backend** | Node.js, Express, TypeScript, Prisma, PostgreSQL |
| **Testing Backend** | Jest, Supertest |
| **Frontend** | React, React Router, React Bootstrap, Axios |
| **Testing Frontend** | React Testing Library, Jest |
| **Infraestructura** | Docker, Docker Compose |

---

## 🏗️ Arquitectura y Funcionalidades

### Backend

El backend expone una API REST con los siguientes endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check del servidor |
| `GET` | `/candidates` | Obtiene la lista de todos los candidatos |
| `POST` | `/candidates` | Crea un nuevo candidato |
| `GET` | `/candidates/:id` | Obtiene el detalle de un candidato por ID |
| `POST` | `/upload` | Sube archivos (CVs) |

#### Modelo de Datos (Prisma)

```prisma
model Candidate {
  id                Int               @id @default(autoincrement())
  firstName         String
  lastName          String
  email             String            @unique
  phone             String?
  address           String?
  educations        Education[]
  workExperiences   WorkExperience[]
  resumes           Resume[]
}

model Education {
  id            Int       @id @default(autoincrement())
  institution   String
  title         String
  startDate     DateTime
  endDate       DateTime?
  candidateId   Int
}

model WorkExperience {
  id          Int       @id @default(autoincrement())
  company     String
  position    String
  description String?
  startDate   DateTime
  endDate     DateTime?
  candidateId Int
}

model Resume {
  id          Int       @id @default(autoincrement())
  filePath    String
  fileType    String
  uploadDate  DateTime
  candidateId Int
}
```

### Frontend

El frontend ofrece las siguientes pantallas:

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `RecruiterDashboard` | `/` | Dashboard principal con accesos a las acciones principales |
| `AddCandidateForm` | `/add-candidate` | Formulario para dar de alta un nuevo candidato |
| `CandidateList` | `/candidates` | Listado de todos los candidatos registrados |
| `CandidateDetail` | `/candidates/:id` | Detalle completo de un candidato |

### Tests

#### Backend (Jest + Supertest)

- **`health.test.ts`**: Verifica que el endpoint `/health` responde con status 200 y `{ status: "OK" }`.
- **`candidates.get.test.ts`**: Tests para `GET /candidates` - lista de candidatos y caso de lista vacía.
- **`candidates.getById.test.ts`**: Tests para `GET /candidates/:id` - candidato encontrado, no encontrado (404) y error de BD (500).
- **`candidates.create.test.ts`**: Tests para `POST /candidates` - creación exitosa con datos completos.

#### Frontend (React Testing Library)

- **`AddCandidateForm.test.js`**: 
  - Renderizado correcto del formulario
  - Rellenado de campos
  - Envío exitoso al backend
  - Manejo de errores del servidor
  - Validación de campos obligatorios
  - Validación de formato de email
  - Limpieza de errores al modificar campos

- **`CandidateList.test.js`**:
  - Spinner de carga inicial
  - Renderizado de lista con candidatos
  - Mensaje cuando no hay candidatos
  - Manejo de errores de red
  - Botones de "Ver detalle"

---

## ✅ Requisitos Previos

- **Node.js** v18 o superior (recomendado v20 LTS)
- **Docker** y **Docker Compose**
- **npm** (incluido con Node.js)

---

## 🚀 Cómo Ejecutar la Aplicación

### 1. Levantar la Base de Datos

Primero, crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=lti_db
DB_PORT=5432
```

Luego levanta PostgreSQL con Docker:

```bash
docker-compose up -d
```

### 2. Configurar y Ejecutar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/lti_db?schema=public"
```

Ejecuta las migraciones de Prisma y arranca el servidor:

```bash
npx prisma migrate dev
npx prisma generate
npm run build
npm start
```

El backend estará disponible en: **http://localhost:3010**

### 3. Ejecutar el Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm start
```

El frontend estará disponible en: **http://localhost:3000**

### URLs Principales

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3010 |
| Health Check | http://localhost:3010/health |

---

## 🧪 Cómo Ejecutar los Tests

### Tests del Backend

```bash
cd backend
npm test
```

Para ejecutar en modo watch:

```bash
npm run test:watch
```

Para ver el reporte de cobertura:

```bash
npm run test:coverage
```

### Tests del Frontend

```bash
cd frontend
npm test -- --watchAll=false
```

Para modo interactivo:

```bash
npm test
```

---

## 💡 Detalles de Implementación Interesantes

### Enfoque TDD en el Backend

Los tests del backend fueron desarrollados siguiendo el enfoque **Test-Driven Development (TDD)**:

1. Se escribieron primero los tests con Supertest para cada endpoint.
2. Se utilizaron mocks de Prisma para aislar los tests de la base de datos real.
3. Los tests verifican tanto los casos de éxito como los de error (404, 500).

### Tests de Frontend

Se implementaron tests unitarios para los componentes principales usando React Testing Library:

- **Mocks de servicios**: Se mockean las llamadas al backend para tests aislados.
- **Mocks de react-router-dom**: Para probar la navegación.
- **Simulación de interacciones**: Uso de `userEvent` y `fireEvent` para simular acciones del usuario.

### Mejoras de UX Implementadas

- **Loader animado**: Componente `Loader` con animación SVG mientras se cargan los datos.
- **Validación amigable**: Mensajes de error claros para campos obligatorios y formato de email.
- **Redirección tras alta**: Tras crear un candidato exitosamente, se muestra mensaje de éxito.
- **Estilo unificado**: Uso de `SharedStyles.css` para mantener consistencia visual entre pantallas.
- **Estados de carga y error**: Spinners durante la carga y alertas descriptivas en caso de error.

---

## 🔮 Posibles Mejoras Futuras

- **Edición de candidatos**: Endpoint `PUT /candidates/:id` y formulario de edición.
- **Eliminación de candidatos**: Endpoint `DELETE /candidates/:id` con confirmación.
- **Paginación en el listado**: Para manejar grandes volúmenes de candidatos.
- **Filtros de búsqueda**: Por nombre, email, o rango de fechas.
- **Gestión de CVs**: Visualización y descarga de los archivos subidos.
- **Autenticación**: Sistema de login para reclutadores.

---

## 📁 Estructura del Proyecto

```
AI4Devs-tdd-RO-202510/
├── backend/
│   ├── src/
│   │   ├── application/services/     # Lógica de negocio
│   │   ├── domain/models/            # Modelos de dominio
│   │   ├── infrastructure/           # Cliente Prisma
│   │   ├── presentation/controllers/ # Controladores
│   │   ├── routes/                   # Definición de rutas
│   │   └── index.ts                  # Entry point
│   ├── tests/                        # Tests del backend
│   ├── prisma/                       # Schema y migraciones
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── services/                 # Servicios de API
│   │   └── App.tsx                   # Componente principal
│   └── package.json
├── docker-compose.yml                # Configuración de PostgreSQL
└── README.md
```

---

## 📝 Licencia

Este proyecto es un ejercicio educativo de LIDR Academy.
