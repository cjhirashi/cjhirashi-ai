# Documentación del Proyecto

Este directorio contiene toda la documentación técnica del proyecto, organizada por tipo y propósito.

## Estructura de Documentación

```
docs/
├── api/                 # Documentación de APIs y endpoints
├── architecture/        # Diseño y arquitectura del sistema
├── components/          # Documentación de componentes UI
├── database/            # Schema y queries de base de datos
├── guides/              # Tutoriales y guías de usuario
├── migrations/          # Guías de migración y breaking changes
├── security/            # Documentación de seguridad
├── testing/             # Estrategia y guías de testing
└── decisions/           # ADRs (Architecture Decision Records)
```

## Directorios

### 📡 `api/`
Documentación de APIs, endpoints y servicios externos.

**Contenido típico:**
- `endpoints.md` - Lista completa de endpoints
- `[resource]-api.md` - Documentación por recurso
- `authentication.md` - Cómo autenticar requests
- `openapi.yaml` - Especificación OpenAPI/Swagger

**Responsable:** Backend Developer

---

### 🏗️ `architecture/`
Documentos de diseño arquitectónico, decisiones de estructura y planes de implementación.

**Contenido típico:**
- `[feature]-architecture.md` - Diseño de features
- `[feature]-implementation.md` - Planes de implementación
- `diagrams/` - Diagramas de arquitectura
- `decisions/` - ADRs específicos de arquitectura

**Responsable:** Architecture Designer

---

### 🎨 `components/`
Documentación de componentes UI, props, uso y ejemplos.

**Contenido típico:**
- `[component-name].md` - Docs de componente individual
- `design-system.md` - Guía del design system
- `accessibility-guide.md` - Guía de accesibilidad

**Responsable:** Frontend Developer

---

### 💾 `database/`
Documentación del schema de base de datos, queries y migraciones.

**Contenido típico:**
- `schema.md` - Documentación del schema
- `queries.md` - Queries complejas documentadas
- `migrations/` - Guías de migración de BD

**Responsable:** Backend Developer

---

### 📚 `guides/`
Tutoriales, guías de usuario y how-tos.

**Contenido típico:**
- `getting-started.md` - Guía de inicio rápido
- `frontend-development.md` - Guía de desarrollo frontend
- `backend-development.md` - Guía de desarrollo backend
- `[feature]-tutorial.md` - Tutoriales específicos

**Responsable:** Documentation Writer

---

### 🔄 `migrations/`
Guías de migración, breaking changes y planes de rollback.

**Contenido típico:**
- `[feature]-migration.md` - Guía de migración específica
- `breaking-changes.md` - Lista de breaking changes
- `backward-compatibility.md` - Estrategia de compatibilidad
- `rollback-plan.md` - Planes de rollback

**Responsable:** Migration Specialist

---

### 🔒 `security/`
Documentación de seguridad, autenticación, autorización y vulnerabilidades.

**Contenido típico:**
- `authentication-flow.md` - Flujos de autenticación
- `authorization-model.md` - Modelo de permisos y roles
- `security-checklist.md` - Checklist de seguridad
- `vulnerabilities-prevention.md` - Prevención de vulnerabilidades
- `audit-logs.md` - Logs y auditoría

**Responsable:** Auth & Security Specialist

---

### 🧪 `testing/`
Estrategia de testing, guías y configuración de CI/CD.

**Contenido típico:**
- `testing-strategy.md` - Estrategia general de testing
- `running-tests.md` - Cómo ejecutar tests
- `writing-tests.md` - Guía para escribir tests
- `coverage-reports.md` - Reports de cobertura
- `ci-cd-setup.md` - Configuración de CI/CD

**Responsable:** Testing Specialist

---

### 📋 `decisions/`
Architecture Decision Records (ADRs) - documentación de decisiones técnicas importantes.

**Contenido típico:**
- `001-use-postgresql.md` - ADR individual
- `002-adopt-typescript.md` - ADR individual
- `template.md` - Template para nuevos ADRs

**Responsable:** Architecture Designer / Documentation Writer

**Formato de ADR:**
```markdown
# ADR [número]: [Título]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Descripción del problema y contexto]

## Decision
[Decisión tomada]

## Rationale
[Razones y justificación]

## Consequences
**Positive:**
- [Ventaja 1]

**Negative:**
- [Desventaja 1]

## Alternatives Considered
- [Alternativa 1]: [Por qué se descartó]
```

---

## Convenciones de Documentación

### Formato
- Todos los documentos en **Markdown** (`.md`)
- Usar sintaxis GitHub-flavored Markdown
- Incluir tabla de contenidos para docs largos (> 200 líneas)

### Naming
- `kebab-case` para nombres de archivo: `user-authentication.md`
- Nombres descriptivos y específicos
- Prefijos cuando sea apropiado: `adr-001-`, `tutorial-`, `api-`

### Estructura de Documentos
```markdown
# Título Principal

Breve descripción (1-2 párrafos)

## Sección 1

Contenido...

### Subsección 1.1

Contenido...

## Ejemplos

```code
ejemplo
```

## Referencias
- [Link relacionado]
```

### Code Blocks
- Especificar lenguaje: ` ```typescript`, ` ```bash`, ` ```json`
- Incluir comentarios explicativos
- Ejemplos deben ser funcionales y testeables

### Links
- Usar paths relativos para links internos: `[Schema](../database/schema.md)`
- Links absolutos solo para recursos externos
- Verificar que links no estén rotos

---

## Mantenimiento

### Actualización de Docs
- Actualizar docs cuando el código cambie
- Marcar docs obsoletas con `⚠️ DEPRECATED` si aplica
- Versionar docs importantes con fechas

### Review
- Docs son parte del code review
- Validar que ejemplos funcionen
- Verificar links y referencias

### Contribuir
1. Crear docs en el directorio apropiado
2. Seguir convenciones de naming y formato
3. Incluir ejemplos cuando sea posible
4. Actualizar este README si se agregan categorías nuevas

---

## Índice Rápido

### Para Desarrolladores Nuevos
1. [Getting Started](guides/getting-started.md) *(cuando exista)*
2. [Architecture Overview](architecture/) *(cuando exista)*
3. [Development Guides](guides/) *(cuando exista)*

### Para Usuarios de API
1. [API Documentation](api/) *(cuando exista)*
2. [Authentication](api/authentication.md) *(cuando exista)*

### Para Mantenedores
1. [Testing Strategy](testing/testing-strategy.md) *(cuando exista)*
2. [Security Guidelines](security/security-checklist.md) *(cuando exista)*
3. [Migration Guides](migrations/) *(cuando exista)*

---

## Agentes Responsables

Cada directorio tiene un agente especialista responsable:

| Directorio | Agente Responsable |
|------------|-------------------|
| `api/` | Backend Developer |
| `architecture/` | Architecture Designer |
| `components/` | Frontend Developer |
| `database/` | Backend Developer |
| `guides/` | Documentation Writer |
| `migrations/` | Migration Specialist |
| `security/` | Auth & Security Specialist |
| `testing/` | Testing Specialist |
| `decisions/` | Architecture Designer / Documentation Writer |

Ver `.claude/agents/` para más detalles sobre cada agente.
