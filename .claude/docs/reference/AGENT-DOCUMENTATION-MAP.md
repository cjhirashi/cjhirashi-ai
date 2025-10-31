# 🗺️ Mapa de Documentación por Agente

**Propósito:** Clarificar exactamente qué documentos gestiona cada agente especialista y dónde.

Este documento es la **fuente única de verdad** sobre responsabilidades documentales.

---

## 📋 Tabla de Responsabilidades Rápida

| Agente | Documentos a Gestionar | Ubicación | Tipo de Actualización |
|--------|----------------------|-----------|----------------------|
| **Planner** | `plan-{proyecto}.md` | `/docs/` | Crea o actualiza roadmap maestro |
| **System Analyser** | `requirements.md` (Sección 3) | `/docs/implementations/{nombre}/` | Llena SOLO Sección 3 |
| **Architect** | `design-{proyecto}.md`, `diagrams-{proyecto}.md`, `adr-{proyecto}.md` | `/docs/architecture/` | Crea o actualiza diseño |
| **Design Consistency Validator** | Sección "Design Validation" | `/docs/implementations/{nombre}/implementation-overview.md` | Reporte de validación |
| **Design Validator** | Sección "Design Validation" (alt.) | `/docs/implementations/{nombre}/implementation-overview.md` | Reporte de validación |
| **Coder** | Sección "Implementation" (código + APIs) | `/docs/implementations/{nombre}/implementation-overview.md` | Progreso de código e integraciones |
| **Code Reviewer** | Sección "Code Review" | `/docs/implementations/{nombre}/implementation-overview.md` | Reporte de revisión |
| **QA Validator** | Sección "QA Testing & Validation" | `/docs/implementations/{nombre}/implementation-overview.md` | Reporte de testing |
| **Security Specialist** | Sección "Security Audit" | `/docs/implementations/{nombre}/implementation-overview.md` | Reporte de auditoría |
| **Documenter** | Sección "Documentation" + `/docs/operation/{nombre}-*.md` | `/docs/implementations/{nombre}/` + `/docs/operation/` | Documentación final + guías |

---

## 🔍 Detalles por Agente

### 1️⃣ PLANNER

**Fase:** FASE 1 (Planificación)

**Documentos a Gestionar:**

```
/docs/
└── plan-{proyecto}.md
```

**Responsabilidades:**
- Crea `plan-{proyecto}.md` análizando estado ACTUAL del proyecto (si no existe)
- Actualiza `plan-{proyecto}.md` con nueva integración (si existe)
- Contiene: Visión, Fases, Timeline, Riesgos, Dependencias, Estado

**Interacción con otros:**
- Lee: `requirements.md` completado por System Analyser
- Actualiza: `plan-{proyecto}.md` maestro

---

### 2️⃣ SYSTEM ANALYSER

**Fase:** FASE 1 (Planificación)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── requirements.md (SOLO Sección 3)
```

**Responsabilidades:**
- **SOLO llena Sección 3** de `requirements.md`: "Análisis de Viabilidad"
- Secciones 1, 2, 4 ya están llenas por Planner
- Sección 5 se llena después

**Subsecciones que llena (Sección 3):**
- 3.1: Análisis del Sistema Actual
- 3.2: Investigación de Documentación Oficial
- 3.3: Análisis de Proyectos GitHub
- 3.4: Evaluación de Riesgos Técnicos
- 3.5: Recomendación de Viabilidad
- 3.6: Conclusión

**Interacción con otros:**
- Lee: Secciones 1-2-4 del `requirements.md` completadas por Planner
- Actualiza: Sección 3 de `requirements.md`
- Entrega a: Usuario para validación

---

### 3️⃣ ARCHITECT

**Fase:** FASE 2 (Diseño)

**Documentos a Gestionar:**

```
/docs/architecture/
├── design-{proyecto}.md
├── diagrams-{proyecto}.md
└── adr-{proyecto}.md
```

**Responsabilidades:**
- Crea `design-{proyecto}.md` analizando arquitectura ACTUAL (si no existe)
- Actualiza `design-{proyecto}.md` con nueva arquitectura (si existe)
- Crea `diagrams-{proyecto}.md` con Mermaid (si no existe)
- Actualiza `diagrams-{proyecto}.md` con nuevos componentes (si existe)
- Crea `adr-{proyecto}.md` para Architecture Decision Records (si no existe)
- Actualiza `adr-{proyecto}.md` con nuevas decisiones (si existe)

**Contenido por documento:**

**design-{proyecto}.md:**
- Arquitectura general del proyecto
- Patrones utilizados
- Decisiones arquitectónicas
- Componentes principales
- Integración de nuevas features

**diagrams-{proyecto}.md:**
- Diagramas Mermaid de:
  - Flujos de datos
  - Interacciones de componentes
  - Arquitectura de sistemas
  - Diagramas de estados (si aplica)

**adr-{proyecto}.md:**
- Architecture Decision Records (ADRs)
- Formato: Contexto → Decisión → Consecuencias
- Historial de decisiones arquitectónicas

**Interacción con otros:**
- Lee: `requirements.md` completado
- Entrega a: Design Consistency Validator para validación

---

### 4️⃣ DESIGN CONSISTENCY VALIDATOR

**Fase:** FASE 2 (Diseño)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "Design Validation"
```

**Responsabilidades:**
- Valida diseño del Architect contra documentación oficial y código actual
- Llena sección "Design Validation" con reporte de validación
- Status: APPROVED ✅ o REQUIRES CHANGES ⚠️
- Puede rechazar diseño si hay incompatibilidades

**Contenido de "Design Validation":**
- Fecha de validación
- Checklist de validación
- Problemas encontrados (si aplica)
- Compatibilidad con código actual
- Status final
- Recomendaciones

**Interacción con otros:**
- Lee: Diseño de Architect
- Escribe: Sección "Design Validation" de `implementation-overview.md`
- Entrega a: Architect (si requiere cambios) o Coder (si aprueba)

---

### 5️⃣ DESIGN VALIDATOR

**Fase:** FASE 2 (Diseño)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "Design Validation" (alternativo)
```

**Responsabilidades:**
- **SIMILAR A Design Consistency Validator** pero con enfoque más amplio
- Valida contra documentación oficial oficial, GitHub, y PoCs
- Llena sección "Design Validation" con hallazgos detallados
- Status: APPROVED ✅ o REQUIRES CHANGES ⚠️

**Contenido de "Design Validation":**
- Documentación oficial revisada
- Proyectos GitHub validados
- Matriz de compatibilidad
- Análisis de riesgos
- PoC findings (si aplica)
- Status final

**Nota:** El proyecto usa **Design Consistency Validator** preferentemente. Design Validator es alternativo.

**Interacción con otros:**
- Lee: Diseño de Architect
- Escribe: Sección "Design Validation" de `implementation-overview.md`
- Entrega a: Architect (si requiere cambios) o Coder (si aprueba)

---

### 6️⃣ CODER

**Fase:** FASE 3 (Implementación)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "Code Implementation"
```

**Responsabilidades:**
- Implementa código limpio y bien documentado
- Llena sección "Code Implementation" con progreso
- Actualiza documento cada que termina un componente
- Responsable de calidad y legibilidad del código

**Contenido de "Code Implementation":**
- Componentes creados
- Módulos implementados
- Archivos modificados
- Testing completado
- Status de completitud
- Notas de implementación

**Interacción con otros:**
- Lee: Diseño validado de Design Consistency Validator
- Escribe: Sección "Code Implementation" de `implementation-overview.md`
- Entrega a: Code Reviewer para revisión

---

### 7️⃣ CODE REVIEWER

**Fase:** FASE 3 (Implementación)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "Code Review"
```

**Responsabilidades:**
- Revisa código implementado por Coder (incluyendo integraciones de API)
- Llena sección "Code Review" con reporte de revisión
- Máximo 2 validaciones (si hay problemas nuevos en 2da → escalada a Architect)
- Status: APPROVED ✅ o REQUIRES CHANGES ⚠️

**Contenido de "Code Review":**
- Fecha de revisión
- Componentes revisados
- Problemas encontrados (si aplica)
- Checklist de validación
- Status (APPROVED / REQUIRES CHANGES / ESCALATED)
- Plan de corrección (si aplica)
- Notas importantes

**Interacción con otros:**
- Lee: Código de Coder (incluyendo integraciones)
- Escribe: Sección "Code Review" de `implementation-overview.md`
- Itera con: Coder (máximo 2 veces)
- Escalada a: Architect (si problemas nuevos en revisión 2)
- Entrega a: QA Validator (si aprueba)

---

### 8️⃣ QA VALIDATOR

**Fase:** FASE 4 (Validación)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "QA Testing & Validation"
```

**Responsabilidades:**
- Testa exhaustivamente la implementación
- Llena sección "QA Testing & Validation" con reporte de testing
- Valida casos edge, performance, y seguridad básica
- Reporte: APPROVED ✅ o ISSUES FOUND ⚠️

**Contenido de "QA Testing & Validation":**
- Fecha de testing
- Plan de testing ejecutado
- Casos de prueba cubiertos
- Resultados de validación
- Issues encontrados (si aplica)
- Benchmarks y métricas
- Status final

**Interacción con otros:**
- Lee: Código revisado por Code Reviewer
- Escribe: Sección "QA Testing & Validation" de `implementation-overview.md`
- Reporta a: Code Reviewer o Coder (si encuentra bugs críticos)
- Entrega a: Security Specialist (si testing aprueba)

---

### 9️⃣ SECURITY SPECIALIST

**Fase:** FASE 4 (Validación)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "Security Audit"
```

**Responsabilidades:**
- Audita seguridad de la implementación
- Llena sección "Security Audit" con reporte de auditoría
- Valida manejo de credenciales, datos sensibles, compliance
- Reporte: APPROVED ✅ o ISSUES FOUND ⚠️

**Contenido de "Security Audit":**
- Fecha de auditoría
- Checklist de seguridad
- Vulnerabilidades encontradas (si aplica)
- Hallazgos de auditoría
- Recomendaciones de seguridad
- Status de compliance
- Status final

**Interacción con otros:**
- Lee: Código testeado por QA Validator
- Escribe: Sección "Security Audit" de `implementation-overview.md`
- Reporta a: Coder (si encuentra issues críticas)
- Entrega a: Documenter (si auditoría aprueba)

---

### 🔟 DOCUMENTER

**Fase:** FASE 5 (Documentación)

**Documentos a Gestionar:**

```
/docs/implementations/{nombre-feature}/
└── implementation-overview.md
    └── Sección: "Documentation"

/docs/operation/
├── {nombre-feature}-guide.md
├── {nombre-feature}-setup.md
├── {nombre-feature}-troubleshooting.md
└── {nombre-feature}-diagrams.md
```

**Responsabilidades:**
- Crea documentación de usuario y operación
- Llena sección "Documentation" en `implementation-overview.md`
- Crea documentación permanente en `/docs/operation/`
- Genera diagramas Mermaid para visualizar flujos

**Documentos que crea/actualiza:**

**implementation-overview.md → Sección "Documentation":**
- Guías de usuario creadas (referencias)
- Diagramas Mermaid generados (referencias)
- Setup e instalación documentado
- Troubleshooting coverage
- Links a documentación operacional

**{nombre-feature}-guide.md** (operacional permanente)
- Descripción general
- Cómo funciona (con diagrama)
- Configuración inicial
- Casos de uso comunes
- Ejemplos prácticos

**{nombre-feature}-setup.md** (operacional permanente)
- Instalación paso a paso
- Variables de entorno
- Dependencias necesarias
- Verificación de setup

**{nombre-feature}-troubleshooting.md** (operacional permanente)
- Errores comunes
- Causas y soluciones
- Tips de debugging
- FAQ

**{nombre-feature}-diagrams.md** (operacional permanente)
- Diagramas Mermaid de:
  - Flujos de datos
  - Interacciones de usuario
  - Arquitectura de feature
  - Estados y transiciones

**Interacción con otros:**
- Lee: Código, diseño, resultados de testing y seguridad
- Escribe: Sección "Documentation" de `implementation-overview.md`
- Crea: 4 documentos nuevos en `/docs/operation/`
- Entrega a: Usuario (documentación completada)

---

## 📊 Vista por Documento

### `/docs/` (Sistema-wide)

```
plan-{proyecto}.md
  └── Gestiona: Planner
      - Crea si no existe (analizando estado actual)
      - Actualiza si existe (con nueva integración)
```

---

### `/docs/architecture/`

```
design-{proyecto}.md
  └── Gestiona: Architect
      - Crea si no existe (analizando arquitectura actual)
      - Actualiza si existe (con nuevo diseño)

diagrams-{proyecto}.md
  └── Gestiona: Architect
      - Crea si no existe (analizando diagramas actuales)
      - Actualiza si existe (con nuevos componentes)

adr-{proyecto}.md
  └── Gestiona: Architect
      - Crea si no existe (analizando decisiones actuales)
      - Actualiza si existe (con nuevas decisiones)
```

---

### `/docs/implementations/{nombre-feature}/`

```
requirements.md
  ├── Sección 1 & 2 & 4: Planner (FASE 1)
  └── Sección 3: System Analyser (FASE 1)
  └── Sección 5: Planner (después System Analyser)

implementation-overview.md
  ├── Sección "Design Validation": Design Consistency Validator (FASE 2)
  ├── Sección "Implementation": Coder (FASE 3) - código + APIs
  ├── Sección "Code Review": Code Reviewer (FASE 3)
  ├── Sección "QA Testing & Validation": QA Validator (FASE 4)
  ├── Sección "Security Audit": Security Specialist (FASE 4)
  └── Sección "Documentation": Documenter (FASE 5)
```

---

### `/docs/operation/`

```
{nombre-feature}-guide.md
  └── Gestiona: Documenter (FASE 5)
      - Guía de usuario
      - Cómo funciona
      - Configuración

{nombre-feature}-setup.md
  └── Gestiona: Documenter (FASE 5)
      - Setup paso a paso
      - Variables de entorno
      - Verificación

{nombre-feature}-troubleshooting.md
  └── Gestiona: Documenter (FASE 5)
      - Errores comunes
      - Soluciones
      - Debugging

{nombre-feature}-diagrams.md
  └── Gestiona: Documenter (FASE 5)
      - Diagramas Mermaid
      - Flujos visuales
      - Arquitectura visual
```

---

## 🎯 Matriz de Decisión: ¿Quién Actualiza Qué?

```
Necesito actualizar...          ¿Quién?              ¿Dónde?
─────────────────────────────────────────────────────────────
Roadmap del proyecto            Planner             /docs/
Arquitectura general            Architect           /docs/architecture/
Validación de diseño            Design Consistency  /docs/implementations/
                                Validator
Código + integraciones APIs     Coder               /docs/implementations/
Revisión de código              Code Reviewer       /docs/implementations/
Testing y validación            QA Validator        /docs/implementations/
Auditoría de seguridad          Security            /docs/implementations/
                                Specialist
Documentación de usuario        Documenter          /docs/implementations/
                                                    + /docs/operation/
```

---

## ⚠️ Conflictos Identificados y Resueltos

### Conflicto: Coder vs Integration Engineer

**Problema:** Ambos agentes tenían responsabilidades solapadas en implementación de código e integraciones de API

**Solución:** Consolidar ambas responsabilidades en un único agente:
- **Coder** → Responsable de "Implementation" (código + integraciones de APIs)
- **Integration Engineer** → ❌ ELIMINADO (responsabilidades absorbidas por Coder)

**Razón:** El Coder es el especialista más adecuado para manejar tanto la implementación de código como la integración de APIs externas, manteniendo una visión unificada del sistema y evitando desconexiones entre código e integraciones.

**Estado:** ✅ RESUELTO (Consolidación completa)

---

### Conflicto: Design Consistency Validator vs Design Validator

**Problema:** Ambos validan diseño

**Solución:**
- Design Consistency Validator es PRIMARY (validación enfocada)
- Design Validator es ALTERNATIVO (validación más amplia)
- Ambos llenan sección "Design Validation"
- Usar uno u otro según necesidad

**Estado:** ✅ RESUELTO

---

## 📝 Notas Importantes

1. **Documentación Viva:** Cada agente verifica si documento existe
   - Si NO existe → Crea analizando estado ACTUAL
   - Si SÍ existe → Actualiza/complementa con nueva información

2. **Responsabilidad Clara:** Cada sección tiene UN SOLO agente responsable

3. **No Duplicación:** Cada documento tiene responsables bien definidos

4. **Progresión de Fases:** Documentos evolucionan a través de las 5 fases

---

**Última actualización:** 2025-10-31
**Versión:** 1.1 - Consolidación de Coder e Integration Engineer
**Agentes:** 10 especialistas (Integration Engineer consolidado en Coder)
