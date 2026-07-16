# 🚀 Getting Started - Player Performance Explorer

¡Bienvenido! Aquí está el plan para poner en marcha tu aplicación.

## Paso 1: Configurar la Base de Datos PostgreSQL

### 1.1 Crear la base de datos
Abre PowerShell o tu terminal preferida y ejecuta:

```bash
createdb worldcup
```

### 1.2 Conectarse a la base de datos
```bash
psql -h localhost -U postgres -d worldcup
```

### 1.3 Ejecutar el script de configuración
Dentro de `psql`, navega a la carpeta `docs` y ejecuta el script:

```sql
\cd "C:/Users/P4t02/OneDrive/Desktop/IntroComputing/week 6/midterm-player-stats-p4t0110/docs"
\i setup_db.sql
```

Esto creará las 3 tablas normalizadas:
- **players** - información del jugador
- **matches** - información del partido
- **performances** - estadísticas del jugador por partido

Verifica que todo funcionó correctamente ejecutando:
```sql
\dt  -- lista todas las tablas
SELECT COUNT(*) FROM performances;  -- cuenta de registros
```

Cuando termines, sal de `psql`:
```sql
\q
```

---

## Paso 2: Configurar las Variables de Entorno

Abre el archivo `.env` en la raíz del proyecto y actualiza tus credenciales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres  ← CAMBIA ESTO
DB_NAME=worldcup
PORT=3001
NODE_ENV=development
```

---

## Paso 3: Instalar Dependencias del Frontend

```bash
cd frontend
npm install
cd ..
```

---

## Paso 4: Ejecutar la Aplicación

Abre **dos terminales** separadas:

### Terminal 1: Backend (Express API)
```bash
npm run dev:backend
```
El servidor debería estar en: **http://localhost:3001**

Prueba: http://localhost:3001/api/health (debería devolver `{"status":"ok"}`)

### Terminal 2: Frontend (Astro)
```bash
npm run dev:frontend
```
La app debería estar en: **http://localhost:3000**

---

## Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── db/
│   │   └── pool.js         ← Conexión a PostgreSQL
│   ├── routes/
│   │   └── performances.js ← Endpoints CRUD
│   └── server.js           ← Express app
├── frontend/
│   ├── src/
│   │   ├── components/     ← Componentes Astro
│   │   ├── pages/          ← Páginas Astro
│   │   └── layouts/        ← Layouts Astro
│   └── astro.config.mjs
├── docs/
│   ├── setup_db.sql        ← Script de BD
│   └── fifa_world_cup_2026_player_performance.csv
├── .env                    ← Credenciales (NO COMMITEAR)
├── .env.example            ← Template
└── package.json
```

---

## Próximos Pasos

### Backend - Routes Disponibles

Ahora tienes estos endpoints listos:

- **GET** `/api/performances?page=1&limit=10` - Listar con paginación
- **GET** `/api/performances/:id` - Detalle de un performance
- **POST** `/api/performances` - Crear nuevo performance
- **PUT** `/api/performances/:id` - Actualizar performance
- **DELETE** `/api/performances/:id` - Eliminar performance

Todos usan **consultas paramétrizadas** para evitar SQL injection ✅

### Frontend - Que Construir

1. **Página de Lista** (`frontend/src/pages/index.astro`)
   - Listar performances con paginación
   - Selector de rows-per-page (10/25/50/100)
   - Búsqueda por nombre de jugador
   - Ordenar por columnas

2. **Página de Detalle** (`frontend/src/pages/performances/[id].astro`)
   - Ver full info de un performance
   - Botones de editar/eliminar
   - Modal o form de edición

3. **Rankings** - Agregate query (JOIN + GROUP BY)
   - Ejemplo: "Top 10 Goleadores"
   - Ejemplo: "Asistencias por Equipo"

---

## Herramientas Útiles

### Probar Endpoints con Postman/Thunder Client

1. GET `http://localhost:3001/api/performances`
   - Deberías ver una lista paginated de performances

2. POST `http://localhost:3001/api/performances`
   ```json
   {
     "player_id": "1",
     "match_id": "1",
     "goals": 2,
     "assists": 1,
     "minutes_played": 90
   }
   ```

3. PUT `http://localhost:3001/api/performances/1`
   ```json
   {
     "goals": 3,
     "assists": 2,
     "minutes_played": 45
   }
   ```

---

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL no está corriendo
- Verifica que PostgreSQL esté iniciado

### Error: "database worldcup does not exist"
- La base de datos no se creó
- Corre `createdb worldcup` nuevamente

### Error: "Error fetching performances"
- Probablemente error de contraseña en `.env`
- Verifica `DB_PASSWORD` en `.env`

---

¡Ahora sí, comienza a construir! 🎉
