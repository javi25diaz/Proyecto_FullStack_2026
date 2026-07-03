# PROJECT STATE REPORT
**Proyecto Full Stack 2026 — Grupo 3**  
**Fecha de auditoría:** 2026-07-01  
**Auditor:** Senior Software Architect / Code Auditor  
**Alcance:** Inspección completa del código fuente existente. Sin modificaciones ni recomendaciones de diseño.

---

## Resumen Ejecutivo

El proyecto es una aplicación web Full Stack del tipo SPA + REST API, construida sobre el stack MEAN (MongoDB, Express, Angular, Node.js). Implementa un sistema de autenticación con JWT y refresh tokens, gestión básica de usuarios con roles, y protección de rutas en el frontend. El estado actual corresponde a un **MVP funcional de autenticación**, sin funcionalidades de negocio adicionales implementadas más allá del login y listado de usuarios. El dashboard existe como componente vacío. No existen GitHub Actions, Docker, ni configuraciones de CI/CD. El proyecto no tiene un `package.json` raíz unificado; frontend y backend son proyectos Node independientes dentro del mismo repositorio.

**Métricas del proyecto:**
- Archivos fuente TypeScript/JavaScript: 26 archivos
- Líneas de código estimadas: ~460 líneas
- Archivos de configuración: 8 archivos
- Archivos de tests: 6 archivos (`.spec.ts`)
- Carpetas principales: 2 (`frontend/`, `proyecto01_backend/`)

---

## Tecnologías detectadas

### Backend
| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | (runtime del sistema) | Entorno de ejecución |
| Express.js | ^5.2.1 | Framework HTTP / API REST |
| Mongoose | ^9.5.0 | ODM para MongoDB |
| MongoDB | Local / Atlas | Motor de base de datos |
| bcryptjs | ^3.0.3 | Hash de contraseñas |
| jsonwebtoken | ^9.0.3 | Generación y verificación de JWT |
| cors | ^2.8.6 | Middleware CORS |
| helmet | ^8.2.0 | Cabeceras de seguridad HTTP |
| morgan | ^1.10.1 | Logging de peticiones HTTP |
| dotenv | ^17.4.2 | Gestión de variables de entorno |
| nodemon | ^3.1.14 (dev) | Auto-reload en desarrollo |

### Frontend
| Tecnología | Versión | Rol |
|---|---|---|
| Angular | ^19.2.0 | Framework SPA (Standalone Components) |
| TypeScript | ~5.7.2 | Lenguaje principal |
| RxJS | ~7.8.0 | Programación reactiva / Observables |
| Angular Router | ^19.2.0 | Navegación SPA |
| Angular Reactive Forms | ^19.2.0 | Formularios reactivos |
| Angular HttpClient | ^19.2.0 | Cliente HTTP |
| zone.js | ~0.15.0 | Gestión de zonas Angular |
| Karma | ~6.4.0 (dev) | Test runner |
| Jasmine | ~5.6.0 (dev) | Framework de tests |
| Angular CLI | ^19.2.27 (dev) | Herramienta de build |

### Sistema de módulos
| Componente | Sistema |
|---|---|
| Backend | CommonJS (`require` / `module.exports`) |
| Frontend | ES Modules (ESM) |

---

## Arquitectura

### Patrón general
**Backend**: MVC (Model-View-Controller) sin capa View, solo API REST.  
**Frontend**: Feature-based Architecture con Standalone Components (Angular 19).  
**Comunicación**: HTTP/REST. El frontend consume la API del backend mediante `HttpClient`.  
**Autenticación**: JWT stateless con Access Token de vida corta (1 minuto) y Refresh Token almacenado en base de datos (7 días).

### Diagrama de capas (textual)

```
[Usuario]
    │
    ▼
[Angular SPA — frontend/ — puerto 4200]
    │  Reactive Forms, Router, Guards, Interceptors
    │  localStorage: accessToken, refreshToken, user
    │
    │  HTTP REST requests
    │  Authorization: Bearer <token>
    ▼
[Express API — proyecto01_backend/ — puerto 4000]
    │  Middlewares globales: helmet, cors, morgan, express.json
    │  Rutas: /api/auth, /api/usuarios
    │  Middleware auth: verificarToken (JWT)
    │  Controladores: authController, usuarioController
    │
    ▼
[MongoDB — puerto 27017]
    │  Colecciones: usuarios, refreshtokens
    │  Mongoose ODM
```

### Comunicación frontend ↔ backend
- URL base configurada en `frontend/src/environments/environment.ts` como `http://localhost:4000/api`
- El `AuthInterceptor` agrega automáticamente el header `Authorization: Bearer <token>` a todas las peticiones HTTP salientes
- El interceptor detecta errores 401 pero actualmente solo los loguea en consola sin ejecutar refresh automático

---

## Árbol del proyecto

```
c:\Users\jaer2\Proyecto_FullStack_2026_03\
│
├── PROJECT_STATE_REPORT.md              ← Este archivo
│
├── frontend/                            [Angular 19.2 SPA]
│   ├── .angular/                        [Caché de build Angular — excluido de git]
│   ├── .vscode/
│   │   ├── extensions.json              [Recomienda extensión Angular]
│   │   ├── launch.json                  [Configuración de debug]
│   │   └── tasks.json                   [Tareas build y test]
│   ├── node_modules/                    [Dependencias — excluido de git]
│   ├── public/                          [Activos estáticos — vacío actualmente]
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts         [Componente raíz]
│   │   │   ├── app.component.html       [Template raíz — solo <router-outlet>]
│   │   │   ├── app.component.css        [Estilos raíz — vacío]
│   │   │   ├── app.component.spec.ts    [Test del componente raíz]
│   │   │   ├── app.config.ts            [Configuración providers Angular]
│   │   │   ├── app.routes.ts            [Definición de rutas]
│   │   │   │
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts    [Guard de autenticación]
│   │   │   │   │   └── auth.guard.spec.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.ts  [Interceptor HTTP — agrega JWT]
│   │   │   │   │   └── auth.interceptor.spec.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts  [Servicio de autenticación]
│   │   │   │       └── auth.service.spec.ts
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   └── login/
│   │   │   │   │       ├── login.component.ts    [Formulario de login]
│   │   │   │   │       ├── login.component.html  [Template login]
│   │   │   │   │       ├── login.component.css   [Estilos — vacío]
│   │   │   │   │       └── login.component.spec.ts
│   │   │   │   └── dashboard/
│   │   │   │       ├── dashboard.component.ts    [Componente dashboard]
│   │   │   │       ├── dashboard.component.html  [Template básico]
│   │   │   │       ├── dashboard.component.css   [Estilos — vacío]
│   │   │   │       └── dashboard.component.spec.ts
│   │   │   │
│   │   │   └── shared/
│   │   │       └── interfaces/
│   │   │           └── auth-response.interface.ts  [Interfaz AuthResponse]
│   │   │
│   │   ├── environments/
│   │   │   └── environment.ts           [URL base del API]
│   │   ├── index.html                   [HTML raíz de la SPA]
│   │   ├── main.ts                      [Bootstrap de Angular]
│   │   └── styles.css                   [Estilos globales — vacío]
│   │
│   ├── .gitignore
│   ├── README.md
│   ├── angular.json                     [Configuración Angular CLI]
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── tsconfig.spec.json
│
└── proyecto01_backend/                  [Express + MongoDB API]
    ├── src/
    │   ├── config/
    │   │   └── db.js                    [Conexión a MongoDB]
    │   ├── controllers/
    │   │   ├── authController.js        [Lógica de login y refresh token]
    │   │   └── usuarioController.js     [Lógica CRUD de usuarios]
    │   ├── middlewares/
    │   │   └── authMiddleware.js        [Verificación de JWT]
    │   ├── models/
    │   │   ├── Usuario.js               [Esquema Mongoose de usuario]
    │   │   └── RefreshToken.js          [Esquema Mongoose de refresh token]
    │   └── routes/
    │       ├── authRoutes.js            [Rutas /api/auth]
    │       └── usuarioRoutes.js         [Rutas /api/usuarios]
    ├── .env                             [Variables de entorno — NO en git]
    ├── .gitignore
    ├── index.js                         [Punto de entrada del servidor]
    ├── package.json
    └── package-lock.json
```

---

## Frontend

### Tecnología
Angular 19.2 con arquitectura **Standalone Components** (sin NgModules).

### Estructura de capas

| Capa | Carpeta | Contenido |
|---|---|---|
| Core | `src/app/core/` | Guard, Interceptor, AuthService — singletons |
| Features | `src/app/features/` | LoginComponent, DashboardComponent |
| Shared | `src/app/shared/interfaces/` | Interfaz `AuthResponse` |
| Config | `src/app/app.config.ts` | Providers globales |
| Routing | `src/app/app.routes.ts` | Definición de rutas |
| Environments | `src/environments/` | URL base del API |

### Rutas configuradas

| Ruta | Componente | Guard | Observaciones |
|---|---|---|---|
| `''` | — | — | Redirige a `/login` |
| `/login` | `LoginComponent` | Ninguno | Acceso público |
| `/dashboard` | `DashboardComponent` | `authGuard` | Protegida |

### Componentes

#### `AppComponent`
- Componente raíz.
- Template contiene únicamente `<router-outlet>`.
- CSS vacío.

#### `LoginComponent`
- Formulario reactivo con `FormBuilder`.
- Campos: `email` (required, formato email) y `password` (required).
- Al submit: llama `AuthService.login()`, guarda sesión y navega a `/dashboard`.
- Incluye `console.log` para depuración.
- CSS vacío.

#### `DashboardComponent`
- Componente con template mínimo.
- Muestra el texto `"Dashboard works! Of CRM"` y un mensaje de bienvenida.
- Sin lógica de negocio implementada.
- CSS vacío.

### Servicios

#### `AuthService` (`core/services/auth.service.ts`)
| Método | Descripción |
|---|---|
| `login(email, password)` | POST a `/auth/login` |
| `saveSession(response)` | Guarda tokens y usuario en `localStorage` |
| `getAccessToken()` | Lee `accessToken` de `localStorage` |
| `getRefreshToken()` | Lee `refreshToken` de `localStorage` |
| `getUser()` | Lee y parsea `user` de `localStorage` |
| `isAuthenticated()` | Retorna `true` si hay `accessToken` |
| `updateAccessToken(token)` | Actualiza `accessToken` en `localStorage` |
| `refreshAccessToken()` | POST a `/auth/refresh-token` |
| `logout()` | Limpia `localStorage` |

**Almacenamiento de sesión:** `localStorage` (claves: `accessToken`, `refreshToken`, `user`).

### Guard

#### `AuthGuard` (`core/guards/auth.guard.ts`)
- Verifica `AuthService.isAuthenticated()`.
- Si autenticado: permite el acceso.
- Si no autenticado: redirige a `/login`.

### Interceptor

#### `AuthInterceptor` (`core/interceptors/auth.interceptor.ts`)
- Agrega el header `Authorization: Bearer <accessToken>` a todas las peticiones HTTP salientes.
- Detecta respuestas con error 401.
- Al detectar 401: solo ejecuta `console.log('Interceptor detectó un 401 Unauthorized')` y re-lanza el error.
- **No implementa lógica de refresh token automático** ante errores 401.

### Interfaz compartida

#### `AuthResponse` (`shared/interfaces/auth-response.interface.ts`)
Describe la estructura de la respuesta del endpoint `/api/auth/login`:
- `accessToken`: string
- `refreshToken`: string
- `usuario`: objeto con datos del usuario (sin contraseña)

### Configuración TypeScript
- Target: ES2022
- Modo strict activado completamente
- `strictTemplates: true` en el compilador Angular
- `noImplicitAny`, `noImplicitReturns`, `noFallthroughCasesInSwitch`: true

### Build
- Output de producción: `dist/frontend`
- Budget (producción): inicial 500kB, máximo 1MB
- Budget por componente: máximo 4kB de estilos

---

## Backend

### Tecnología
Express.js 5.2 sobre Node.js. Sistema de módulos: CommonJS. Sin TypeScript.

### Punto de entrada: `index.js`

```
Carga dotenv → Inicializa Express → Conecta MongoDB → 
Aplica middlewares globales (helmet, cors, morgan, express.json) → 
Registra rutas → Levanta servidor en puerto PORT || 3000
```

**Nota:** El archivo `.env` define `PORT=4000`, pero el fallback en `index.js` es `3000`. El servidor corre efectivamente en `4000`.

### Middlewares globales (orden de aplicación)
1. `helmet()` — Cabeceras de seguridad HTTP
2. `cors()` — Permite cualquier origen (configuración abierta, sin restricciones de origen)
3. `morgan('dev')` — Log de peticiones en consola
4. `express.json()` — Parseo de body JSON

### Controladores

#### `authController.js`

**`login(req, res)`**
1. Valida presencia de `email` y `password` en el body.
2. Busca usuario en BD por email.
3. Verifica que el usuario existe y que `activo === true`.
4. Compara password con hash usando `bcrypt.compare` (método `compararPassword`).
5. Genera `accessToken` (firmado con `JWT_SECRET`, expira en `JWT_EXPIRES_IN` = 1 minuto).
6. Genera `refreshToken` (firmado con `JWT_REFRESH_SECRET`, expira en `JWT_REFRESH_EXPIRES_IN` = 7 días).
7. Persiste el refresh token en la colección `RefreshToken` con su fecha de expiración.
8. Retorna JSON con `{ accessToken, refreshToken, usuario (sin password) }`.

**`renovarAccessToken(req, res)`**
1. Valida presencia de `refreshToken` en el body.
2. Verifica firma del token con `JWT_REFRESH_SECRET`.
3. Busca el token en la colección `RefreshToken` en BD.
4. Verifica que el usuario asociado existe y que `activo === true`.
5. Genera un nuevo `accessToken`.
6. Retorna `{ accessToken }`.

#### `usuarioController.js`

**`crearUsuario(req, res)`**
- Crea un nuevo documento `Usuario` con los datos del body (`nombre`, `email`, `password`, `rol`).
- Guarda en BD. El pre-save hook hashea la contraseña automáticamente.
- Retorna el usuario creado. **Observación: la respuesta incluye el campo `password` (hasheado).**

**`obtenerUsuarios(req, res)`**
- Consulta todos los usuarios con `.select('-password')`.
- Retorna el array de usuarios sin campo `password`.

### Middlewares propios

#### `authMiddleware.js` — `verificarToken(req, res, next)`
1. Lee el header `Authorization`.
2. Valida que exista y tenga el formato `Bearer <TOKEN>`.
3. Extrae el token.
4. Verifica la firma con `JWT_SECRET`.
5. Si el token expiró: retorna `401` con mensaje `"Token expirado"`.
6. Si el token es inválido: retorna `401` con mensaje `"Token no válido"`.
7. Si es válido: guarda el payload decodificado en `req.usuario` y llama `next()`.

### Modelos / Esquemas Mongoose

#### `Usuario` (`src/models/Usuario.js`)

| Campo | Tipo | Requerido | Único | Validaciones | Default |
|---|---|---|---|---|---|
| `nombre` | String | Sí | No | trim | — |
| `email` | String | Sí | Sí | lowercase | — |
| `password` | String | Sí | No | — | — |
| `rol` | String | No | No | enum: ['admin','user'] | `'user'` |
| `activo` | Boolean | No | No | — | `true` |
| `createdAt` | Date | — | — | timestamps | auto |
| `updatedAt` | Date | — | — | timestamps | auto |

**Pre-save hook:** Si `password` fue modificado, genera salt de 10 rondas y hashea con `bcrypt`.  
**Método de instancia:** `compararPassword(passwordCandidato)` — retorna comparación bcrypt asíncrona.

#### `RefreshToken` (`src/models/RefreshToken.js`)

| Campo | Tipo | Requerido | Referencia |
|---|---|---|---|
| `token` | String | Sí | — |
| `usuario` | ObjectId | Sí | Ref: `'Usuario'` |
| `expiresAt` | Date | Sí | — |
| `createdAt` | Date | — | timestamps auto |
| `updatedAt` | Date | — | timestamps auto |

### Configuración de conexión DB (`src/config/db.js`)
- Usa `mongoose.connect(process.env.MONGO_URI)`.
- En caso de error: imprime el error y ejecuta `process.exit(1)`.
- Sin opciones adicionales de conexión (sin pool size, sin timeouts explícitos).

---

## Base de datos

### Motor
**MongoDB** — Versión no especificada en configuración. Se conecta mediante Mongoose 9.5.0.

### Instancia
- Configurada en variable `MONGO_URI`.
- Valor actual en `.env`: `mongodb://127.0.0.1:27017/bd_means_demo` (instancia local).

### Base de datos
Nombre: `bd_means_demo`

### Colecciones (inferidas de los modelos Mongoose)

| Colección (Mongoose → MongoDB) | Modelo | Descripción |
|---|---|---|
| `usuarios` | `Usuario` | Usuarios del sistema |
| `refreshtokens` | `RefreshToken` | Tokens de refresco activos |

### Relaciones
- `RefreshToken.usuario` → `ObjectId` referencia a `Usuario._id` (relación 1:N, un usuario puede tener múltiples refresh tokens).
- No se utiliza populate en ningún controlador actualmente.

### Índices detectados
- `email` en `Usuario`: declarado como `unique: true` (Mongoose crea índice único automáticamente).
- No se declaran índices adicionales explícitos en los esquemas.

### Operaciones utilizadas
| Operación Mongoose | Método | Controlador |
|---|---|---|
| Buscar usuario por email | `Usuario.findOne({ email })` | authController |
| Crear usuario | `new Usuario(data).save()` | usuarioController |
| Listar usuarios | `Usuario.find().select('-password')` | usuarioController |
| Guardar refresh token | `new RefreshToken(data).save()` | authController |
| Buscar refresh token | `RefreshToken.findOne({ token })` | authController |
| Buscar usuario por ID | `Usuario.findById(id)` | authController |

---

## API

### Base URL
`http://localhost:4000/api`

### Endpoints

#### Módulo de Autenticación — `/api/auth`

| Método | Endpoint | Descripción | Auth requerida | Body requerido | Respuesta exitosa |
|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | Inicio de sesión | No | `{ email, password }` | `200` `{ accessToken, refreshToken, usuario }` |
| `POST` | `/api/auth/refresh-token` | Renovar access token | No | `{ refreshToken }` | `200` `{ accessToken }` |

**Errores conocidos de `/api/auth/login`:**
- `400` — Faltan email o password
- `400` — Usuario no encontrado
- `403` — Usuario inactivo
- `401` — Contraseña incorrecta
- `500` — Error interno del servidor

**Errores conocidos de `/api/auth/refresh-token`:**
- `400` — Falta refreshToken
- `403` — Token expirado / inválido
- `404` — Token no encontrado en BD
- `403` — Usuario inactivo o no encontrado
- `500` — Error interno

#### Módulo de Usuarios — `/api/usuarios`

| Método | Endpoint | Descripción | Auth requerida | Body requerido | Respuesta exitosa |
|---|---|---|---|---|---|
| `POST` | `/api/usuarios` | Crear nuevo usuario | No | `{ nombre, email, password, rol? }` | `201` `{ usuario creado con password hasheado }` |
| `GET` | `/api/usuarios` | Listar todos los usuarios | Sí (`verificarToken`) | — | `200` `[ ...usuarios sin password ]` |

**Errores conocidos de `POST /api/usuarios`:**
- `400` — Email duplicado (índice único MongoDB)
- `500` — Error interno

**Errores conocidos de `GET /api/usuarios`:**
- `401` — Sin token o token inválido
- `401` — Token expirado
- `500` — Error interno

#### Ruta raíz
| Método | Endpoint | Descripción | Auth | Respuesta |
|---|---|---|---|---|
| `GET` | `/` | Health check | No | `200` `"Servidor funcionando 🚀"` |

---

## Autenticación

### Tipo
JWT (JSON Web Token) con doble token: Access Token + Refresh Token.

### Access Token
| Propiedad | Valor |
|---|---|
| Algoritmo | HS256 (default de jsonwebtoken) |
| Secreto | `JWT_SECRET` (env) |
| Duración | `JWT_EXPIRES_IN` = 1 minuto |
| Payload | `{ id: usuario._id, rol: usuario.rol }` (inferido) |
| Almacenamiento (cliente) | `localStorage` bajo clave `accessToken` |
| Envío | Header `Authorization: Bearer <token>` |

### Refresh Token
| Propiedad | Valor |
|---|---|
| Algoritmo | HS256 |
| Secreto | `JWT_REFRESH_SECRET` (env) |
| Duración | `JWT_REFRESH_EXPIRES_IN` = 7 días |
| Almacenamiento (servidor) | Colección MongoDB `refreshtokens` |
| Almacenamiento (cliente) | `localStorage` bajo clave `refreshToken` |
| Revocación | No implementada (no hay endpoint de logout que elimine el token de BD) |

### Flujo de autenticación

```
1. POST /api/auth/login { email, password }
   → Servidor verifica credenciales
   → Genera accessToken (1m) + refreshToken (7d)
   → Guarda refreshToken en BD
   → Retorna ambos tokens + datos de usuario

2. Todas las requests protegidas:
   → Interceptor Angular agrega Authorization: Bearer <accessToken>
   → Middleware verificarToken valida la firma JWT

3. Cuando accessToken expira (1 minuto):
   → Servidor retorna 401
   → Interceptor detecta el 401 (solo lo loguea, NO hace refresh automático)
   → El flujo de refresh automático NO está implementado en el interceptor

4. Refresh manual: POST /api/auth/refresh-token { refreshToken }
   → Servidor verifica refreshToken
   → Genera nuevo accessToken
   → Retorna nuevo accessToken
```

### Logout
- `AuthService.logout()` limpia `localStorage`.
- El refresh token **no se elimina de la base de datos** al hacer logout.

---

## Variables de entorno

### Backend — `proyecto01_backend/.env`

| Variable | Valor en .env | Propósito | Obligatoria | Usada en |
|---|---|---|---|---|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/bd_means_demo` | Cadena de conexión a MongoDB | Sí | `src/config/db.js` |
| `PORT` | `4000` | Puerto del servidor Express | No (fallback: 3000) | `index.js` |
| `JWT_SECRET` | `clave_access_token_2026` | Firma del Access Token | Sí | `src/controllers/authController.js`, `src/middlewares/authMiddleware.js` |
| `JWT_REFRESH_SECRET` | `clave_refresh_token_2026` | Firma del Refresh Token | Sí | `src/controllers/authController.js` |
| `JWT_EXPIRES_IN` | `1m` | Duración del Access Token | No (podría ser hardcodeado) | `src/controllers/authController.js` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Duración del Refresh Token | No (podría ser hardcodeado) | `src/controllers/authController.js` |

**Observación:** El archivo `.env` contiene secretos reales (`clave_access_token_2026`, `clave_refresh_token_2026`). El `.gitignore` del backend incluye `.env`, por lo que no debería estar en el repositorio git. No se detectó un archivo `.env.example` para documentar las variables necesarias.

### Frontend — `frontend/src/environments/environment.ts`

| Variable | Valor | Propósito | Obligatoria | Usada en |
|---|---|---|---|---|
| `environment.production` | `false` | Flag de entorno | Sí | Configuración Angular |
| `environment.apiUrl` | `http://localhost:4000/api` | URL base del API backend | Sí | `auth.service.ts` |

**Observación:** Solo existe `environment.ts` (desarrollo). No existe `environment.prod.ts` para un entorno de producción separado. En producción, la URL del API apuntaría incorrectamente a `localhost`.

---

## Dependencias

### Backend — `proyecto01_backend/package.json`
```json
{
  "name": "proyecto01_backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "helmet": "^8.2.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.5.0",
    "morgan": "^1.10.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

### Frontend — `frontend/package.json`
```json
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/common": "^19.2.0",
    "@angular/compiler": "^19.2.0",
    "@angular/core": "^19.2.0",
    "@angular/forms": "^19.2.0",
    "@angular/platform-browser": "^19.2.0",
    "@angular/platform-browser-dynamic": "^19.2.0",
    "@angular/router": "^19.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.2.27",
    "@angular/cli": "^19.2.27",
    "@angular/compiler-cli": "^19.2.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.6.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.7.2"
  }
}
```

### Dependencias no instaladas / ausentes detectadas
- No se detecta ninguna dependencia faltante para las funcionalidades actuales.
- No existe un `package.json` raíz unificado en `Proyecto_FullStack_2026_03/`.
- No existe gestor de monorepo (Nx, Turborepo, Lerna, npm workspaces).

---

## Inventario de funcionalidades

### 1. Autenticación — Login
| Atributo | Detalle |
|---|---|
| Qué hace | Permite al usuario autenticarse con email y password |
| Frontend | `LoginComponent`, `AuthService.login()`, `AuthService.saveSession()` |
| Backend | `POST /api/auth/login`, `authController.login()` |
| Archivos participantes | `login.component.ts`, `login.component.html`, `auth.service.ts`, `authController.js`, `authRoutes.js`, `authMiddleware.js`, `Usuario.js`, `RefreshToken.js` |
| Estado | **Completa** |
| Dependencias | MongoDB activo, variables de entorno JWT configuradas |

### 2. Autenticación — Renovación de Token
| Atributo | Detalle |
|---|---|
| Qué hace | Renueva el access token usando el refresh token |
| Frontend | `AuthService.refreshAccessToken()` — existe el método pero NO se invoca automáticamente ante 401 |
| Backend | `POST /api/auth/refresh-token`, `authController.renovarAccessToken()` |
| Archivos participantes | `auth.service.ts`, `auth.interceptor.ts`, `authController.js`, `authRoutes.js`, `RefreshToken.js` |
| Estado | **Parcial** — Backend completo; Frontend tiene el método pero el interceptor no lo llama automáticamente |

### 3. Autenticación — Logout
| Atributo | Detalle |
|---|---|
| Qué hace | Cierra la sesión del usuario |
| Frontend | `AuthService.logout()` — limpia localStorage |
| Backend | Sin endpoint de logout. El refresh token persiste en BD |
| Archivos participantes | `auth.service.ts` |
| Estado | **Parcial** — Solo limpia el cliente. No invalida el token en servidor |

### 4. Protección de rutas — Auth Guard
| Atributo | Detalle |
|---|---|
| Qué hace | Protege la ruta `/dashboard` redirigiendo a `/login` si no hay sesión |
| Frontend | `authGuard`, `app.routes.ts` |
| Archivos participantes | `auth.guard.ts`, `app.routes.ts` |
| Estado | **Completa** |

### 5. Inyección automática de token — HTTP Interceptor
| Atributo | Detalle |
|---|---|
| Qué hace | Agrega el header Authorization a todas las peticiones HTTP |
| Frontend | `AuthInterceptor` |
| Archivos participantes | `auth.interceptor.ts`, `app.config.ts` |
| Estado | **Completa** para la inyección del token. **Incompleta** para el manejo de 401 y refresh automático |

### 6. Gestión de usuarios — Crear usuario
| Atributo | Detalle |
|---|---|
| Qué hace | Crea un nuevo usuario en la base de datos |
| Backend | `POST /api/usuarios`, `usuarioController.crearUsuario()` |
| Frontend | Sin UI implementada para esta funcionalidad |
| Archivos participantes | `usuarioController.js`, `usuarioRoutes.js`, `Usuario.js` |
| Estado | **Backend completo, Frontend ausente** |

### 7. Gestión de usuarios — Listar usuarios
| Atributo | Detalle |
|---|---|
| Qué hace | Retorna todos los usuarios (sin contraseña) para usuarios autenticados |
| Backend | `GET /api/usuarios`, `usuarioController.obtenerUsuarios()` |
| Frontend | Sin UI implementada para esta funcionalidad |
| Archivos participantes | `usuarioController.js`, `usuarioRoutes.js`, `Usuario.js`, `authMiddleware.js` |
| Estado | **Backend completo, Frontend ausente** |

### 8. Dashboard
| Atributo | Detalle |
|---|---|
| Qué hace | Página principal post-login |
| Frontend | `DashboardComponent` |
| Archivos participantes | `dashboard.component.ts`, `dashboard.component.html` |
| Estado | **Esqueleto únicamente** — sin contenido ni funcionalidades de negocio |

---

## Estado actual del proyecto

### Módulos y su estado

| Módulo | Existe | Estado |
|---|---|---|
| Servidor Express (backend) | Sí | Completo para el scope actual |
| Conexión MongoDB | Sí | Completo |
| Modelo Usuario | Sí | Completo |
| Modelo RefreshToken | Sí | Completo |
| Autenticación (login) | Sí | Completo |
| Refresh de token (backend) | Sí | Completo |
| Refresh automático (frontend interceptor) | Sí (parcial) | Incompleto |
| Logout en servidor | No | Ausente |
| Auth Guard | Sí | Completo |
| HTTP Interceptor | Sí | Parcialmente completo |
| Login UI | Sí | Completo |
| Dashboard UI | Sí (esqueleto) | Incompleto — sin contenido |
| Gestión de usuarios (backend) | Sí | Completo |
| Gestión de usuarios (frontend) | No | Ausente |
| Tests unitarios | Sí (skeletons) | Básicos — solo verifican instanciación |
| CI/CD | No | Ausente |
| Docker | No | Ausente |
| Documentación API (Swagger) | No | Ausente |
| Environment producción frontend | No | Ausente |
| .env.example | No | Ausente |

### Código comentado
No se detectó código comentado relevante en ningún archivo fuente.

### TODOs / FIXMEs
No se encontraron marcadores `TODO`, `FIXME`, `HACK`, `NOTE` ni similares en el código fuente.

### Archivos vacíos (solo estructura, sin contenido funcional)
| Archivo | Observación |
|---|---|
| `frontend/src/styles.css` | Vacío — estilos globales no implementados |
| `frontend/src/app/app.component.css` | Vacío |
| `frontend/src/app/features/auth/login/login.component.css` | Vacío |
| `frontend/src/app/features/dashboard/dashboard.component.css` | Vacío |
| `frontend/public/` | Carpeta vacía |

### Archivos de test (`.spec.ts`)
Los 6 archivos de test existen pero son los generados por el Angular CLI sin lógica de test adicional. Verifican únicamente que los componentes/servicios se instancian sin errores.

| Archivo | Estado |
|---|---|
| `app.component.spec.ts` | Skeleton generado por CLI |
| `auth.service.spec.ts` | Skeleton generado por CLI |
| `auth.guard.spec.ts` | Skeleton generado por CLI |
| `auth.interceptor.spec.ts` | Skeleton generado por CLI |
| `login.component.spec.ts` | Skeleton generado por CLI |
| `dashboard.component.spec.ts` | Skeleton generado por CLI |

---

## Riesgos técnicos detectados

### Seguridad

| # | Riesgo | Severidad | Ubicación |
|---|---|---|---|
| 1 | El archivo `.env` contiene secretos con valores débiles y predecibles (`clave_access_token_2026`, `clave_refresh_token_2026`) | Alta | `proyecto01_backend/.env` |
| 2 | No existe archivo `.env.example`. Si `.env` se sube a git por error, los secretos quedan expuestos | Alta | `proyecto01_backend/` |
| 3 | `CORS` configurado sin restricción de origen (`cors()` sin opciones) — acepta requests de cualquier dominio | Media | `index.js` |
| 4 | `POST /api/usuarios` no requiere autenticación — cualquiera puede crear usuarios | Media | `usuarioRoutes.js`, `usuarioController.js` |
| 5 | La respuesta de `crearUsuario` incluye el campo `password` (aunque hasheado) | Baja | `usuarioController.js` |
| 6 | `AuthService.logout()` no elimina el refresh token de la base de datos, dejando tokens huérfanos válidos por 7 días | Media | `auth.service.ts`, sin endpoint de logout en backend |
| 7 | Access token con expiración de 1 minuto puede causar problemas UX al no implementar el refresh automático | Media | `auth.interceptor.ts` |
| 8 | Sesión almacenada completamente en `localStorage` (vulnerable a XSS) | Media | `auth.service.ts` |
| 9 | No hay rate limiting en ningún endpoint | Media | `index.js` |
| 10 | No hay validación de esquema en el backend (no se usa Joi, Zod, express-validator ni validación de tipos) | Media | Todos los controladores |

### Configuración / Entorno

| # | Riesgo | Severidad | Ubicación |
|---|---|---|---|
| 11 | No existe `environment.prod.ts` en el frontend — en producción la `apiUrl` apuntaría a `localhost:4000` | Alta | `frontend/src/environments/` |
| 12 | `MONGO_URI` apunta a instancia local (`127.0.0.1:27017`) — no funciona en producción sin configuración adicional | Alta | `proyecto01_backend/.env` |
| 13 | El interceptor detecta 401 pero no ejecuta refresh automático — el usuario queda bloqueado al expirar el token (1 min) sin poder recuperar la sesión automáticamente | Alta | `auth.interceptor.ts` |
| 14 | Express 5 (`^5.2.1`) es una versión mayor reciente con cambios de API respecto a Express 4 — algunos tutoriales y ejemplos pueden no ser compatibles | Baja | `proyecto01_backend/package.json` |

### Funcionalidades ausentes

| # | Observación | Ubicación |
|---|---|---|
| 15 | No existe lógica de negocio en el Dashboard — es un componente vacío | `dashboard.component.ts` |
| 16 | No existe UI para crear, editar o eliminar usuarios desde el frontend | `frontend/src/app/features/` |
| 17 | No existe endpoint `DELETE /api/usuarios/:id` ni `PUT /api/usuarios/:id` en el backend | `usuarioRoutes.js` |
| 18 | No existe endpoint de logout en el backend | `authRoutes.js` |
| 19 | No existe mecanismo de recuperación de contraseña | Todo el proyecto |
| 20 | No existe validación de email único antes del error de MongoDB (no hay feedback amigable al usuario por email duplicado) | `usuarioController.js` |

---

## Observaciones

1. **Arquitectura bien estructurada para el alcance del proyecto.** La separación en `core/`, `features/`, `shared/` en el frontend y el patrón MVC en el backend refleja buenas prácticas para un proyecto universitario de este tamaño.

2. **El proyecto tiene dos raíces independientes** (`frontend/` y `proyecto01_backend/`). No hay un `package.json` raíz que unifique los scripts de ambos. Para ejecutar el proyecto completo se deben iniciar ambos procesos de forma independiente.

3. **Express 5** (versión `^5.2.1`) es la versión principal del framework utilizado. Esta es una versión mayor relativamente nueva respecto a Express 4, que introduce cambios como el manejo de errores asíncronos sin necesidad de `try/catch` en algunos casos.

4. **Sin CSS implementado.** Todos los archivos `.css` de los componentes y el archivo `styles.css` global están vacíos. La interfaz visual depende únicamente de los estilos base del navegador.

5. **Sin gestión de estado global.** No existe NgRx, Signals store, ni ningún patrón de state management más allá del `localStorage` y el `AuthService` con inyección de dependencias Angular.

6. **Los tests son únicamente esqueletos.** Ningún test tiene lógica real de prueba. El comando `npm test` compila y ejecuta Karma, pero no verifica funcionalidades.

7. **El backend no tiene tests.** El script `"test"` en `package.json` del backend solo imprime un error: `"no test specified"`.

8. **Sin Docker, GitHub Actions ni CI/CD** de ningún tipo.

9. **Sin documentación de API.** No existe Swagger, OpenAPI, Postman Collection ni ningún formato de documentación de endpoints.

10. **`console.log` en producción.** El `LoginComponent` incluye `console.log` para depuración. El interceptor también usa `console.log` para el error 401. Estos logs quedarían visibles en producción.

11. **El nombre del proyecto en `package.json` del backend** es `"proyecto01_backend"` y en el frontend `"frontend"` — nombres genéricos sin versión específica del curso o grupo.

12. **El `README.md` del frontend** es el generado por defecto por Angular CLI y no describe el proyecto específico.

13. **La duración del access token (1 minuto)** es extremadamente corta para uso en producción, aunque puede ser intencional para demostrar el mecanismo de refresh en el contexto educativo. Sin el refresh automático implementado en el interceptor, el usuario experimentará errores frecuentes.

---

*Reporte generado el 2026-07-01. Basado exclusivamente en inspección del código fuente existente. Sin modificaciones al código. Sin recomendaciones de cambios.*
