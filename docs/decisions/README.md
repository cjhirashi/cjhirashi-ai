# Architecture Decision Records (ADRs)

Este directorio contiene los Architecture Decision Records (ADRs) del proyecto - documentación de decisiones técnicas importantes y sus justificaciones.

## ¿Qué es un ADR?

Un ADR (Architecture Decision Record) es un documento que captura una decisión arquitectónica importante junto con su contexto y consecuencias.

### ¿Cuándo crear un ADR?

Crea un ADR cuando:

- ✅ Eliges una tecnología o framework principal
- ✅ Decides sobre patrones arquitectónicos importantes
- ✅ Cambias la estructura del proyecto significativamente
- ✅ Adoptas o abandonas una herramienta crítica
- ✅ Implementas una solución no obvia a un problema complejo
- ✅ La decisión tiene impacto a largo plazo en el proyecto

**NO** creas un ADR para:

- ❌ Decisiones triviales o reversibles fácilmente
- ❌ Implementaciones específicas de features pequeñas
- ❌ Cambios que solo afectan un archivo o módulo
- ❌ Decisiones de estilo o formatting (usa linter config)

## Cómo crear un ADR

### 1. Copia el template
```bash
cp template.md adr-[número]-[título-corto].md
```

### 2. Numera secuencialmente
- ADRs se numeran de forma incremental: `adr-001`, `adr-002`, etc.
- Busca el último número usado en este directorio

### 3. Completa todas las secciones
- **Context**: El problema y situación
- **Decision**: Qué se decidió
- **Rationale**: Por qué se decidió así
- **Consequences**: Impactos positivos y negativos
- **Alternatives**: Qué más se consideró

### 4. Status del ADR
- **Proposed**: Propuesta en discusión
- **Accepted**: Decisión aceptada e implementada
- **Deprecated**: Ya no se recomienda
- **Superseded by ADR-XXX**: Reemplazada por otra decisión

## Ejemplo de Naming

```
adr-001-use-postgresql.md
adr-002-adopt-typescript.md
adr-003-choose-nextjs-framework.md
adr-004-implement-rbac-authorization.md
```

## Índice de ADRs

<!-- Actualizar esta lista cuando se agreguen nuevos ADRs -->

### Active ADRs

Ninguno aún. Este es un proyecto nuevo.

### Deprecated ADRs

Ninguno.

## Buenas Prácticas

### Escribir un buen ADR

1. **Ser específico**: "Usar PostgreSQL" en vez de "Usar una base de datos"
2. **Explicar el contexto**: El lector debe entender POR QUÉ era necesaria una decisión
3. **Ser honesto**: Mencionar desventajas y trade-offs
4. **Incluir alternativas**: Mostrar que se consideraron opciones
5. **Ser conciso**: 1-2 páginas es ideal
6. **Actualizar status**: Marcar como Deprecated cuando ya no aplique

### Mantener ADRs

- **No borrar ADRs**: Marcarlos como Deprecated o Superseded
- **Actualizar regularmente**: Revisar cada 6-12 meses
- **Link entre ADRs**: Referenciar ADRs relacionados
- **Versionado**: Los ADRs son parte del código (git)

### Template Sections

Todas las secciones del template son importantes:

- ✅ **Context**: Sin esto, nadie entenderá por qué se decidió
- ✅ **Decision**: Debe ser clara y específica
- ✅ **Rationale**: La justificación es tan importante como la decisión
- ✅ **Consequences**: Honestidad sobre trade-offs
- ✅ **Alternatives**: Muestra que se hizo análisis

Secciones opcionales:
- 🔹 **Implementation Notes**: Solo si son relevantes
- 🔹 **References**: Links útiles si existen

## Recursos

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)

## Contribuir

1. Crea tu ADR usando el template
2. Discútelo con el equipo (PR o reunión)
3. Actualiza status a "Accepted" cuando se apruebe
4. Actualiza el índice de este README

---

**Última actualización:** 2025-01-07
