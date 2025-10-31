# 📍 Ubicación de Documentación - Referencia Actualizada

**ACTUALIZACIÓN IMPORTANTE:** Esta documentación ha sido actualizada para reflejar la nueva estructura de FASE 1 con requirements.md y plan.md como documentos centrales.

---

## 📊 FASE 1: Planificación

**Ubicación:** `/docs/implementations/{nombre-feature}/`

### Documentos Generados
```
/docs/implementations/{nombre-feature}/
├── README.md                ← Punto de entrada (resumen ejecutivo)
├── requirements.md          ← Análisis de requisitos + viabilidad (Planner + System Analyser)
└── plan.md                  ← Plan maestro consolidado (Planner)
```

**Especialistas:** Planner, System Analyser
**Responsables de Guardar:** Planner

---

## 🏗️ FASE 2: Diseño

**Ubicación:** `/docs/architecture/` (o `/docs/implementations/{nombre-feature}/` si prefieres centralizar)

### Documentos Generados
```
/docs/architecture/
├── design-{proyecto}.md              ← Diseño arquitectónico
├── diagrams-{proyecto}.md            ← Diagramas y visuales Mermaid
├── patterns-{proyecto}.md            ← Patrones de diseño usados
└── validation-design-{proyecto}.md   ← Reporte de validación de consistencia
```

**Especialistas:** Architect, Design Consistency Validator
**Responsables de Guardar:** Architect (validación integrada del Design Consistency Validator)

---

## 💻 FASE 3: Implementación

**Ubicación:** `/docs/implementations/{nombre-feature}/` o `/docs/integration/`

### Documentos Generados
```
/docs/implementations/{nombre-feature}/
├── implementation-overview.md  ← Overview de implementación
├── api-docs-{proyecto}.md      ← Documentación de APIs
└── code-review-{proyecto}.md   ← Reporte de revisión de código
```

**Especialistas:** Coder, Code Reviewer
**Responsables de Guardar:** Coder (actualizado con feedback de Code Reviewer)

---

## ✅ FASE 4: Validación

**Ubicación:** `/docs/testing/` y `/docs/security/`

### Documentos Generados
```
/docs/testing/
├── test-plan-{proyecto}.md           ← Plan de testing
├── test-cases-{proyecto}.md          ← Casos de prueba
└── validation-report-{proyecto}.md   ← Reporte de validación

/docs/security/
├── security-audit-{proyecto}.md      ← Auditoría de seguridad
├── threat-model-{proyecto}.md        ← Modelo de amenazas
└── incident-response-{proyecto}.md   ← Plan de respuesta a incidentes
```

**Especialistas:** QA Validator, Security Specialist
**Responsables de Guardar:** Cada uno en su carpeta

---

## 📚 FASE 5: Documentación

**Ubicación:** `/docs/operation/`

### Documentos Generados
```
/docs/operation/
├── user-guide-{proyecto}.md          ← Guía de uso
├── setup-guide-{proyecto}.md         ← Guía de setup
├── troubleshooting-{proyecto}.md     ← Troubleshooting y FAQ
└── architecture-diagrams-{proyecto}.md ← Diagramas Mermaid de operación
```

**Especialistas:** Documenter
**Responsables de Guardar:** Documenter

---

## 📋 Estructura General Simplificada

```
/docs/
├── /implementations/          ← Documentos centrales por feature (FASE 1)
│   └── {nombre-feature}/
│       ├── README.md
│       ├── requirements.md    ← CENTRAL: qué y por qué
│       └── plan.md            ← CENTRAL: cómo y cuándo
│
├── /architecture/             ← Diseño (FASE 2)
├── /integration/              ← Código (FASE 3) [opcional, puede ir en implementations]
├── /testing/                  ← Tests (FASE 4)
├── /security/                 ← Auditoría (FASE 4)
└── /operation/                ← Guías (FASE 5)
```

---

## 🎯 Convención de Nombres - ACTUALIZADA

**Patrón general:**
```
{tipo}-{proyecto}.md
```

**Ejemplos correctos:**
```
design-payment-system.md
implementation-auth-flow.md
validation-user-dashboard.md
test-plan-notification-engine.md
security-audit-api-endpoints.md
user-guide-admin-panel.md
```

**Ejemplos INCORRECTOS:**
```
PaymentSystem.md          ← No uses CamelCase
design.md                 ← No olvides el proyecto
my-design-v2.md          ← No agregues versiones al nombre
```

---

## ✅ Checklist Antes de Guardar

- [ ] ¿Sé qué FASE es? (1, 2, 3, 4 o 5)
- [ ] ¿Cuál es la carpeta correcta para mi fase?
- [ ] ¿El nombre sigue `{tipo}-{proyecto}.md`?
- [ ] ¿Está documentado qué es cada sección?
- [ ] ¿Hay referencias cruzadas a otros documentos?
- [ ] ¿Actualicé plan.md si es necesario?

---

## 🚫 Lo que NUNCA Debes Hacer

❌ Guardar documentación en `.claude/` (eso es para orquestación)
❌ Crear carpetas nuevas sin autorización del Maestro Orquestador
❌ Usar nombres de archivo arbitrarios
❌ Guardar documentación desorganizada en raíz
❌ Actualizar plan.md sin coordinar

## ✅ Lo que SÍ Debes Hacer

✅ Guardar en `/docs/` en la carpeta de tu fase
✅ Seguir convención de nombres `{tipo}-{proyecto}.md`
✅ Documentar claramente qué es cada sección
✅ Actualizar referencias cruzadas
✅ Mantener plan.md actualizado con progreso

---

## 📌 Nota Sobre FASE 1

**FASE 1 es especial** porque genera documentos centrales:
- `requirements.md` - qué se hace y por qué
- `plan.md` - cómo y cuándo se hace

Estos dos documentos son el **punto de referencia principal** para todo el proyecto. Todas las otras fases se basan en ellos.

---

**Última actualización:** 2025-10-31
**Versión:** 2.0 - Estructura actualizada para nueva FASE 1 (requirements + plan)
**Responsabilidad:** Todos los especialistas deben consultar antes de guardar
