# Changelog

Todas las versiones notables de este proyecto serán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y el proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Nuevo equipo de especialistas para orquestación (12 agentes total)
- Sistema Analyser para análisis de viabilidad
- Design Consistency Validator para validación de diseños
- Coder para implementación de calidad
- Code Reviewer para revisión de código con poder de escalada
- Documenter para creación de documentación operacional
- Nuevas carpetas en `/docs/`: `/operation/`, `/implementations/`, `/design-validation/`
- CHANGELOG.md para control de versiones
- Flujo de orquestación actualizado con validación por FASES
- Validación de claridad obligatoria antes de ejecutar instrucciones

### Changed
- Actualización completa de `.claude/CLAUDE.md` a versión 2.0
- Cambio de validación de usuario: ahora valida al final de FASES, no en pasos intermedios
- Integration Engineer ahora reemplazado por Coder + Code Reviewer en el flujo
- Estructura de documentación de implementación: un documento central por feature

### Deprecated
- "Integration Engineer" como rol único (ahora es Coder + Code Reviewer)

---

## [v0.1.0] - 2025-10-30

### Initial Setup
- Proyecto inicialmente desplegado en Vercel
- PostgreSQL configurado en Neon
- Redis configurado para streams resumibles
- Vercel Blob configurado para almacenamiento de archivos
- NextAuth.js v5 configurado con autenticación
- AI SDK integrado con xAI Grok models vía Vercel AI Gateway

### Core Features (Heredadas)
- Chat interface con soporte de artifacts
- Artifact system: text, code, image, sheet
- Python code execution en sandbox
- Message voting system
- Chat visibility (public/private)
- Token usage tracking con TokenLens
- Resumable streams (con Redis)

### Documentation Created
- `.claude/CLAUDE.md` - Instrucciones maestro orquestador (v1.0)
- `.claude/agents/` - Definiciones de especialistas
- `/docs/` - Estructura de documentación del proyecto
- Guías de referencia para agentes en `.claude/docs/`

### Team Setup
- 7 especialistas iniciales: Planner, Architect, Design Validator, Integration Engineer, QA Validator, Security Specialist, Coordinator

---

## Format Guide

### Cada entrada debe incluir:

```markdown
## [Version] - YYYY-MM-DD

### Added
- Nuevas características
- Nuevos archivos
- Nuevas dependencias

### Changed
- Cambios en funcionalidad existente
- Cambios en estructura
- Mejoras

### Fixed
- Bug fixes
- Correcciones

### Removed
- Funcionalidad deprecada
- Archivos removidos
- Dependencias removidas

### Security
- Vulnerabilidades parcheadas
- Cambios de seguridad
```

---

## Notas Importantes

### Cuando Actualizar CHANGELOG.md

1. **Después de agregar una nueva feature**: Documentar en sección "Added"
2. **Después de cambiar funcionalidad**: Documentar en "Changed"
3. **Después de un bug fix**: Documentar en "Fixed"
4. **Después de deprecar algo**: Documentar en "Deprecated" y luego en "Removed"
5. **Cambios de seguridad**: SIEMPRE en sección "Security" (crítico)

### Versionado

Seguimos Semantic Versioning:
- **MAJOR.MINOR.PATCH**
  - MAJOR: Cambios incompatibles con versiones anteriores
  - MINOR: Nuevas características, compatible con anteriores
  - PATCH: Bug fixes, compatible con anteriores
  - **UNRELEASED**: Cambios pendientes de release

---

**Last Updated:** 2025-10-30
**Maintained by:** Master Orchestrator Agent
**Format:** Keep a Changelog v1.0.0
