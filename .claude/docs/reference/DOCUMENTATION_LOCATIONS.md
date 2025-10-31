# 📍 Ubicación de Documentación por Agente

**Referencia rápida: Dónde guardar tu documentación**

## 🎯 Planner
**Carpeta:** `/docs/planning/`
```
plan-{proyecto}.md                    ← Plan general
timeline-{proyecto}.md                ← Cronograma y fases
risks-{proyecto}.md                   ← Análisis de riesgos
dependencies-{proyecto}.md            ← Dependencias entre tareas
```

## 🏗️ Architect
**Carpeta:** `/docs/architecture/`
```
design-{proyecto}.md                  ← Diseño general
diagrams-{proyecto}.md                ← Diagramas y visuales
patterns-{proyecto}.md                ← Patrones de diseño usados
interfaces-{proyecto}.md              ← Definición de interfaces
decisions-{proyecto}.md               ← Decisiones arquitectónicas
```

## 🔍 Design Validator
**Carpeta:** `/docs/validation/`
```
validation-report-{proyecto}.md       ← Reporte de validación
compatibility-matrix-{proyecto}.md    ← Matriz de compatibilidad
risks-analysis-{proyecto}.md          ← Análisis de riesgos técnicos
poc-findings-{proyecto}.md            ← Hallazgos del PoC
```

## 🔧 Integration Engineer
**Carpeta:** `/docs/integration/`
```
implementation-{proyecto}.md          ← Detalles de implementación
api-docs-{proyecto}.md                ← Documentación de APIs
setup-guide-{proyecto}.md             ← Guía de setup e instalación
troubleshooting-{proyecto}.md         ← Troubleshooting común
```

## ✅ QA Validator
**Carpeta:** `/docs/testing/`
```
test-plan-{proyecto}.md               ← Plan de testing
test-cases-{proyecto}.md              ← Casos de prueba detallados
validation-report-{proyecto}.md       ← Reporte de validación
benchmarks-{proyecto}.md              ← Benchmarks y performance
```

## 🔐 Security Specialist
**Carpeta:** `/docs/security/`
```
security-audit-{proyecto}.md          ← Auditoría de seguridad
threat-model-{proyecto}.md            ← Modelo de amenazas
compliance-report-{proyecto}.md       ← Reporte de compliance
incident-response-{proyecto}.md       ← Plan de respuesta a incidentes
```

## 🎭 Coordinator
**Carpeta:** `/docs/coordination/`
```
status-report-{proyecto}.md           ← Reporte de estado
communication-log-{proyecto}.md       ← Log de comunicaciones
blockers-tracking-{proyecto}.md       ← Tracking de bloqueos
handoff-checklist-{proyecto}.md       ← Checklist de handoffs
```

---

## 📋 Ejemplo Completo: "Storage de Archivos"

```
/docs/planning/
└── plan-storage-files.md

/docs/architecture/
├── design-storage-files.md
├── diagrams-storage-files.md
└── decisions-storage-files.md

/docs/validation/
└── validation-report-storage-files.md

/docs/integration/
├── implementation-storage-files.md
├── api-docs-storage-files.md
└── setup-guide-storage-files.md

/docs/testing/
├── test-plan-storage-files.md
└── test-cases-storage-files.md

/docs/security/
├── security-audit-storage-files.md
└── threat-model-storage-files.md

/docs/coordination/
└── status-report-storage-files.md
```

---

## ✅ Checklist Rápido

Antes de crear documentación, pregúntate:

- [ ] ¿Quién soy? (Planner, Architect, etc.)
- [ ] ¿Cuál es mi carpeta? (Ver tabla arriba)
- [ ] ¿Cuál es el tipo de documento? (plan, design, report, etc.)
- [ ] ¿Cuál es el nombre del proyecto? (storage-files, user-auth, etc.)
- [ ] ¿El nombre sigue: `{tipo}-{proyecto}.md`?
- [ ] ¿La documentación está en `/docs/`?

Si respondiste SÍ a todo → ✅ Listo para guardar

---

## 🚫 Lo que NO Debes Hacer

❌ No guardes documentación en `.claude/agents/` (es para agentes de orquestación)
❌ No guardes documentación en raíz (proyecto)
❌ No crees carpetas nuevas (usa las establecidas)
❌ No uses otros nombres de archivos (sigue la convención)

## ✅ Lo que SÍ Debes Hacer

✅ Guarda todo en `/docs/`
✅ Dentro de tu carpeta asignada
✅ Con nombre en formato: `{tipo}-{proyecto}.md`
✅ Sigue la estructura exacta
✅ Actualiza referencias cruzadas

---

**Referencia creada**: 2025-10-30
**Todos los agentes deben consultar esto antes de crear documentación**
