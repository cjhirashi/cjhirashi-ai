# Plan de Implementación: Sistema de Almacenamiento de Archivos con Links Compartibles

## 📋 Información General

- **Proyecto:** cjhirashi-ai
- **Feature:** Sistema de Almacenamiento de Archivos
- **Versión:** 1.0.0
- **Fecha:** 2025-10-30
- **Duración Estimada:** 80-96 horas (10-12 días)
- **Prioridad:** Alta

## 🎯 Objetivos

### Objetivo Principal
Implementar un sistema completo de almacenamiento de archivos que permita a los usuarios subir, almacenar y compartir archivos mediante links temporales con opciones de seguridad, mientras que el superusuario puede gestionar límites y ver estadísticas sin acceso a los archivos.

### Objetivos Específicos
1. **Almacenamiento Seguro:** Utilizar Vercel Blob con validación antivirus
2. **Links Compartibles:** Generar links públicos o protegidos con expiración configurable
3. **Gestión de Cuotas:** Control de límites de almacenamiento por usuario
4. **Panel de Administración:** Estadísticas y gestión sin acceso a contenido
5. **Auditoría Completa:** Registro de todas las operaciones

## 📊 Análisis del Sistema

### Componentes Existentes a Reutilizar
- ✅ Autenticación con NextAuth v5
- ✅ Integración con Vercel Blob
- ✅ Sistema de usuarios y roles
- ✅ Panel de administración (Implementación 2)
- ✅ Estructura de BD con Drizzle ORM

### Nuevos Componentes Requeridos
- Sistema de gestión de archivos
- Generador de links compartibles
- Validación antivirus
- Sistema de cuotas
- Auditoría de eventos
- UI de drag-and-drop
- Estadísticas visuales

## 🗂️ Estructura de Base de Datos

### Tabla: `files`
```typescript
{
  id: string (UUID),
  userId: string (FK → users.id),
  filename: string,
  originalName: string,
  mimeType: string,
  size: bigint,
  blobUrl: string,
  blobKey: string,
  virusScanStatus: enum('pending', 'clean', 'infected', 'error'),
  virusScanResult: jsonb,
  uploadedAt: timestamp,
  lastAccessedAt: timestamp,
  deletedAt: timestamp nullable,
  metadata: jsonb
}
```

### Tabla: `storage_quotas`
```typescript
{
  id: string (UUID),
  userId: string (FK → users.id, UNIQUE),
  maxStorage: bigint (default: 104857600), // 100MB
  usedStorage: bigint (default: 0),
  isEnabled: boolean (default: true),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Tabla: `shared_links`
```typescript
{
  id: string (UUID),
  fileId: string (FK → files.id),
  userId: string (FK → users.id),
  shortCode: string (UNIQUE),
  isPublic: boolean,
  passwordHash: string nullable,
  expiresAt: timestamp,
  downloadCount: integer (default: 0),
  maxDownloads: integer nullable,
  createdAt: timestamp,
  lastAccessedAt: timestamp nullable,
  metadata: jsonb
}
```

### Tabla: `storage_audit_log`
```typescript
{
  id: string (UUID),
  userId: string (FK → users.id),
  action: enum('upload', 'download', 'delete', 'share', 'access'),
  fileId: string nullable,
  linkId: string nullable,
  ipAddress: string,
  userAgent: string,
  metadata: jsonb,
  createdAt: timestamp
}
```

### Índices Necesarios
- `files_userId_deletedAt_idx` (userId, deletedAt)
- `shared_links_shortCode_idx` (shortCode)
- `shared_links_expiresAt_idx` (expiresAt)
- `storage_audit_log_userId_createdAt_idx` (userId, createdAt DESC)

## 🔄 Fases de Implementación

### FASE 1: Base de Datos y Modelos (8-10 horas)

#### Tareas:
1. **Crear esquemas de BD** (2h)
   - Definir tablas en Drizzle schema
   - Configurar relaciones y constraints
   - Crear índices optimizados

2. **Generar migraciones** (1h)
   - Crear archivos de migración
   - Validar rollback
   - Documentar cambios

3. **Implementar modelos y queries** (3h)
   - Queries para files CRUD
   - Queries para quotas
   - Queries para shared links
   - Queries para audit log

4. **Crear seeders de prueba** (2h)
   - Datos de prueba para desarrollo
   - Usuarios con diferentes cuotas
   - Archivos de ejemplo

**Criterios de Éxito:**
- ✅ Migraciones aplicadas sin errores
- ✅ Todas las queries funcionando
- ✅ Datos de prueba cargados

**Dependencias:** Ninguna

---

### FASE 2: Integración con Vercel Blob (6-8 horas)

#### Tareas:
1. **Servicio de almacenamiento** (3h)
   - Wrapper para Vercel Blob API
   - Manejo de errores y retry
   - Configuración de timeouts

2. **Gestión de archivos** (2h)
   - Upload con streaming
   - Download con streaming
   - Delete con cleanup

3. **Generación de URLs** (1h)
   - URLs temporales
   - URLs públicas
   - Manejo de CORS

4. **Tests de integración** (2h)
   - Upload/download de diferentes tamaños
   - Manejo de errores
   - Performance tests

**Criterios de Éxito:**
- ✅ Upload/download funcionando
- ✅ URLs temporales generadas correctamente
- ✅ Cleanup automático funcionando

**Dependencias:** FASE 1

---

### FASE 3: Validación Antivirus (8-10 horas)

#### Tareas:
1. **Integración con VirusTotal API** (3h)
   - Configurar cliente API
   - Manejo de rate limits
   - Cache de resultados

2. **Pipeline de escaneo** (3h)
   - Queue de escaneo asíncrono
   - Actualización de estado en BD
   - Notificaciones de resultado

3. **Manejo de archivos infectados** (2h)
   - Cuarentena automática
   - Notificación al usuario
   - Limpieza de Blob storage

4. **Fallback y errores** (2h)
   - Manejo cuando API no disponible
   - Retry logic
   - Logging detallado

**Criterios de Éxito:**
- ✅ Escaneo automático al subir
- ✅ Archivos infectados bloqueados
- ✅ Fallback funcionando

**Dependencias:** FASE 2

---

### FASE 4: API Routes - Core (10-12 horas)

#### Tareas:
1. **Upload endpoint** (3h)
   - `/api/storage/upload`
   - Validación de cuota
   - Procesamiento multipart
   - Trigger de escaneo

2. **Files management** (2h)
   - `/api/storage/files` (GET, DELETE)
   - Paginación y filtros
   - Soft delete

3. **Links management** (3h)
   - `/api/storage/links` (POST, GET, DELETE)
   - Generación de shortcodes únicos
   - Validación de expiración
   - Hashing de contraseñas

4. **Download endpoint** (2h)
   - `/api/storage/download/:linkId`
   - Validación de acceso
   - Incremento de contador
   - Rate limiting

5. **Stats endpoint** (2h)
   - `/api/storage/stats`
   - Cálculo de uso
   - Agregaciones por tipo
   - Cache de resultados

**Criterios de Éxito:**
- ✅ Todos los endpoints funcionando
- ✅ Validaciones implementadas
- ✅ Rate limiting activo

**Dependencias:** FASE 3

---

### FASE 5: API Routes - Admin (6-8 horas)

#### Tareas:
1. **Admin stats endpoint** (2h)
   - `/api/admin/storage`
   - Agregación de datos por usuario
   - Sin acceso a archivos

2. **Quota management** (2h)
   - `/api/admin/storage/quota/:userId`
   - Validación de límites mínimos
   - Actualización en tiempo real

3. **Audit endpoints** (2h)
   - `/api/admin/storage/audit`
   - Filtros avanzados
   - Exportación de datos

4. **Middleware de autorización** (2h)
   - Validación de rol admin
   - Logging de acciones admin
   - Rate limiting especial

**Criterios de Éxito:**
- ✅ Admin puede ver estadísticas globales
- ✅ Admin puede ajustar cuotas
- ✅ Admin NO puede ver archivos

**Dependencias:** FASE 4

---

### FASE 6: UI de Usuario - Core (12-14 horas)

#### Tareas:
1. **Página de almacenamiento** (4h)
   - `/dashboard/storage`
   - Layout responsivo
   - Integración con sidebar

2. **Componente de upload** (3h)
   - Drag-and-drop
   - Progress bar
   - Validación client-side
   - Preview de archivos

3. **Lista de archivos** (3h)
   - Grid/List view
   - Sorting y filtros
   - Acciones rápidas
   - Paginación infinita

4. **Modal de compartir** (2h)
   - Configuración de link
   - Copia al portapapeles
   - QR code generation

5. **Estadísticas visuales** (2h)
   - Gráfico de uso
   - Breakdown por tipo
   - Historial de actividad

**Criterios de Éxito:**
- ✅ UI intuitiva y responsiva
- ✅ Drag-and-drop funcionando
- ✅ Feedback visual claro

**Dependencias:** FASE 4

---

### FASE 7: UI de Admin (8-10 horas)

#### Tareas:
1. **Página de admin storage** (3h)
   - `/admin/storage`
   - Dashboard con métricas
   - Integración con admin panel

2. **Tabla de usuarios y cuotas** (2h)
   - Lista paginada
   - Edición inline
   - Búsqueda y filtros

3. **Gráficos de estadísticas** (2h)
   - Chart.js o Recharts
   - Uso total vs disponible
   - Tendencias temporales

4. **Log de auditoría UI** (3h)
   - Timeline de eventos
   - Filtros avanzados
   - Exportación CSV

**Criterios de Éxito:**
- ✅ Admin puede gestionar cuotas fácilmente
- ✅ Visualizaciones claras y útiles
- ✅ Sin acceso a contenido de archivos

**Dependencias:** FASE 5, FASE 6

---

### FASE 8: Seguridad y Performance (8-10 horas)

#### Tareas:
1. **Implementar rate limiting** (2h)
   - Por endpoint
   - Por usuario
   - DDoS protection

2. **Validaciones de seguridad** (3h)
   - MIME type validation
   - File size limits
   - Path traversal prevention
   - XSS prevention

3. **Optimización de performance** (2h)
   - Caching estratégico
   - Query optimization
   - Lazy loading

4. **CORS y headers** (1h)
   - Configuración para links públicos
   - Security headers
   - CSP policies

5. **Auditoría de seguridad** (2h)
   - Penetration testing básico
   - OWASP checklist
   - Documentación de seguridad

**Criterios de Éxito:**
- ✅ No vulnerabilidades críticas
- ✅ Performance < 200ms en APIs
- ✅ Rate limiting funcionando

**Dependencias:** FASE 6, FASE 7

---

### FASE 9: Testing Completo (10-12 horas)

#### Tareas:
1. **Unit tests** (3h)
   - Servicios y utilities
   - Validaciones
   - Helpers

2. **Integration tests** (3h)
   - API endpoints
   - Base de datos
   - Vercel Blob

3. **E2E tests** (3h)
   - Flujo completo de upload
   - Compartir archivos
   - Admin workflows

4. **Performance tests** (2h)
   - Load testing
   - Stress testing
   - Benchmark de uploads

5. **Security tests** (1h)
   - Injection attempts
   - Authorization bypass
   - File upload exploits

**Criterios de Éxito:**
- ✅ Coverage > 80%
- ✅ Todos los tests pasando
- ✅ No regresiones

**Dependencias:** FASE 8

---

### FASE 10: Documentación y Deploy (6-8 horas)

#### Tareas:
1. **Documentación técnica** (2h)
   - API documentation
   - Arquitectura del sistema
   - Decisiones de diseño

2. **Guías de usuario** (2h)
   - Cómo subir archivos
   - Cómo compartir
   - FAQ

3. **Guía de administración** (1h)
   - Gestión de cuotas
   - Interpretación de métricas
   - Troubleshooting

4. **Preparación para deploy** (2h)
   - Variables de entorno
   - Scripts de migración
   - Rollback plan

5. **Deploy y validación** (1h)
   - Deploy a staging
   - Smoke tests
   - Monitoreo inicial

**Criterios de Éxito:**
- ✅ Documentación completa
- ✅ Deploy sin errores
- ✅ Sistema funcionando en producción

**Dependencias:** FASE 9

## 🔍 Análisis de Riesgos

### Riesgos Altos
1. **Límites de VirusTotal API**
   - Mitigación: Implementar queue y cache agresivo
   - Plan B: Usar ClamAV local como fallback

2. **Costos de Vercel Blob**
   - Mitigación: Límites estrictos por usuario
   - Plan B: Migrar a S3 si escala mucho

3. **Performance con archivos grandes**
   - Mitigación: Streaming y chunking
   - Plan B: Workers para procesamiento asíncrono

### Riesgos Medios
1. **Complejidad de UI drag-and-drop**
   - Mitigación: Usar librería probada (react-dropzone)
   - Plan B: Upload tradicional como fallback

2. **Gestión de expiración de links**
   - Mitigación: Cron job para limpieza
   - Plan B: Lazy evaluation en acceso

3. **Concurrencia en actualización de cuotas**
   - Mitigación: Transacciones y locks optimistas
   - Plan B: Queue de actualización

### Riesgos Bajos
1. **Integración con panel admin existente**
   - Mitigación: Seguir patrones establecidos

2. **Migración de datos futura**
   - Mitigación: Diseño extensible desde inicio

## 📈 Métricas de Éxito

### KPIs Técnicos
- ✅ Tiempo de upload < 5s para archivos < 10MB
- ✅ Disponibilidad del servicio > 99.9%
- ✅ Tiempo de generación de link < 500ms
- ✅ Escaneo antivirus < 30s
- ✅ Zero vulnerabilidades críticas

### KPIs de Negocio
- ✅ Usuarios pueden compartir archivos fácilmente
- ✅ Admin tiene control total de cuotas
- ✅ Cero archivos infectados almacenados
- ✅ Auditoría completa de accesos

## 🔄 Dependencias Externas

### APIs y Servicios
- **Vercel Blob:** Ya integrado, usar cliente existente
- **VirusTotal API:** Nueva integración, requiere API key
- **PostgreSQL:** Ya configurado con Neon
- **NextAuth:** Ya implementado

### Librerías Nuevas
```json
{
  "react-dropzone": "^14.2.3",
  "qrcode": "^1.5.3",
  "recharts": "^2.12.0",
  "node-virustotal": "^3.0.0",
  "bcryptjs": "^2.4.3",
  "nanoid": "^5.0.0"
}
```

## 🏁 Criterios de Aceptación Global

### Funcionales
- ✅ Usuarios pueden subir archivos de cualquier tipo
- ✅ Archivos son escaneados automáticamente
- ✅ Links compartibles funcionan con/sin contraseña
- ✅ Links expiran correctamente
- ✅ Admin ve estadísticas pero NO archivos
- ✅ Admin puede ajustar cuotas (mín 50MB)
- ✅ Sistema respeta límites de almacenamiento

### No Funcionales
- ✅ Performance adecuada (< 200ms APIs)
- ✅ Seguridad robusta (sin vulnerabilidades críticas)
- ✅ UX intuitiva y responsiva
- ✅ Documentación completa
- ✅ Tests con coverage > 80%

## 📅 Timeline Consolidado

```
Semana 1 (40h):
- Lunes-Martes: FASE 1 (BD) + FASE 2 (Blob)
- Miércoles-Jueves: FASE 3 (Antivirus) + FASE 4 (API Core)
- Viernes: FASE 5 (API Admin)

Semana 2 (40h):
- Lunes-Martes: FASE 6 (UI Usuario)
- Miércoles: FASE 7 (UI Admin)
- Jueves: FASE 8 (Seguridad)
- Viernes: FASE 9 (Testing)

Semana 3 (parcial 16h):
- Lunes: FASE 10 (Documentación)
- Martes: Deploy y validación final
```

## 📝 Notas Adicionales

### Consideraciones Técnicas
- Usar transacciones para operaciones críticas
- Implementar soft delete para archivos
- Cache agresivo para estadísticas
- Streaming para archivos grandes
- Background jobs para tareas pesadas

### Extensiones Futuras
- Preview de archivos (imágenes, PDFs)
- Carpetas y organización
- Colaboración en tiempo real
- Versionado de archivos
- Integración con servicios externos

## ✅ Checklist Pre-Deploy

- [ ] Todas las migraciones aplicadas
- [ ] Variables de entorno configuradas
- [ ] VirusTotal API key activa
- [ ] Rate limiting configurado
- [ ] CORS policies definidas
- [ ] Monitoring configurado
- [ ] Backups automáticos activos
- [ ] Documentación publicada
- [ ] Tests pasando al 100%
- [ ] Security audit completado

---

**Plan creado por:** Planner Agent
**Fecha:** 2025-10-30
**Estado:** PENDIENTE DE APROBACIÓN