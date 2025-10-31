# 🎭 Diagrama de Workflow de Orquestación Completa

Este documento contiene el diagrama visual completo del flujo de orquestación multi-especialista.

**Tema:** Fondo oscuro con colores vibrantes y texto claro para máxima legibilidad.

---

## 📊 Flujo Completo de Orquestación (5 Fases)

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    START["👤 Usuario<br/>Solicita Feature"]
    CLARITY["📋 VALIDACIÓN<br/>DE CLARIDAD"]
    PHASE1["🎯 FASE 1<br/>PLANIFICACIÓN"]
    PLANNER["🎯 PLANNER"]
    SYSTEM_A["🔬 SYSTEM ANALYSER"]
    USER_V1["✅ Usuario Valida"]
    PHASE2["🏗️ FASE 2<br/>DISEÑO"]
    ARCHITECT["🏗️ ARCHITECT"]
    DESIGN_V["✅ DESIGN VALIDATOR"]
    USER_V2["✅ Usuario Valida"]
    PHASE3["💻 FASE 3<br/>IMPLEMENTACIÓN"]
    CODER["💻 CODER<br/>Código + APIs"]
    CODE_REV["🔍 CODE REVIEWER"]
    USER_V3["✅ Usuario Valida"]
    PHASE4["✅ FASE 4<br/>VALIDACIÓN"]
    QA["✅ QA VALIDATOR"]
    SECURITY["🔐 SECURITY"]
    USER_V4["✅ Usuario Valida"]
    PHASE5["📚 FASE 5<br/>DOCUMENTACIÓN"]
    DOC["📚 DOCUMENTER"]
    USER_FINAL["✅ Usuario Valida"]
    FINAL["✨ COMPLETADA"]
    END["🎉 Producción"]

    START --> CLARITY
    CLARITY -->|Confirmado| PHASE1
    CLARITY -->|Requiere aclaración| START
    PHASE1 --> PLANNER
    PLANNER --> SYSTEM_A
    SYSTEM_A --> USER_V1
    USER_V1 -->|Aprobado| PHASE2
    USER_V1 -->|Rechazado| PLANNER
    PHASE2 --> ARCHITECT
    ARCHITECT --> DESIGN_V
    DESIGN_V -->|Cambios| ARCHITECT
    DESIGN_V -->|Aprobado| USER_V2
    USER_V2 -->|Aprobado| PHASE3
    USER_V2 -->|Rechazado| ARCHITECT
    PHASE3 --> CODER
    CODER --> CODE_REV
    CODE_REV -->|Aprobado| USER_V3
    CODE_REV -->|Cambios| CODER
    USER_V3 -->|Aprobado| PHASE4
    USER_V3 -->|Rechazado| CODER
    PHASE4 --> QA
    QA -->|Bugs| CODER
    QA -->|OK| SECURITY
    SECURITY -->|Issues| CODER
    SECURITY -->|OK| USER_V4
    USER_V4 -->|Aprobado| PHASE5
    USER_V4 -->|Rechazado| QA
    PHASE5 --> DOC
    DOC --> USER_FINAL
    USER_FINAL -->|Aprobado| FINAL
    USER_FINAL -->|Rechazado| DOC
    FINAL --> END
```

---

## 🔄 Flujo Detallado por Fase

### FASE 1: PLANIFICACIÓN ✍️

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    START["Usuario<br/>solicita"]
    CLARITY["📋 Validación<br/>Claridad"]
    PLAN1["PLANNER:<br/>requirements.md"]
    PLAN2["PLANNER:<br/>plan.md"]
    ANALYZER["SYSTEM ANALYSER:<br/>Sección 3"]
    USER_CHECK1["✅ Usuario<br/>Valida"]
    PHASE2["→ FASE 2"]

    START --> CLARITY
    CLARITY --> PLAN1
    PLAN1 --> PLAN2
    PLAN2 --> ANALYZER
    ANALYZER --> USER_CHECK1
    USER_CHECK1 --> PHASE2
    USER_CHECK1 -.->|Rechazado| PLAN1
```

**Documentos generados en FASE 1:**
- ✅ `/docs/implementations/{nombre}/requirements.md`
- ✅ `/docs/plan-{proyecto}.md`

---

### FASE 2: DISEÑO 🏗️

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    INPUT["requirements.md<br/>validado"]
    ARCH["ARCHITECT:<br/>design.md"]
    VALID["VALIDATOR:<br/>Consistencia"]
    USER_CHECK2["✅ Usuario<br/>Valida"]
    PHASE3["→ FASE 3"]

    INPUT --> ARCH
    ARCH --> VALID
    VALID -->|Problemas| ARCH
    VALID -->|OK| USER_CHECK2
    USER_CHECK2 --> PHASE3
    USER_CHECK2 -.->|Rechazado| ARCH
```

**Documentos generados en FASE 2:**
- ✅ `/docs/architecture/design-{proyecto}.md`
- ✅ `/docs/architecture/diagrams-{proyecto}.md`
- ✅ `/docs/architecture/adr-{proyecto}.md`

---

### FASE 3: IMPLEMENTACIÓN 💻

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    INPUT["Diseño<br/>validado"]
    CODER["CODER:<br/>Código + APIs"]
    REV["CODE REVIEWER:<br/>Validación"]
    USER_CHECK3["✅ Usuario<br/>Valida"]
    PHASE4["→ FASE 4"]

    INPUT --> CODER
    CODER --> REV
    REV -->|Cambios| CODER
    REV -->|OK| USER_CHECK3
    USER_CHECK3 --> PHASE4
    USER_CHECK3 -.->|Rechazado| CODER
```

**Documentos generados en FASE 3:**
- ✅ `/docs/implementations/{nombre}/` - Implementation (código + APIs)
- ✅ `/docs/implementations/{nombre}/` - Code Review

---

### FASE 4: VALIDACIÓN ✅

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    INPUT["Código<br/>revisado"]
    QA["QA VALIDATOR:<br/>Testing"]
    SECURITY["SECURITY:<br/>Auditoría"]
    USER_CHECK4["✅ Usuario<br/>Valida"]
    PHASE5["→ FASE 5"]

    INPUT --> QA
    QA -->|Bugs| INPUT
    QA -->|OK| SECURITY
    SECURITY -->|Issues| INPUT
    SECURITY -->|OK| USER_CHECK4
    USER_CHECK4 --> PHASE5
    USER_CHECK4 -.->|Rechazado| QA
```

**Documentos generados en FASE 4:**
- ✅ `/docs/implementations/{nombre}/` - QA Testing
- ✅ `/docs/implementations/{nombre}/` - Security Audit

---

### FASE 5: DOCUMENTACIÓN 📚

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    INPUT["Feature<br/>validada"]
    DOC["DOCUMENTER:<br/>Guías"]
    USER_CHECK5["✅ Usuario<br/>Valida"]
    FINAL["✨ COMPLETADA"]
    PROD["🚀 Deploy"]

    INPUT --> DOC
    DOC --> USER_CHECK5
    USER_CHECK5 --> FINAL
    USER_CHECK5 -.->|Rechazado| DOC
    FINAL --> PROD
```

**Documentos generados en FASE 5:**
- ✅ `/docs/implementations/{nombre}/` - Documentation
- ✅ `/docs/operation/{nombre}-guide.md`
- ✅ `/docs/operation/{nombre}-setup.md`
- ✅ `/docs/operation/{nombre}-troubleshooting.md`
- ✅ `/docs/operation/{nombre}-diagrams.md`

---

## 📁 Estructura de Documentos por Fase

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    IMPL["📁 /docs/implementations/"]
    ARCH["📁 /docs/architecture/"]
    PLAN["📁 /docs/"]
    OP["📁 /docs/operation/"]

    IMPL --> REQ["requirements.md<br/>FASE 1"]
    IMPL --> OVER["implementation-overview.md<br/>FASES 2-5"]

    ARCH --> DESIGN["design-{proyecto}.md"]
    ARCH --> DIAG["diagrams-{proyecto}.md"]
    ARCH --> ADR["adr-{proyecto}.md"]

    PLAN --> PLAN_FILE["plan-{proyecto}.md"]

    OP --> GUIDE["guide.md"]
    OP --> SETUP["setup.md"]
    OP --> TROUBLE["troubleshooting.md"]
    OP --> DIAGRAMS["diagrams.md"]
```

---

## 🔄 Validaciones por Fase

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    V1["✅ FASE 1<br/>Requirements<br/>Plan"]
    V2["✅ FASE 2<br/>Diseño<br/>Validación"]
    V3["✅ FASE 3<br/>Código<br/>Integraciones"]
    V4["✅ FASE 4<br/>Testing<br/>Seguridad"]
    V5["✅ FASE 5<br/>Documentación"]

    V1 --> V2 --> V3 --> V4 --> V5
```

---

## 🎭 Especialistas por Fase

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    F1["FASE 1:<br/>Planificación"]
    P1["Planner<br/>System Analyser"]

    F2["FASE 2:<br/>Diseño"]
    P2["Architect<br/>Design Validator"]

    F3["FASE 3:<br/>Implementación"]
    P3["Coder<br/>Code Reviewer"]

    F4["FASE 4:<br/>Validación"]
    P4["QA Validator<br/>Security Specialist"]

    F5["FASE 5:<br/>Documentación"]
    P5["Documenter"]

    F1 --> P1
    F2 --> P2
    F3 --> P3
    F4 --> P4
    F5 --> P5
```

---

## ⚠️ Puntos Críticos de Control (6 Gates)

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    START["Feature<br/>Solicitud"]
    GATE1["GATE 1:<br/>¿Claro?"]
    GATE2["GATE 2:<br/>¿Viable?"]
    GATE3["GATE 3:<br/>¿Consistente?"]
    GATE4["GATE 4:<br/>¿Código OK?"]
    GATE5["GATE 5:<br/>¿Seguro?"]
    GATE6["GATE 6:<br/>¿Documentado?"]
    END["✨ COMPLETADO"]

    START --> GATE1
    GATE1 -->|NO| START
    GATE1 -->|SÍ| GATE2
    GATE2 -->|NO| STOP["❌ Reformular"]
    GATE2 -->|SÍ| GATE3
    GATE3 -->|NO| BACK1["Ajustar"]
    BACK1 --> GATE3
    GATE3 -->|SÍ| GATE4
    GATE4 -->|NO| BACK2["Iterar"]
    BACK2 --> GATE4
    GATE4 -->|SÍ| GATE5
    GATE5 -->|NO| BACK3["Corregir"]
    BACK3 --> GATE5
    GATE5 -->|SÍ| GATE6
    GATE6 -->|NO| BACK4["Mejorar"]
    BACK4 --> GATE6
    GATE6 -->|SÍ| END
```

---

## 📊 Checklist de Consistencia

### ✅ Claridad de Fases
- [ ] 5 fases bien definidas
- [ ] Cada fase tiene agentes específicos
- [ ] Validación de usuario en cada fase
- [ ] Fases son secuenciales

### ✅ Responsabilidades de Agentes
- [ ] Cada agente es único
- [ ] Sin duplicación de responsabilidades
- [ ] Cada agente conoce su documento
- [ ] Interacciones bien definidas

### ✅ Documentación Viva
- [ ] Agentes verifican si documento existe
- [ ] Si NO existe → Crean analizando estado ACTUAL
- [ ] Si SÍ existe → Actualizan/complementan
- [ ] Documentación refleja realidad

### ✅ Quality Gates
- [ ] 6 gates de control
- [ ] Criterios claros en cada gate
- [ ] Gates pueden rechazar
- [ ] Escaladas definidas

### ✅ Flujo sin Bloqueos
- [ ] Sin deadlocks
- [ ] Rutas de regresión definidas
- [ ] Máximo 2 iteraciones en Code Review
- [ ] Escaladas a Architect documentadas

---

## 🎯 Caso de Uso: Multi-Proveedor LLM

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    REQ["Solicitud:<br/>Multi-Proveedor LLM"]
    F1["FASE 1:<br/>Planificación ✅"]
    F2["FASE 2:<br/>Diseño ✅"]
    F3["FASE 3:<br/>Implementación ✅"]
    F4["FASE 4:<br/>Validación ✅"]
    F5["FASE 5:<br/>Documentación ✅"]
    DONE["✨ Completada<br/>🚀 Deploy"]

    REQ --> F1
    F1 --> F2
    F2 --> F3
    F3 --> F4
    F4 --> F5
    F5 --> DONE
```

---

## 🎨 Paleta de Colores

**Tema:** Fondo oscuro con colores vibrantes

- 🔵 Azul Claro (#00a8ff): Planner
- 🟣 Púrpura (#7c3aed): System Analyser
- 🟠 Naranja (#f97316): Architect
- 🟢 Verde (#10b981): Design Consistency Validator
- 🔵 Azul (#3b82f6): Coder
- 🟣 Púrpura Claro (#a855f7): Code Reviewer
- 🟡 Amarillo (#f59e0b): QA Validator
- 🔴 Rojo Oscuro (#dc2626): Security Specialist
- 🔷 Cyan (#06b6d4): Documenter
- 🟤 Marrón (#92400e): Coordinator

---

**Última actualización:** 2025-10-31
**Versión:** 2.1 - Diagramas simplificados con tema oscuro
