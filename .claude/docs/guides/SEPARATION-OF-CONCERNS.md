# 🎯 Separación de Orquestación vs Documentación del Proyecto

Este documento clarifica la **separación clara y definitiva** entre la documentación de orquestación y la documentación del proyecto.

---

## 📍 REGLA FUNDAMENTAL

```
.claude/          → ORQUESTACIÓN
  ├── CLAUDE.md
  ├── agents/
  └── docs/      ← Templates, guías, referencias de orquestación
                   NO VA DOCUMENTACIÓN DEL PROYECTO

/docs/            → DOCUMENTACIÓN DEL PROYECTO
  ├── planning/
  ├── architecture/
  ├── testing/
  ├── security/
  ├── operation/
  ├── implementations/
  └── etc.        ← Solo documentación de features y del proyecto
                   NO VA ORQUESTACIÓN
```

---

## 📚 ¿QUÉ VA EN `.CLAUDE/DOCS/`?**

**Solo material de referencia para la ORQUESTACIÓN:**

- `README.md` - Guía completa de cómo funciona el sistema de orquestación
- `TEMPLATE-*.md` - Templates para usar en nuevas implementaciones
- `DESIGN_VALIDATION_FLOW.md` - Cómo funciona la validación de diseño
- `DOCUMENTATION_LOCATIONS.md` - Dónde cada especialista guarda su documentación
- `SEPARATION-OF-CONCERNS.md` - Este documento

**Propósito:** Referencia interna para el agente maestro y especialistas

**Quién accede:** Sistema de orquestación, especialistas

**Actualización:** Solo cuando cambia el SISTEMA de orquestación

---

## 📚 ¿QUÉ VA EN `/DOCS/`?**

**Solo documentación del PROYECTO y sus FEATURES:**

- `/planning/` - Planes de features (generado por Planner)
- `/architecture/` - Diseños arquitectónicos (generado por Architect)
- `/validation/` - Reportes de validación (generado por Validators)
- `/design-validation/` - Reportes de Design Consistency Validator
- `/integration/` - Documentación de integraciones (generado por Integration Engineer)
- `/testing/` - Planes y resultados de testing (generado por QA Validator)
- `/security/` - Auditorías de seguridad (generado por Security Specialist)
- `/operation/` - Guías operacionales (generado por Documenter)
- `/coordination/` - Reportes finales (generado por Coordinator)
- `/implementations/` - Historiales de implementaciones (uno por feature)
- `/guides/` - Guías generales del proyecto

**Propósito:** Documentación de features, arquitectura y operación del proyecto

**Quién accede:** Desarrolladores, usuarios del proyecto, stakeholders

**Actualización:** Cuando se completan features o hay cambios en el proyecto

---

## 🚫 ERRORES COMUNES A EVITAR

### ❌ MAL: Poner template en /docs/

```
/docs/implementations/
└── TEMPLATE-implementation-overview.md    ← ❌ INCORRECTO
```

**Problema:** Mezcla orquestación con documentación del proyecto

**Solución:** El template va en `.claude/docs/TEMPLATE-implementation-overview.md`

---

### ❌ MAL: Poner guía de orquestación en /docs/

```
/docs/
└── HOW-TO-ORCHESTRATE.md                 ← ❌ INCORRECTO
```

**Problema:** Contamina la documentación del proyecto

**Solución:** Va en `.claude/docs/README.md`

---

### ❌ MAL: Poner referencias de especialistas en /docs/

```
/docs/
└── AGENTS-REFERENCE.md                   ← ❌ INCORRECTO
```

**Problema:** Es documentación de orquestación, no del proyecto

**Solución:** Va en `.claude/docs/` o en `.claude/agents/`

---

## ✅ FLUJO CORRECTO

### Cuando se crea una nueva FEATURE

1. **Orquestación (`/.claude/`)**
   - Agente Maestro crea documento de implementación usando template de `.claude/docs/TEMPLATE-implementation-overview.md`
   - Document va en `/docs/implementations/{feature-name}/implementation-overview.md`

2. **Durante la implementación**
   - Specialists generan documentación (planes, diseños, reportes, etc.)
   - TODO va en `/docs/` en su carpeta correspondiente:
     - Planner → `/docs/planning/`
     - Architect → `/docs/architecture/`
     - QA → `/docs/testing/`
     - Security → `/docs/security/`
     - Etc.

3. **Al completar**
   - Documenter crea guías operacionales en `/docs/operation/`
   - Coordinator genera reportes finales en `/docs/coordination/`
   - CHANGELOG.md es actualizado en raíz

4. **Orquestación NUNCA contamina /docs/**
   - La orquestación queda completamente en `.claude/`
   - `/docs/` solo contiene documentación de features y proyecto

---

## 📊 Tabla Comparativa

| Aspecto | `.claude/` | `/docs/` |
|--------|-----------|---------|
| **Propósito** | Orquestación | Documentación del Proyecto |
| **Acceso** | Sistema de orquestación | Desarrolladores, usuarios |
| **Contenido** | CLAUDE.md, agents/, docs/ | Features, planes, diseños, guías |
| **Templates** | ✅ Sí (en `.claude/docs/`) | ❌ No |
| **Guías de cómo invocar especialistas** | ✅ Sí | ❌ No |
| **Historiales de features** | ❌ No | ✅ Sí |
| **Cambios frecuentes** | Solo si cambia orquestación | Constantemente (nuevas features) |
| **Versionado en CHANGELOG** | ❌ No | ✅ Sí |

---

## 🔒 Validación de Separación

Usa este checklist para verificar que todo está en el lugar correcto:

### `.claude/docs/` debe contener:
- [ ] README.md - Guía de orquestación
- [ ] TEMPLATE-implementation-overview.md - Template para features
- [ ] DESIGN_VALIDATION_FLOW.md - Cómo valida el Design Validator
- [ ] DOCUMENTATION_LOCATIONS.md - Dónde documenta cada especialista
- [ ] SEPARATION-OF-CONCERNS.md - Este documento
- [ ] ¿Nada más? ✓

### `/docs/` debe contener:
- [ ] /implementations/ - Historiales de features
- [ ] /planning/ - Planes de features
- [ ] /architecture/ - Diseños
- [ ] /testing/ - Testing
- [ ] /security/ - Seguridad
- [ ] /operation/ - Guías operacionales
- [ ] /coordination/ - Reportes finales
- [ ] /guides/ - Guías generales
- [ ] CHANGELOG.md - Control de versiones
- [ ] ¿Nada de orquestación? ✓

---

## 🎯 Beneficios de esta Separación

1. **Claridad:** Sabe exactamente dónde buscar cada tipo de documentación
2. **Mantenimiento:** Cambios en orquestación no afectan documentación del proyecto
3. **Escalabilidad:** Proyecto crece sin contaminar sistema de orquestación
4. **Trazabilidad:** Features y decisiones están documentadas en su propio espacio
5. **Colaboración:** Developers trabajan con `/docs/`, sistema de orquestación usa `.claude/`

---

**Esta separación es DEFINITIVA y NO NEGOCIABLE.**

Última actualización: 2025-10-30
