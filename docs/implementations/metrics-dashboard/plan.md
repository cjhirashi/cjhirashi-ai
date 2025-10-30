# Plan de Implementación: Dashboard de Métricas de Uso General

## 📊 Información General

**Proyecto:** cjhirashi-ai
**Implementación:** #3 - Dashboard de Métricas de Uso General
**Fecha:** 2025-10-30
**Prioridad:** Alta
**Estimación Total:** 40-48 horas

---

## 🎯 Objetivo

Crear un dashboard completo donde cada usuario pueda visualizar sus métricas agregadas de uso de todos sus agentes y conversaciones. El superusuario tendrá capacidad adicional de ver métricas de cualquier usuario del sistema.

## 📋 Alcance

### Incluido
- Dashboard de métricas para usuarios regulares
- Dashboard administrativo para superusuarios
- Visualizaciones con gráficos interactivos (Recharts)
- KPIs y estadísticas destacadas
- Agregación de datos desde BD existente
- Filtros por período de tiempo
- Exportación de datos (CSV/PDF)

### Excluido
- Métricas en tiempo real (streaming)
- Notificaciones automáticas por límites
- Comparación entre usuarios (solo admin ve individual)
- Edición de métricas históricas

---

## 🏗️ Arquitectura de la Solución

### Estructura de Base de Datos

#### Tablas Existentes a Utilizar
```sql
-- Chat: Contiene lastContext con tokenUsage
-- Message_v2: Contiene content y metadata
-- User: Información de usuarios
-- Document: Artefactos generados
```

#### Nueva Tabla de Agregación (Opcional pero Recomendada)
```sql
-- metrics_aggregation
CREATE TABLE metrics_aggregation (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  agent_id TEXT,
  date DATE NOT NULL,
  total_tokens INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,6) DEFAULT 0,
  conversation_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  document_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, agent_id, date),
  INDEX idx_user_date (user_id, date),
  INDEX idx_agent_date (agent_id, date)
);
```

### Componentes del Sistema

```
/app
├── (dashboard)
│   └── dashboard
│       └── metrics
│           ├── page.tsx           # Dashboard usuario regular
│           └── loading.tsx        # Loading state
├── (admin)
│   └── admin
│       └── metrics
│           ├── page.tsx           # Dashboard superusuario
│           ├── [userId]
│           │   └── page.tsx       # Métricas de usuario específico
│           └── loading.tsx
└── api
    └── metrics
        ├── route.ts               # GET métricas usuario actual
        ├── users
        │   └── route.ts           # GET lista usuarios (admin)
        └── [userId]
            └── route.ts           # GET métricas usuario específico (admin)
```

---

## 📅 Fases de Implementación

### FASE 1: Preparación de Base de Datos (8 horas)

#### Tareas:
1. **Análisis de esquema actual** (2h)
   - Revisar estructura de Chat.lastContext
   - Mapear campos de tokenUsage disponibles
   - Identificar agentes en mensajes
   - Documentar estructura de datos

2. **Crear tabla de agregación** (2h)
   - Diseñar esquema optimizado
   - Crear migración con Drizzle
   - Añadir índices necesarios
   - Validar con db:push

3. **Script de migración de datos históricos** (3h)
   - Extraer métricas de Chat.lastContext
   - Calcular costos según modelo
   - Poblar tabla de agregación
   - Validar integridad de datos

4. **Job de agregación periódica** (1h)
   - Crear función de agregación
   - Configurar cron job (cada hora)
   - Logging y monitoreo

**Criterios de Éxito:**
- ✅ Tabla creada y con índices
- ✅ Datos históricos migrados
- ✅ Job funcionando automáticamente

**Riesgos:**
- ⚠️ Volumen de datos históricos grande
- ⚠️ Estructura de tokenUsage inconsistente

---

### FASE 2: API Backend (10 horas)

#### Tareas:

1. **API de métricas de usuario** (3h)
   - GET /api/metrics
   - Parámetros: dateFrom, dateTo, agentId
   - Respuesta con agregaciones
   - Cache de 5 minutos

2. **API administrativa** (3h)
   - GET /api/metrics/users (lista usuarios)
   - GET /api/metrics/[userId] (métricas específicas)
   - Validación de rol superusuario
   - Auditoría de acceso

3. **Funciones de agregación** (2h)
   - calculateTotalTokens()
   - calculateCostByModel()
   - getTopAgents()
   - getTrendData()

4. **Optimización de consultas** (2h)
   - Implementar paginación
   - Añadir cache Redis (si disponible)
   - Query optimization con EXPLAIN
   - Índices adicionales si necesario

**Criterios de Éxito:**
- ✅ APIs respondiendo < 500ms
- ✅ Validación de permisos funcionando
- ✅ Datos correctos y consistentes

**Riesgos:**
- ⚠️ Performance con grandes volúmenes
- ⚠️ Cálculo de costos por modelo

---

### FASE 3: Componentes de Visualización (12 horas)

#### Tareas:

1. **Setup Recharts y componentes base** (2h)
   - Instalar recharts
   - Crear tema consistente
   - Componentes wrapper reutilizables
   - Tipos TypeScript

2. **Componentes de KPIs** (3h)
   ```tsx
   - <MetricCard /> - Card con número y tendencia
   - <TotalTokensCard />
   - <TotalCostCard />
   - <ConversationsCard />
   - <FavoriteAgentCard />
   ```

3. **Gráficos interactivos** (5h)
   ```tsx
   - <AgentDistributionPie /> - Distribución por agente
   - <CostTrendLine /> - Tendencia de costo
   - <TokensByAgentBar /> - Tokens por agente
   - <UsageHeatmap /> - Mapa de calor uso diario
   ```

4. **Componentes de filtros** (2h)
   ```tsx
   - <DateRangePicker />
   - <AgentSelector />
   - <MetricTypeSelector />
   - <ExportButton />
   ```

**Criterios de Éxito:**
- ✅ Gráficos responsivos
- ✅ Interacciones fluidas
- ✅ Datos actualizándose correctamente

**Riesgos:**
- ⚠️ Compatibilidad Recharts con Next.js 15
- ⚠️ Performance con muchos datos

---

### FASE 4: Páginas de Dashboard (10 horas)

#### Tareas:

1. **Dashboard usuario regular** (4h)
   - Página /dashboard/metrics
   - Layout con grid responsivo
   - Integración de componentes
   - Loading y error states

2. **Dashboard administrativo** (4h)
   - Página /admin/metrics
   - Selector de usuario
   - Vista comparativa
   - Exportación masiva

3. **Estados y navegación** (2h)
   - Loading skeletons
   - Error boundaries
   - Breadcrumbs
   - Enlaces desde sidebar

**Criterios de Éxito:**
- ✅ Navegación fluida
- ✅ Datos correctos por rol
- ✅ Responsive en móvil

**Riesgos:**
- ⚠️ Complejidad de estados
- ⚠️ Manejo de errores

---

### FASE 5: Testing y Validación (6 horas)

#### Tareas:

1. **Tests unitarios** (2h)
   - Funciones de agregación
   - Componentes aislados
   - Hooks personalizados

2. **Tests de integración** (2h)
   - APIs con diferentes roles
   - Flujos completos
   - Casos edge

3. **Tests E2E** (2h)
   - Flujo usuario regular
   - Flujo superusuario
   - Exportación de datos

**Criterios de Éxito:**
- ✅ Coverage > 80%
- ✅ Todos los tests pasando
- ✅ Sin regresiones

---

### FASE 6: Documentación y Deploy (4 horas)

#### Tareas:

1. **Documentación técnica** (2h)
   - Guía de uso
   - API reference
   - Troubleshooting

2. **Deploy y validación** (2h)
   - Migración en producción
   - Smoke tests
   - Monitoreo inicial

**Criterios de Éxito:**
- ✅ Documentación completa
- ✅ Deploy sin errores
- ✅ Métricas funcionando en producción

---

## 🔄 Dependencias

### Dependencias Internas
- ✅ **Implementación 1** (Sistema multi-agente): Necesaria para identificar agentes
- ✅ **Implementación 2** (Gestión de agentes): Tabla Agent debe existir
- ✅ Sistema de autenticación NextAuth funcionando
- ✅ Tablas Chat y Message_v2 con datos

### Dependencias Externas
- 📦 recharts: ^2.12.0
- 📦 date-fns: ^3.0.0
- 📦 react-day-picker: ^8.10.0
- 📦 lucide-react: (ya instalado)

---

## ⚠️ Riesgos Identificados

### Riesgo Alto
1. **Performance con volumen de datos**
   - Mitigación: Agregación precomputada, índices, paginación

2. **Cálculo incorrecto de costos**
   - Mitigación: Tabla de precios por modelo, tests exhaustivos

### Riesgo Medio
3. **Datos históricos inconsistentes**
   - Mitigación: Script de limpieza, valores por defecto

4. **Complejidad de permisos**
   - Mitigación: Middleware claro, tests de seguridad

### Riesgo Bajo
5. **Compatibilidad de librerías**
   - Mitigación: Versiones específicas, alternativas identificadas

---

## 📊 Métricas de Éxito

### KPIs del Proyecto
- ✅ Dashboard carga en < 2 segundos
- ✅ APIs responden en < 500ms
- ✅ 100% de usuarios pueden ver sus métricas
- ✅ Superusuario puede ver todas las métricas
- ✅ Datos 100% precisos vs. BD original

### Criterios de Aceptación
- [ ] Usuario ve sus métricas agregadas correctamente
- [ ] Gráficos interactivos funcionando
- [ ] Filtros por fecha funcionando
- [ ] Exportación a CSV funcionando
- [ ] Superusuario puede cambiar entre usuarios
- [ ] Performance aceptable con 10k+ registros
- [ ] Sin errores en consola
- [ ] Responsive en móvil

---

## 🚀 Entregables

### Código
- [x] Migración de BD y tabla metrics_aggregation
- [x] APIs de métricas (3 endpoints)
- [x] Componentes de visualización (10+)
- [x] Páginas de dashboard (2)
- [x] Tests unitarios y E2E

### Documentación
- [x] Plan de implementación (este documento)
- [x] README con instrucciones de uso
- [x] Guía de API
- [x] Guía de troubleshooting

### Configuración
- [x] Variables de entorno actualizadas
- [x] Scripts de migración
- [x] Job de agregación configurado

---

## 📅 Cronograma

```
Semana 1:
  Día 1-2: FASE 1 - Base de Datos
  Día 3-4: FASE 2 - APIs (primera mitad)
  Día 5: FASE 2 - APIs (segunda mitad)

Semana 2:
  Día 6-7: FASE 3 - Componentes
  Día 8-9: FASE 4 - Páginas
  Día 10: FASE 5 - Testing

Semana 3:
  Día 11: FASE 6 - Documentación
  Día 12: Deploy y validación
```

**Duración Total Estimada:** 40-48 horas (10-12 días laborales)

---

## 👥 Recursos Necesarios

### Humanos
- 1 Full-Stack Developer (principal)
- 1 QA Tester (parcial, 20%)
- 1 DevOps (para deploy, 10%)

### Técnicos
- Acceso a BD PostgreSQL
- Entorno de desarrollo local
- Acceso a Vercel para deploy
- Redis (opcional, para cache)

---

## ✅ Checklist Pre-Implementación

- [ ] Confirmar estructura de Chat.lastContext
- [ ] Validar tabla Agent existe (Impl. 2)
- [ ] Confirmar modelos y precios para cálculo
- [ ] Decidir si usar Redis para cache
- [ ] Confirmar diseño UI/UX con stakeholders
- [ ] Preparar datos de prueba

---

## 🔄 Actualizaciones del Plan

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-10-30 | 1.0 | Plan inicial creado |

---

**Fin del Documento**