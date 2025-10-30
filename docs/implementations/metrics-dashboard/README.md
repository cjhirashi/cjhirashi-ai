# Dashboard de Métricas de Uso General - Resumen Ejecutivo

## 🎯 Qué es

Un dashboard completo de visualización de métricas donde:
- **Usuarios regulares** ven sus propias estadísticas de uso
- **Superusuarios** pueden ver métricas de cualquier usuario del sistema

## 📊 Características Principales

### Para Usuarios Regulares
- **KPIs destacados**: Tokens totales, costo acumulado, conversaciones
- **Gráficos interactivos**:
  - Distribución de uso por agente (pie chart)
  - Tendencia de costos en el tiempo (line chart)
  - Tokens consumidos por agente (bar chart)
- **Filtros**: Por rango de fechas y agente específico
- **Exportación**: Descarga de datos en CSV

### Para Superusuarios
- Todo lo anterior PLUS:
- **Selector de usuario**: Ver métricas de cualquier usuario
- **Vista administrativa**: Lista de todos los usuarios con métricas resumidas
- **Auditoría**: Registro de accesos a métricas de otros usuarios

## 🏗️ Arquitectura Técnica

```
Stack Tecnológico:
- Frontend: Next.js 15 + Recharts
- Backend: API Routes con validación de roles
- Base de Datos: PostgreSQL con tabla de agregación
- Cache: Redis opcional para performance
```

## 📅 Timeline de Implementación

| Fase | Descripción | Duración |
|------|-------------|----------|
| **Fase 1** | Preparación de BD y migración de datos | 8 horas |
| **Fase 2** | Desarrollo de APIs backend | 10 horas |
| **Fase 3** | Componentes de visualización | 12 horas |
| **Fase 4** | Páginas de dashboard | 10 horas |
| **Fase 5** | Testing completo | 6 horas |
| **Fase 6** | Documentación y deploy | 4 horas |

**Total: 40-48 horas** (10-12 días laborales)

## ⚡ Rutas Principales

```
/dashboard/metrics         → Dashboard usuario regular
/admin/metrics            → Dashboard administrativo
/api/metrics              → API métricas usuario actual
/api/metrics/users        → API lista usuarios (admin)
/api/metrics/[userId]     → API métricas específicas (admin)
```

## 🔑 Características Clave de Implementación

### Performance
- ✅ Tabla de agregación precomputada para consultas rápidas
- ✅ Índices optimizados en user_id, agent_id y date
- ✅ Cache de 5 minutos en APIs
- ✅ Paginación para grandes volúmenes

### Seguridad
- ✅ Validación estricta de roles en cada API
- ✅ Usuarios solo ven sus propias métricas
- ✅ Auditoría de accesos administrativos
- ✅ Rate limiting en APIs

### UX/UI
- ✅ Diseño responsivo mobile-first
- ✅ Loading states con skeletons
- ✅ Error boundaries para manejo de errores
- ✅ Tooltips informativos en gráficos

## 📦 Dependencias Principales

### Internas (de otras implementaciones)
- **Impl. 1**: Sistema multi-agente (identificación de agentes)
- **Impl. 2**: Gestión de agentes (tabla Agent)

### Externas (npm packages)
```json
{
  "recharts": "^2.12.0",
  "date-fns": "^3.0.0",
  "react-day-picker": "^8.10.0"
}
```

## ⚠️ Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Performance con grandes volúmenes | Alto | Agregación precomputada + índices |
| Cálculo incorrecto de costos | Alto | Tests exhaustivos + tabla de precios |
| Datos históricos inconsistentes | Medio | Script de limpieza + defaults |

## ✅ Criterios de Éxito

- [ ] Dashboard carga en < 2 segundos
- [ ] APIs responden en < 500ms
- [ ] 100% precisión en cálculos
- [ ] Cero errores en producción
- [ ] Usuarios satisfechos con visualizaciones

## 🚀 Próximos Pasos

1. **Validar** estructura actual de `Chat.lastContext`
2. **Confirmar** existencia de tabla `Agent` (Impl. 2)
3. **Definir** modelos y precios para cálculo de costos
4. **Revisar** diseño UI/UX con stakeholders
5. **Iniciar** Fase 1: Preparación de Base de Datos

## 📝 Documentación Relacionada

- [Plan Detallado](./plan.md) - Plan completo con todas las fases
- [API Reference](/docs/api/metrics.md) - Documentación de APIs (por crear)
- [Guía de Usuario](/docs/guides/metrics-dashboard.md) - Manual de uso (por crear)

---

**Estado:** 📋 Planificado | **Prioridad:** 🔴 Alta | **Inicio:** Por definir