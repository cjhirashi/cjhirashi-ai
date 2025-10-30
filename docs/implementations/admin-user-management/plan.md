# Plan: Sistema de Administración de Usuarios

**Versión:** 1.0
**Fecha:** 2025-10-30
**Proyecto:** cjhirashi-ai
**Duración Estimada:** 35-42 horas de trabajo de agente

---

## Resumen Ejecutivo

Este plan detalla la implementación del sistema completo de administración de usuarios para el superusuario. Incluye un panel de control administrativo con gestión completa de usuarios, control granular de acceso a agentes, auditoría de actividades y herramientas de análisis.

---

## Fase 1: Infraestructura de Administración (6 horas)

### 1.1 Extensión del Schema para Administración

**Tareas:**
1. Crear tabla de auditoría de cambios administrativos
2. Implementar tabla de configuración global
3. Crear tabla de invitaciones de usuario
4. Implementar tabla de métricas de uso por agente

**Archivos a modificar:**
- `lib/db/schema.ts`

**Schema adicional propuesto:**

```typescript
// Tabla de auditoría administrativa
adminAuditLog: {
  id: uuid primary key
  adminId: uuid references User not null
  action: varchar(50) not null // 'user_created', 'access_granted', 'access_revoked', etc
  targetUserId: uuid references User nullable
  targetAgentId: uuid references Agent nullable
  metadata: jsonb nullable // Datos adicionales del cambio
  ipAddress: varchar(45) nullable
  performedAt: timestamp not null
}

// Configuración global del sistema
systemConfig: {
  id: uuid primary key
  key: varchar(100) unique not null
  value: jsonb not null
  description: text nullable
  updatedBy: uuid references User
  updatedAt: timestamp
}

// Invitaciones de usuario
userInvitation: {
  id: uuid primary key
  email: varchar(100) not null
  invitedBy: uuid references User not null
  agentIds: jsonb not null // Array de IDs de agentes pre-asignados
  expiresAt: timestamp not null
  acceptedAt: timestamp nullable
  token: varchar(100) unique not null
  createdAt: timestamp not null
}

// Métricas de uso por agente
agentUsageMetrics: {
  id: uuid primary key
  agentId: uuid references Agent not null
  userId: uuid references User not null
  date: date not null
  messageCount: integer default 0
  tokenCount: integer default 0
  errorCount: integer default 0
  avgResponseTime: float nullable
  unique(agentId, userId, date)
}
```

**Dependencias:** Plan 1 - Schema base de agentes

**Criterios de éxito:**
- ✅ Tablas de auditoría creadas correctamente
- ✅ Índices optimizados para queries de reportes
- ✅ Constraints de integridad referencial funcionando

**Riesgos:**
- 🟡 Crecimiento excesivo de logs → Implementar política de retención
- 🟡 Performance en queries de métricas → Índices apropiados y aggregaciones

---

## Fase 2: Panel de Administración Principal (10 horas)

### 2.1 Dashboard Administrativo

**Tareas:**
1. Crear layout del panel admin con sidebar
2. Implementar dashboard con métricas clave
3. Crear widgets de estadísticas en tiempo real
4. Implementar gráficos de uso y tendencias
5. Crear sistema de notificaciones administrativas

**Archivos a crear:**
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/layout.tsx`
- `components/admin/dashboard/stats-widget.tsx`
- `components/admin/dashboard/usage-chart.tsx`
- `components/admin/dashboard/recent-activity.tsx`
- `components/admin/sidebar.tsx`
- `components/admin/admin-notifications.tsx`

**Estructura del Dashboard:**

```typescript
// Widgets principales
- Total de usuarios activos
- Agentes más utilizados
- Nuevos registros (última semana)
- Tasa de uso del sistema

// Gráficos
- Uso por agente (últimos 30 días)
- Crecimiento de usuarios
- Actividad por hora del día
- Distribución de tipos de usuario

// Actividad reciente
- Últimos 10 logins
- Últimas asignaciones de agentes
- Errores o incidentes recientes
```

### 2.2 Sistema de Navegación Administrativa

**Tareas:**
1. Crear menú de navegación específico para admin
2. Implementar breadcrumbs contextuales
3. Agregar búsqueda global de usuarios
4. Crear accesos rápidos a tareas comunes

**Archivos a crear:**
- `components/admin/navigation/admin-nav.tsx`
- `components/admin/navigation/quick-actions.tsx`
- `components/admin/search/global-search.tsx`

**Criterios de éxito:**
- ✅ Dashboard carga en menos de 2 segundos
- ✅ Métricas se actualizan en tiempo real
- ✅ Navegación clara y eficiente
- ✅ Responsive en dispositivos móviles

**Riesgos:**
- 🔴 Sobrecarga de queries en dashboard → Implementar caché y optimización
- 🟡 Complejidad visual → Diseño minimalista y enfocado

---

## Fase 3: Gestión de Usuarios (12 horas)

### 3.1 CRUD de Usuarios

**Tareas:**
1. Crear lista paginada de usuarios con filtros
2. Implementar vista detallada de usuario
3. Crear formulario de creación de usuario
4. Implementar edición de datos de usuario
5. Agregar funcionalidad de desactivación/reactivación
6. Implementar eliminación suave (soft delete)

**Archivos a crear:**
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/admin/users/[id]/page.tsx`
- `app/(admin)/admin/users/new/page.tsx`
- `components/admin/users/user-list.tsx`
- `components/admin/users/user-form.tsx`
- `components/admin/users/user-detail.tsx`
- `components/admin/users/user-filters.tsx`

**Funcionalidades de la lista:**

```typescript
// Filtros disponibles
- Por estado (activo/inactivo)
- Por tipo (regular/guest)
- Por fecha de registro
- Por última actividad
- Por agentes asignados
- Búsqueda por nombre/email

// Acciones en masa
- Activar/desactivar múltiples usuarios
- Asignar agente a múltiples usuarios
- Exportar lista a CSV

// Vista de detalle incluye
- Información personal
- Historial de acceso
- Agentes asignados
- Métricas de uso
- Logs de actividad
```

### 3.2 Sistema de Invitaciones

**Tareas:**
1. Crear formulario de invitación con pre-asignación de agentes
2. Implementar envío de email de invitación
3. Crear página de aceptación de invitación
4. Implementar tracking de invitaciones

**Archivos a crear:**
- `app/(admin)/admin/invitations/page.tsx`
- `app/(admin)/admin/invitations/new/page.tsx`
- `app/(auth)/invitation/[token]/page.tsx`
- `components/admin/invitations/invitation-form.tsx`
- `lib/email/invitation-template.ts`

### 3.3 Gestión de Perfiles de Usuario

**Tareas:**
1. Implementar cambio de rol (regular/super)
2. Sistema de notas administrativas por usuario
3. Historial completo de cambios
4. Gestión de sesiones activas

**Archivos a crear:**
- `components/admin/users/role-manager.tsx`
- `components/admin/users/admin-notes.tsx`
- `components/admin/users/change-history.tsx`
- `components/admin/users/session-manager.tsx`

**Criterios de éxito:**
- ✅ CRUD completo funcionando sin errores
- ✅ Búsqueda y filtros eficientes
- ✅ Invitaciones se envían correctamente
- ✅ Historial de cambios completo y auditable

**Riesgos:**
- 🔴 Eliminación accidental de usuarios → Confirmaciones múltiples, soft delete
- 🟡 Performance con muchos usuarios → Paginación del lado del servidor

---

## Fase 4: Control Granular de Accesos (10 horas)

### 4.1 Interfaz de Asignación de Agentes

**Tareas:**
1. Crear interfaz drag-and-drop para asignación
2. Implementar matriz de permisos usuario/agente
3. Crear templates de permisos predefinidos
4. Implementar asignación en masa
5. Crear sistema de herencia de permisos

**Archivos a crear:**
- `app/(admin)/admin/permissions/page.tsx`
- `components/admin/permissions/permission-matrix.tsx`
- `components/admin/permissions/agent-assignment.tsx`
- `components/admin/permissions/permission-templates.tsx`
- `components/admin/permissions/bulk-assignment.tsx`

**Interfaz de asignación:**

```typescript
// Vista de matriz
interface PermissionMatrix {
  // Filas: Usuarios
  // Columnas: Agentes
  // Celdas: Checkbox o toggle para acceso

  // Funcionalidades:
  - Selección múltiple
  - Aplicar template
  - Copiar permisos de otro usuario
  - Vista por categoría de agente
  - Búsqueda y filtrado en tiempo real
}

// Templates predefinidos
- "Usuario Básico": Agentes públicos + defaults
- "Usuario Avanzado": Básico + categorías específicas
- "Usuario Premium": Todos los agentes públicos
- "Desarrollador": Agentes técnicos
- "Analista": Agentes de datos y reportes
```

### 4.2 Gestión de Categorías y Agentes

**Tareas:**
1. CRUD de categorías de agentes
2. Configuración de agentes (prompts, parámetros)
3. Activación/desactivación de agentes
4. Ordenamiento y priorización

**Archivos a crear:**
- `app/(admin)/admin/agents/page.tsx`
- `app/(admin)/admin/agents/[id]/page.tsx`
- `components/admin/agents/agent-config.tsx`
- `components/admin/agents/category-manager.tsx`

### 4.3 Políticas de Acceso Automáticas

**Tareas:**
1. Crear reglas de asignación automática
2. Implementar expiración de permisos
3. Sistema de aprobación de solicitudes
4. Notificaciones de cambios de acceso

**Archivos a crear:**
- `components/admin/policies/access-rules.tsx`
- `components/admin/policies/expiration-manager.tsx`
- `components/admin/policies/approval-workflow.tsx`
- `lib/services/access-policy-service.ts`

**Criterios de éxito:**
- ✅ Asignación de permisos intuitiva y rápida
- ✅ Templates funcionan correctamente
- ✅ Cambios se reflejan inmediatamente
- ✅ Sistema de políticas automatiza tareas repetitivas

**Riesgos:**
- 🔴 Asignación incorrecta de permisos → Preview antes de aplicar
- 🟡 Complejidad de la interfaz → UX testing iterativo

---

## Fase 5: Sistema de Auditoría y Logs (5 horas)

### 5.1 Visualización de Logs

**Tareas:**
1. Crear visor de logs con filtros avanzados
2. Implementar búsqueda en logs
3. Crear exportación de logs
4. Implementar alertas automáticas

**Archivos a crear:**
- `app/(admin)/admin/audit/page.tsx`
- `components/admin/audit/log-viewer.tsx`
- `components/admin/audit/log-filters.tsx`
- `components/admin/audit/alert-config.tsx`

**Tipos de logs a trackear:**

```typescript
enum AuditAction {
  // Usuarios
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_DEACTIVATED = "user_deactivated",
  USER_REACTIVATED = "user_reactivated",
  USER_DELETED = "user_deleted",

  // Accesos
  ACCESS_GRANTED = "access_granted",
  ACCESS_REVOKED = "access_revoked",
  ACCESS_EXPIRED = "access_expired",

  // Sesiones
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",

  // Agentes
  AGENT_CREATED = "agent_created",
  AGENT_UPDATED = "agent_updated",
  AGENT_DEACTIVATED = "agent_deactivated",

  // Sistema
  CONFIG_UPDATED = "config_updated",
  BULK_OPERATION = "bulk_operation"
}
```

### 5.2 Reportes y Análisis

**Tareas:**
1. Crear generador de reportes personalizados
2. Implementar dashboard de análisis
3. Crear sistema de alertas y notificaciones

**Archivos a crear:**
- `app/(admin)/admin/reports/page.tsx`
- `components/admin/reports/report-builder.tsx`
- `components/admin/reports/analytics-dashboard.tsx`

**Criterios de éxito:**
- ✅ Logs completos y searchables
- ✅ Reportes generados en menos de 5 segundos
- ✅ Alertas funcionan en tiempo real
- ✅ Exportación de datos sin pérdida de información

**Riesgos:**
- 🟡 Volumen excesivo de logs → Estrategia de archivado
- 🟡 Performance en búsquedas → Indexación apropiada

---

## Fase 6: APIs y Servicios Administrativos (4 horas)

### 6.1 APIs de Administración

**Tareas:**
1. Crear endpoints CRUD de usuarios
2. Implementar APIs de gestión de permisos
3. Crear endpoints de auditoría
4. Implementar APIs de métricas y reportes

**Archivos a crear:**
- `app/api/admin/users/route.ts`
- `app/api/admin/users/[id]/route.ts`
- `app/api/admin/permissions/route.ts`
- `app/api/admin/audit/route.ts`
- `app/api/admin/metrics/route.ts`
- `app/api/admin/reports/route.ts`

### 6.2 Middleware de Autorización

**Tareas:**
1. Crear middleware para validar superusuario
2. Implementar rate limiting para admin APIs
3. Agregar logging de todas las operaciones admin

**Archivos a crear/modificar:**
- `middleware.ts` (actualizar)
- `lib/auth/admin-middleware.ts`
- `lib/services/admin-service.ts`

**Criterios de éxito:**
- ✅ Todas las APIs protegidas correctamente
- ✅ Solo superusuario puede acceder
- ✅ Rate limiting previene abuso
- ✅ Todas las operaciones son auditadas

---

## Fase 7: Testing y Seguridad (4 horas)

### 7.1 Testing del Sistema Admin

**Tareas:**
1. Tests de autorización y permisos
2. Tests de CRUD de usuarios
3. Tests de asignación de agentes
4. Tests de auditoría

**Archivos a crear:**
- `tests/admin/authorization.test.ts`
- `tests/admin/user-management.test.ts`
- `tests/admin/permissions.test.ts`
- `tests/admin/audit.test.ts`

### 7.2 Auditoría de Seguridad

**Tareas:**
1. Validar protección contra CSRF
2. Verificar sanitización de inputs
3. Auditar permisos y roles
4. Revisar logs de seguridad

**Criterios de éxito:**
- ✅ Todos los tests pasan
- ✅ No vulnerabilidades críticas
- ✅ Auditoría completa de todas las acciones
- ✅ Principio de menor privilegio aplicado

---

## Dependencias y Consideraciones

### Dependencias Técnicas
- Plan 1 debe estar completado (schema base, OAuth)
- Sistema de autenticación funcionando
- Base de datos con agentes configurados

### Consideraciones de Seguridad
- Solo UN superusuario inicial (definido por env var)
- Todas las operaciones admin deben ser auditadas
- Implementar 2FA para superusuario (fase futura)
- Sesiones admin con timeout más corto

### Consideraciones de UX
- Interfaz debe ser eficiente para gestión de muchos usuarios
- Feedback inmediato en todas las operaciones
- Confirmaciones para operaciones destructivas
- Atajos de teclado para tareas frecuentes

---

## Cronograma y Estimaciones

| Fase | Duración | Dependencias |
|------|----------|--------------|
| Fase 1: Infraestructura | 6 horas | Plan 1 completado |
| Fase 2: Panel Admin | 10 horas | Fase 1 |
| Fase 3: Gestión Usuarios | 12 horas | Fase 2 |
| Fase 4: Control Accesos | 10 horas | Fase 3 |
| Fase 5: Auditoría | 5 horas | Fases 2-4 |
| Fase 6: APIs | 4 horas | Fases 2-4 |
| Fase 7: Testing | 4 horas | Todas las anteriores |

**Total:** 51 horas de trabajo efectivo

**Timeline recomendado:** 6-8 días laborables con 1-2 agentes especializados

---

## Riesgos Identificados y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Acceso no autorizado a panel admin | Baja | Crítico | Múltiples capas de validación, auditoría completa |
| Pérdida de datos por operación masiva | Media | Alto | Confirmaciones múltiples, soft delete, backups |
| Performance con muchos usuarios | Media | Medio | Paginación, caché, índices optimizados |
| Complejidad excesiva de UI | Alta | Medio | Diseño iterativo, feedback de usuario |
| Escalabilidad de logs | Alta | Bajo | Estrategia de retención, archivado automático |

---

## Criterios de Éxito Global

- ✅ Superusuario puede gestionar todos los usuarios
- ✅ Control granular de acceso a agentes funcional
- ✅ Sistema de invitaciones operativo
- ✅ Auditoría completa de todas las acciones
- ✅ Dashboard con métricas en tiempo real
- ✅ Búsqueda y filtros eficientes
- ✅ APIs protegidas y documentadas
- ✅ Performance adecuado (operaciones < 1s)
- ✅ Cero vulnerabilidades de seguridad críticas

---

## Notas Adicionales

### Configuración Inicial del Superusuario

```env
SUPER_USER_EMAIL=admin@example.com
```

El primer usuario que se registre con este email será marcado automáticamente como superusuario.

### Futuras Mejoras (No incluidas en este plan)

- Autenticación de dos factores (2FA) para admin
- Sistema de roles granulares (más allá de super/regular)
- API pública para integración con sistemas externos
- Dashboard embebible para partners
- Sistema de facturación/quotas por usuario
- Backup y restore automático de configuración

### Estándares de Desarrollo

- Seguir guías de accesibilidad WCAG 2.1 AA
- Todos los textos deben ser internacionalizables
- Documentar todas las APIs con OpenAPI/Swagger
- Tests deben cubrir al menos 80% del código crítico

---

**Fin del documento**