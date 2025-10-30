# 📚 Estructura de Documentación del Proyecto

Esta es la **guía maestra de dónde guardar toda la documentación** generada por el equipo de especialistas.

## 📁 Estructura de Carpetas

```
/docs/
├── DOCUMENTATION_STRUCTURE.md     ← Esta guía
├── IMPLEMENTATION_ROADMAP.md      ← Roadmap general del proyecto
│
├── /planning/                     ← Planes y estimaciones
│   ├── {proyecto}-plan.md
│   ├── {proyecto}-timeline.md
│   ├── {proyecto}-risks.md
│   └── {proyecto}-dependencies.md
│
├── /architecture/                 ← Diseños arquitectónicos
│   ├── {proyecto}-design.md
│   ├── {proyecto}-diagrams.md
│   ├── {proyecto}-patterns.md
│   ├── {proyecto}-interfaces.md
│   └── {proyecto}-decisions.md
│
├── /validation/                   ← Validación de diseños
│   ├── {proyecto}-validation-report.md
│   ├── {proyecto}-compatibility-matrix.md
│   ├── {proyecto}-risks-analysis.md
│   └── {proyecto}-poc-findings.md
│
├── /integration/                  ← Documentación de implementación
│   ├── {proyecto}-implementation.md
│   ├── {proyecto}-api-docs.md
│   ├── {proyecto}-setup-guide.md
│   └── {proyecto}-troubleshooting.md
│
├── /testing/                      ← Planes y reportes de testing
│   ├── {proyecto}-test-plan.md
│   ├── {proyecto}-test-cases.md
│   ├── {proyecto}-validation-report.md
│   └── {proyecto}-benchmarks.md
│
├── /security/                     ← Documentación de seguridad
│   ├── {proyecto}-security-audit.md
│   ├── {proyecto}-threat-model.md
│   ├── {proyecto}-compliance-report.md
│   └── {proyecto}-incident-response.md
│
├── /coordination/                 ← Reportes de coordinación
│   ├── {proyecto}-status-report.md
│   ├── {proyecto}-communication-log.md
│   ├── {proyecto}-blockers-tracking.md
│   └── {proyecto}-handoff-checklist.md
│
├── /guides/                       ← Guías de usuario y desarrollo
│   ├── user-guide.md
│   ├── developer-guide.md
│   ├── setup-guide.md
│   └── troubleshooting.md
│
└── /agents/                       ← Documentación sobre agentes del PROYECTO
    └── (Cuando el proyecto tenga agentes, su documentación va aquí)
```

## 🎯 Agentes y Sus Carpetas

| Agente | Carpeta | Documentación |
|--------|---------|--------------|
| **Planner** 🎯 | `/docs/planning/` | Planes, timelines, riesgos, dependencias |
| **Architect** 🏗️ | `/docs/architecture/` | Diseños, diagramas, patrones, interfaces |
| **Design Validator** 🔍 | `/docs/validation/` | Reportes, matriz de compatibilidad, PoC |
| **Integration Engineer** 🔧 | `/docs/integration/` | Implementación, APIs, setup, troubleshooting |
| **QA Validator** ✅ | `/docs/testing/` | Planes, test cases, validación, benchmarks |
| **Security Specialist** 🔐 | `/docs/security/` | Auditoría, threat model, compliance, incidentes |
| **Coordinator** 🎭 | `/docs/coordination/` | Status reports, logs, blockers, handoffs |

## 📋 Convención de Nombres

Todos los archivos deben seguir este patrón:

```
{tipo-documento}-{nombre-proyecto}.md

Ejemplos:
- plan-storage-files.md
- design-advanced-permissions.md
- validation-report-analytics.md
- implementation-user-authentication.md
- test-plan-payment-system.md
- security-audit-api-endpoints.md
- status-report-mobile-app.md
```

## 🚀 Flujo de Documentación

```
Proyecto nuevo asignado
        ↓
Planner crea plan
  → /docs/planning/project-plan.md
        ↓
Architect diseña
  → /docs/architecture/project-design.md
        ↓
Design Validator valida
  → /docs/validation/project-validation-report.md
        ↓
Integration Engineer implementa
  → /docs/integration/project-implementation.md
        ↓
QA Validator testea
  → /docs/testing/project-test-plan.md
  → /docs/testing/project-validation-report.md
        ↓
Security Specialist audita
  → /docs/security/project-security-audit.md
        ↓
Coordinator reporta
  → /docs/coordination/project-status-report.md
```

## ✅ Reglas Clave

1. **TODO en `/docs/`** - Ninguna documentación de proyecto fuera de `/docs/`
2. **Estructura clara** - Cada tipo de documentación en su carpeta
3. **Nombres consistentes** - Patrón: `{tipo}-{proyecto}.md`
4. **Agentes orquestación en `.claude/agents/`** - NO van en `/docs/`
5. **README único en raíz** - Solo el README.md principal del proyecto en la raíz

## 🔍 Checklist Pre-Commit

Antes de hacer commit de documentación:

- [ ] ¿La documentación está en `/docs/`?
- [ ] ¿Está en la carpeta correcta según el agente?
- [ ] ¿El nombre sigue la convención `{tipo}-{proyecto}.md`?
- [ ] ¿Contiene información clara y actualizada?
- [ ] ¿Las referencias a otras docs son correctas?
- [ ] ¿No hay documentación fuera de `/docs/`?

## 📝 Ejemplos de Estructura Completa

### Para Feature: "Sistema de Almacenamiento de Archivos"

```
/docs/
├── /planning/
│   └── plan-storage-files.md
├── /architecture/
│   ├── design-storage-files.md
│   ├── diagrams-storage-files.md
│   └── decisions-storage-files.md
├── /validation/
│   ├── validation-report-storage-files.md
│   └── compatibility-matrix-storage-files.md
├── /integration/
│   ├── implementation-storage-files.md
│   ├── api-docs-storage-files.md
│   └── setup-guide-storage-files.md
├── /testing/
│   ├── test-plan-storage-files.md
│   ├── test-cases-storage-files.md
│   └── validation-report-storage-files.md
├── /security/
│   ├── security-audit-storage-files.md
│   └── threat-model-storage-files.md
└── /coordination/
    └── status-report-storage-files.md
```

### Para Feature: "Autenticación de Usuarios"

```
/docs/
├── /planning/
│   ├── plan-user-authentication.md
│   ├── timeline-user-authentication.md
│   └── risks-user-authentication.md
├── /architecture/
│   ├── design-user-authentication.md
│   └── interfaces-user-authentication.md
├── /validation/
│   └── validation-report-user-authentication.md
├── /integration/
│   ├── implementation-user-authentication.md
│   └── setup-guide-user-authentication.md
├── /testing/
│   ├── test-cases-user-authentication.md
│   └── benchmarks-user-authentication.md
├── /security/
│   ├── security-audit-user-authentication.md
│   ├── threat-model-user-authentication.md
│   └── compliance-report-user-authentication.md
└── /coordination/
    └── status-report-user-authentication.md
```

## 🚫 Lo que NO Va en `/docs/`

- Documentación de agentes de orquestación (va en `.claude/agents/`)
- README del proyecto (va en raíz como `README.md`)
- Configuración del proyecto (va en raíz como `.env.example`, `package.json`, etc.)
- Código fuente (va en `src/`, `lib/`, `components/`, etc.)

## 🚫 Lo que SÍ Va en `/docs/`

- Todos los planes creados por Planner
- Todos los diseños creados por Architect
- Todos los reportes de validación
- Toda implementación documentada
- Todos los casos de prueba y reportes
- Toda auditoría de seguridad
- Todos los reportes de coordinación
- Guías de usuario y desarrollo

---

**Versión**: 1.0
**Creada**: 2025-10-30
**Última actualización**: 2025-10-30

Esta estructura garantiza que toda la documentación del proyecto esté **organizada, clasificada y fácil de encontrar**.
