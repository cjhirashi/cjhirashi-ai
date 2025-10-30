# Implementation: [Feature Name]

> **IMPORTANTE:** Este es un TEMPLATE. Copia esta estructura para cada nueva implementación.
>
> **Instrucciones:**
> 1. Crea una carpeta en `/docs/implementations/{feature-name}/`
> 2. Copia este template como `implementation-overview.md` en esa carpeta
> 3. Reemplaza todos los `[PLACEHOLDER]` con valores reales
> 4. Crea archivos adicionales `phase-X-*.md` según se avanza en las fases

---

## Status Overview

| Aspecto | Valor |
|--------|-------|
| **Feature** | [Feature Name] |
| **Fecha Inicio** | YYYY-MM-DD |
| **Última Actualización** | YYYY-MM-DD |
| **Status Actual** | [🟡 Planning / 🔄 Design / 🔧 Implementation / ✅ Testing / 📚 Documentation / ✅ Complete] |
| **Progreso General** | XX% |
| **Responsable Principal** | [Nombre/Rol] |

---

## 📋 Executive Summary

### Qué Se Implementa
[1-2 párrafos claros explicando exactamente qué nueva funcionalidad o mejora se está implementando]

### Por Qué
[Razón principal o beneficio de esta implementación]

### Alcance
[Qué incluye y qué NO incluye]

---

## 🔄 Fases de Implementación

### Fase 1: Planificación
**Responsable:** Planner + System Analyser
**Estado:** [⏳ Pending / 🔄 In Progress / ✅ Complete]
**Documentación:** [phase-1-planning.md](./phase-1-planning.md)

**Lo que se hace:**
- [x] Plan detallado creado
- [x] Timeline estimado
- [ ] Viabilidad del sistema analizada
- [ ] Riesgos identificados

**Validación del Usuario:** [ ] Aprobado

---

### Fase 2: Diseño
**Responsable:** Architect + Design Consistency Validator
**Estado:** [⏳ Pending / 🔄 In Progress / ✅ Complete]
**Documentación:** [phase-2-design.md](./phase-2-design.md)

**Lo que se hace:**
- [ ] Arquitectura diseñada
- [ ] Diagramas creados
- [ ] Interfaces definidas
- [ ] Validación de consistencia completa

**Validación del Usuario:** [ ] Aprobado

---

### Fase 3: Implementación
**Responsable:** Coder + Code Reviewer
**Estado:** [⏳ Pending / 🔄 In Progress / ✅ Complete]
**Documentación:** [phase-3-implementation.md](./phase-3-implementation.md)

**Lo que se hace:**
- [ ] Código implementado
- [ ] Tests unitarios escritos
- [ ] Code review completado
- [ ] Cambios incorporados

**Validación del Usuario:** [ ] Aprobado

---

### Fase 4: Validación
**Responsable:** QA Validator + Security Specialist
**Estado:** [⏳ Pending / 🔄 In Progress / ✅ Complete]
**Documentación:** [phase-4-validation.md](./phase-4-validation.md)

**Lo que se hace:**
- [ ] Testing exhaustivo completado
- [ ] Security audit realizado
- [ ] Performance validado
- [ ] Bugs críticos resueltos

**Validación del Usuario:** [ ] Aprobado

---

### Fase 5: Documentación
**Responsable:** Documenter
**Estado:** [⏳ Pending / 🔄 In Progress / ✅ Complete]
**Documentación:** [phase-5-documentation.md](./phase-5-documentation.md)

**Lo que se hace:**
- [ ] Guías de uso creadas
- [ ] Diagramas Mermaid generados
- [ ] Setup documentado
- [ ] Troubleshooting incluido

**Documentación en `/docs/operation/`:**
- [ ] [feature-name]-guide.md
- [ ] [feature-name]-setup.md
- [ ] [feature-name]-troubleshooting.md
- [ ] [feature-name]-architecture.md

**Validación del Usuario:** [ ] Aprobado

---

## 📊 Timeline

### Estimación Original
- **Total:** [X] días
- **Planner:** [X] días
- **Architect:** [X] días
- **Coder:** [X] días
- **QA:** [X] días
- **Documentation:** [X] días

### Timeline Actual
- **Inicio:** YYYY-MM-DD
- **Hoy:** YYYY-MM-DD
- **Completado:** [Si aplica]
- **Varianza:** [+/- X días]

---

## ⚠️ Riesgos Identificados

### Críticos
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| [Riesgo 1] | Alta/Media/Baja | Alto/Medio/Bajo | [Plan] |

### Mayores
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| [Riesgo 1] | Alta/Media/Baja | Alto/Medio/Bajo | [Plan] |

### Menores
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| [Riesgo 1] | Alta/Media/Baja | Alto/Medio/Bajo | [Plan] |

---

## 🔗 Referencias y Links

### Código Afectado
- `src/[path]/[file.ts]` - [Descripción del cambio]
- `lib/[path]/[file.ts]` - [Descripción del cambio]
- `components/[path]/[file.tsx]` - [Descripción del cambio]

### Documentación Externa
- [Vercel AI SDK Docs](https://sdk.vercel.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

### Issues y PRs Relacionados
- [GitHub Issue #XXX](https://github.com/...)
- [GitHub PR #XXX](https://github.com/...)

---

## 💬 Notas y Decisiones

### Decisión 1: [Tema]
**Fecha:** YYYY-MM-DD
**Decisión:** [Lo que se decidió]
**Razón:** [Por qué]
**Alternativas consideradas:** [Opciones rechazadas]

---

## ✅ Checklist Pre-Entrega

- [ ] Todas las fases completas
- [ ] Documentación en `/docs/operation/` publicada
- [ ] CHANGELOG.md actualizado
- [ ] No hay issues críticos pendientes
- [ ] Usuario validó cada FASE
- [ ] Code pasa tests
- [ ] Código pasa linting
- [ ] Security audit completado
- [ ] Performance validado
- [ ] Documentación es clara y completa

---

## 📝 Notas de Entrega (Final)

[Una vez completada la implementación, agregar resumen final]

### Qué Se Entregó
- [Feature 1]
- [Feature 2]
- [Archivos creados/modificados]

### Documentación Generada
- `/docs/operation/[feature]-guide.md`
- `/docs/operation/[feature]-setup.md`
- `/docs/architecture/[feature]-design.md`
- [Otros documentos]

### Métricas
- Tiempo real: [X] días
- Estimado: [X] días
- Varianza: [+/- X] días
- Test coverage: XX%
- Performance: [Métricas]

### Siguientes Pasos
- [Mejoras futuras]
- [Optimizaciones posibles]
- [Features relacionadas a considerar]

---

**Creado:** YYYY-MM-DD
**Última actualización:** YYYY-MM-DD
**Especialista Principal:** [Nombre]
