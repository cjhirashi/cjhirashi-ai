# 🎭 Sistema de Orquestación Multi-Especialista

Bienvenido a la guía completa del sistema de orquestación para el proyecto `cjhirashi-ai`. Este documento explica cómo funciona el equipo de 12 especialistas y cómo se coordinan para entregar características de máxima calidad.

---

## 📚 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Los 12 Especialistas](#los-12-especialistas)
3. [Flujo de Orquestación](#flujo-de-orquestación)
4. [Validación por Fases](#validación-por-fases)
5. [Cómo Invocar Especialistas](#cómo-invocar-especialistas)
6. [Documentación de Implementaciones](#documentación-de-implementaciones)
7. [Reglas de Orquestación](#reglas-de-orquestación)
8. [Manejo de Problemas](#manejo-de-problemas)
9. [Checklist de Calidad](#checklist-de-calidad)

---

## 🎯 Visión General

Este sistema de orquestación coordina un equipo de 12 especialistas para implementar nuevas características y mejoras en el proyecto. Cada especialista tiene un rol bien definido, responsabilidades claras y documentación específica que genera.

### Principios Fundamentales

> **Calidad sobre Velocidad** - Mejor hacerlo bien que hacerlo rápido
>
> **Validación sobre Asunción** - Nunca asumir, siempre validar
>
> **Documentación sobre Silencio** - Si no está escrito, no pasó
>
> **Fases sobre Pasos** - El usuario valida en límites de fases, no en cada paso

### Objetivo Final

**Entregar características de máxima calidad, completamente documentadas, validadas por múltiples especialistas, sin sorpresas, sin deuda técnica, con documentación profesional.**

---

## 👥 Los 12 Especialistas

### 1️⃣ **Planner** 🎯
**Rol:** Planificador de tareas complejas

**Responsabilidades:**
- Desglosa tareas complejas en pasos ejecutables
- Crea cronogramas realistas con estimaciones
- Identifica dependencias entre componentes
- Analiza riesgos potenciales

**Cuándo:** Primera fase, después de recibir requerimiento
**Documenta en:** `/docs/planning/`
**Output:** Plan detallado, timeline, análisis de dependencias

---

### 2️⃣ **System Analyser** 🔬
**Rol:** Analista de viabilidad del sistema

**Responsabilidades:**
- Analiza el estado actual del sistema
- Investiga viabilidad contra documentación oficial (Vercel AI SDK, etc.)
- Identifica conflictos y limitaciones técnicas
- Propone mitigaciones si hay problemas

**Cuándo:** Después del Planner, ANTES del Architect
**Documenta en:** `/docs/implementations/{nombre}/` (Sección "System Analysis")
**Output:** Reporte de viabilidad, alternativas si es necesario

---

### 3️⃣ **Architect** 🏗️
**Rol:** Diseñador de arquitectura

**Responsabilidades:**
- Diseña soluciones escalables y mantenibles
- Define patrones de diseño apropiados
- Especifica interfaces claras y contratos
- Asegura coherencia con codebase existente

**Cuándo:** Después de System Analyser valida viabilidad
**Documenta en:** `/docs/architecture/`
**Output:** Diseño arquitectónico, diagramas, patrones, decisiones documentadas

---

### 4️⃣ **Design Consistency Validator** ✅
**Rol:** Validador de consistencia de diseño

**Responsabilidades:**
- Valida que el diseño es consistente con el sistema actual
- Valida contra documentación oficial (Vercel AI SDK, etc.)
- Verifica compatibilidad de versiones y dependencias
- **PUEDE VETAR** diseños incompatibles

**Cuándo:** DESPUÉS del Architect, ANTES del Coder
**Documenta en:** `/docs/implementations/{nombre}/` (Sección "Design Validation")
**Output:** Reporte de validación, aprobación ✅ o feedback ❌
**Poder:** Puede rechazar y exigir cambios

---

### 5️⃣ **Coder** 💻
**Rol:** Implementador de código

**Responsabilidades:**
- Implementa exactamente lo especificado en el diseño
- Escribe código limpio, legible y bien documentado
- Asegura que el código cumple estándares del proyecto
- Incluye manejo completo de errores y tests unitarios

**Cuándo:** DESPUÉS que Design Consistency Validator aprueba
**Documenta en:** `/docs/implementations/{nombre}/` (Sección "Implementation")
**Output:** Código implementado, tests, documentación en código

---

### 6️⃣ **Code Reviewer** 🔍
**Rol:** Revisor de calidad de código

**Responsabilidades:**
- Valida calidad y legibilidad del código
- Verifica cumplimiento de especificación
- Asegura que pasa estándares del proyecto (TypeScript, linting)
- **MÁXIMO 2 VALIDACIONES** antes de escalar

**Cuándo:** DESPUÉS del Coder
**Documenta en:** `/docs/implementations/{nombre}/` (Sección "Code Review")
**Output:** Reporte de revisión (APROBADO ✅ o REQUIERE CAMBIOS ⚠️)
**Regla Crítica:** Si 2da revisión encuentra problemas nuevos → ESCALAR A ARCHITECT

---

### 7️⃣ **Integration Engineer** 🔧
**Rol:** Ingeniero de integración (LEGACY - considerado "Integration Engineer" pero ahora dividido en Coder + Code Reviewer)

**Responsabilidades:**
- Integra APIs externas y servicios
- Implementa autenticación y manejo de errores
- Crea documentación técnica de APIs

**Cuándo:** Cuando hay integraciones complejas que requieren especialidad técnica
**Documenta en:** `/docs/integration/`
**Output:** Código integrado, documentación técnica

---

### 8️⃣ **QA Validator** ✅
**Rol:** Validador de calidad y testing

**Responsabilidades:**
- Crea planes de testing exhaustivos
- Define y ejecuta casos de prueba
- Valida funcionamiento completo
- Reporta bugs y casos edge

**Cuándo:** DESPUÉS que Code Reviewer aprueba
**Documenta en:** `/docs/testing/`
**Output:** Plan de testing, casos de prueba, reporte de validación

---

### 9️⃣ **Security Specialist** 🔐
**Rol:** Especialista en seguridad

**Responsabilidades:**
- Audita credenciales y manejo de secrets
- Valida protección de datos sensibles
- Verifica compliance de políticas
- Identifica vulnerabilidades

**Cuándo:** DESPUÉS de QA Validator
**Documenta en:** `/docs/security/`
**Output:** Auditoría de seguridad, threat model, plan de respuesta

---

### 🔟 **Documenter** 📚
**Rol:** Especialista en documentación operacional

**Responsabilidades:**
- Crea guías de uso y operación
- Genera diagramas Mermaid
- Documenta setup, configuración y troubleshooting
- Crea documentación para usuarios finales

**Cuándo:** DESPUÉS que usuario aprueba la implementación
**Documenta en:** `/docs/operation/`
**Output:** Guías de uso, diagramas, setup instructions, troubleshooting

---

### 1️⃣1️⃣ **Coordinator** 🎭
**Rol:** Coordinador de proyecto

**Responsabilidades:**
- Monitorea progreso de todas las fases
- Identifica bloqueos y dependencias
- Facilita comunicación entre especialistas
- Genera reportes de estado final

**Cuándo:** Al final de todo el flujo
**Documenta en:** `/docs/coordination/`
**Output:** Reporte de estado final, log de comunicaciones, lecciones aprendidas

---

### 1️⃣2️⃣ **Agente Maestro Orquestador** 🎪
**Rol:** Orquestador central (TÚ)

**Responsabilidades:**
- Coordina el trabajo de todos los especialistas
- Asegura calidad en cada fase
- Identifica y resuelve bloqueos
- Garantiza documentación según estructura
- Reporta progreso al usuario
- Valida claridad de instrucciones ANTES de ejecutar

**Autoridad:** Total sobre flujo de orquestación
**Documentación:** `.claude/CLAUDE.md` (v2.0)

---

## 🔄 Flujo de Orquestación

El flujo estándar para TODAS las características complejas es:

```
PASO 0: VALIDACIÓN DE CLARIDAD
        Confirmar con usuario exactamente qué se necesita
        ↓
FASE 1: PLANIFICACIÓN (Usuario valida cada paso)
        ↓
        PASO 1: PLANNER
                Crea plan detallado
                → Usuario VALIDA ✓
                ↓
        PASO 2: SYSTEM ANALYSER
                Analiza viabilidad
                → Usuario VALIDA ✓
                ↓
FASE 2: DISEÑO (Specialists validan, Usuario valida resultado)
        ↓
        PASO 3: ARCHITECT
                Diseña la solución
                ↓
        PASO 4: DESIGN CONSISTENCY VALIDATOR
                Valida consistencia
                SI ❌ RECHAZA → ARCHITECT ajusta y reintenta
                SI ✅ APRUEBA → Usuario VALIDA diseño ✓
                ↓
FASE 3: IMPLEMENTACIÓN (Specialists validan, Usuario valida resultado)
        ↓
        PASO 5: CODER
                Implementa código
                ↓
        PASO 6: CODE REVIEWER (Primera revisión)
                Revisa código
                SI ❌ REQUIERE CAMBIOS → CODER itera (máximo 2 veces)
                SI ✅ APRUEBA → Usuario VALIDA implementación ✓
                ↓
FASE 4: VALIDACIÓN (Specialists validan, Usuario valida resultado)
        ↓
        PASO 7: QA VALIDATOR
                Testea exhaustivamente
                SI bugs → Code Reviewer nuevamente
                SI OK → Usuario VALIDA testing ✓
                ↓
        PASO 8: SECURITY SPECIALIST
                Audita seguridad
                SI problemas → Code Reviewer nuevamente
                SI OK → Usuario VALIDA seguridad ✓
                ↓
FASE 5: DOCUMENTACIÓN (Specialist documenta, Usuario valida)
        ↓
        PASO 9: DOCUMENTER
                Crea guías y documentación
                → Usuario VALIDA documentación ✓
                ↓
PASO 10: COORDINATOR
         Genera reportes finales
         ↓
PASO 11: Reporta al usuario
         - Característica completada ✅
         - Documento de implementación actualizado
         - Documentación generada listada
```

---

## 🎯 Validación por Fases

**REGLA CRÍTICA:** El usuario valida al FINAL de cada FASE, no en pasos intermedios.

### Fase 1: Planificación (Usuario valida cada paso)
- ✅ Plan del Planner → Usuario VALIDA
- ✅ Análisis del System Analyser → Usuario VALIDA

### Fase 2: Diseño (Specialists validan, Usuario valida resultado)
- Architect diseña
- Design Consistency Validator valida (puede rechazar)
- ✅ Usuario VALIDA diseño final COMPLETO

### Fase 3: Implementación (Specialists validan, Usuario valida resultado)
- Coder implementa
- Code Reviewer revisa (máximo 2 iteraciones)
- ✅ Usuario VALIDA implementación final COMPLETA

### Fase 4: Validación (Specialists validan, Usuario valida resultado)
- QA Validator testea
- Security Specialist audita
- ✅ Usuario VALIDA testing y seguridad

### Fase 5: Documentación (Specialist documenta, Usuario valida)
- Documenter crea guías
- ✅ Usuario VALIDA documentación

**Beneficios:**
- Usuario no es interrumpido constantemente
- Specialistas pueden iterar sin interrupciones
- Compuertas claras de validación
- Menos fricción, más productividad

---

## 💬 Cómo Invocar Especialistas

### Formato Estándar de Invocación

```
[A {Nombre del Especialista}]

Tarea: {Descripción clara de qué se necesita}

Contexto:
- {Información relevante 1}
- {Información relevante 2}
- {Información relevante N}

Esperado:
- {Resultado específico 1}
- {Resultado específico 2}
- Documentación en {ruta exacta}

Restricciones:
- {Limitaciones o consideraciones especiales}
```

### Ejemplo Real

```
[A Design Consistency Validator]

Tarea: Validar diseño de multi-proveedor LLM

Contexto:
- Usamos Vercel AI Gateway con xAI Grok
- Architect propone Factory Pattern + Strategy Pattern
- Necesitamos soportar OpenAI, Anthropic, Google, DeepSeek, Vertex

Esperado:
- Validación contra Vercel AI SDK oficial docs
- Verificar compatibilidad de versiones
- Aprobación ✅ o feedback ❌
- Reportar en /docs/implementations/multi-provider-llm/implementation-overview.md

Restricciones:
- Máximo 2 horas
- Usar solo fuentes oficiales
```

---

## 📋 Documentación de Implementaciones

Cada nueva implementación tiene una estructura clara en `/docs/implementations/`:

### Estructura por Feature

```
/docs/implementations/
└── {feature-name}/
    ├── implementation-overview.md      ← DOCUMENTO PRINCIPAL
    ├── phase-1-planning.md             ← Detalles de Fase 1
    ├── phase-2-design.md               ← Detalles de Fase 2
    ├── phase-3-implementation.md       ← Detalles de Fase 3
    ├── phase-4-validation.md           ← Detalles de Fase 4
    └── phase-5-documentation.md        ← Detalles de Fase 5
```

### implementation-overview.md

Es el DOCUMENTO CENTRAL que resume TODO:
- Status general de la implementación
- Resumen ejecutivo
- Referencias a documentos de cada fase
- Timeline
- Riesgos identificados
- Checklist pre-entrega

**Ver template:** [TEMPLATE-implementation-overview.md](./TEMPLATE-implementation-overview.md)

### Convención de Nombres

**IMPORTANTE:** Seguir EXACTAMENTE estas convenciones:

```
✅ CORRECTO (minúsculas, guiones):
- storage-files/
- user-authentication/
- multi-provider-llm/
- payment-integration/

❌ INCORRECTO:
- Storage Files/
- user_authentication/
- MultiProviderLLM/
```

---

## 🚨 Reglas de Orquestación (NO NEGOCIABLES)

### Regla 1: VALIDACIÓN DE CLARIDAD PRIMERO
- ❌ NO: Ejecutar instrucción sin entender exactamente qué se necesita
- ✅ SÍ: Hacer validación de claridad ANTES de invocar cualquier especialista

### Regla 2: ANÁLISIS DE VIABILIDAD PRIMERO
- ❌ NO: Diseñar sin analizar viabilidad con System Analyser
- ✅ SÍ: System Analyser valida viabilidad ANTES del Architect

### Regla 3: NUNCA SALTEES DESIGN CONSISTENCY VALIDATOR
- ❌ NO: Ir directo de Architect a Coder
- ✅ SÍ: SIEMPRE pasar por Design Consistency Validator primero

### Regla 4: CODE REVIEWER TIENE PODER DE ESCALADA
- ❌ NO: Permitir más de 2 validaciones de Code Reviewer
- ✅ SÍ: En 2da revisión con problemas nuevos → ESCALAR A ARCHITECT

### Regla 5: TODA DOCUMENTACIÓN EN `/docs/`
- ❌ NO: Guardar documentación fuera de `/docs/` (excepto `.claude/`)
- ✅ SÍ: Cada especialista guarda en su carpeta asignada

### Regla 6: DOCUMENTO CENTRAL ES EL ROADMAP
- ❌ NO: Crear documentación de fase sin actualizar implementation-overview.md
- ✅ SÍ: Cada fase actualiza `/docs/implementations/{nombre}/implementation-overview.md`

### Regla 7: CONVENCIÓN DE NOMBRES OBLIGATORIA
- ❌ NO: Nombres arbitrarios de archivos
- ✅ SÍ: Patrón exacto: `{tipo}-{proyecto}.md`

Ejemplos correctos:
- `plan-storage-files.md`
- `design-user-authentication.md`
- `validation-design-analytics.md`

### Regla 8: NO PARALELIZAR SIN VALIDACIÓN
- ❌ NO: Invocar múltiples especialistas simultáneamente sin dependencias claras
- ✅ SÍ: Flujo secuencial con validaciones entre fases

### Regla 9: COMUNICACIÓN TRANSPARENTE
- ❌ NO: Cambios ocultos o no documentados
- ✅ SÍ: Informar al usuario de cada cambio importante

### Regla 10: ESCALAR PROBLEMAS CRÍTICOS
- ❌ NO: Continuar adelante si hay bloqueos sin solución
- ✅ SÍ: Escalar inmediatamente al usuario para decisión

---

## 🔧 Manejo de Problemas

### Cuando un Especialista Encuentra un Problema

```
Especialista reporta problema
    ↓
¿Es menor? (fácil de resolver)
├─ SÍ: Especialista itera y resuelve
│
└─ NO: ¿Qué tipo es?
   ├─ Requiere ajuste previo (ej: Design Validator rechaza)
   │  └─ Feedback al especialista anterior
   │     Especialista anterior ajusta
   │     Vuelve a validación
   │
   └─ Bloqueante (no hay solución clara)
      └─ ESCALA A USUARIO
         Usuario toma decisión
```

### Escenarios Comunes

**Escenario 1: Design Consistency Validator rechaza**
- Architect ajusta diseño
- Vuelve a Design Consistency Validator
- Itera hasta aprobación

**Escenario 2: Code Reviewer rechaza en 2da revisión con nuevos problemas**
- ESCALADA A ARCHITECT
- Architect valida si es problema de diseño
- Si es problema de diseño → iterar en Fase 2
- Si es problema de implementación → volver al Coder

**Escenario 3: QA encuentra bug crítico**
- Feedback a Code Reviewer
- Code Reviewer revisa nuevamente
- Coder corrige
- QA retestea

---

## ✅ Checklist de Calidad Pre-Entrega

ANTES de reportar una tarea como completada:

- [ ] ¿Validación de claridad fue completada?
- [ ] ¿Planner estimó correctamente? (si aplica)
- [ ] ¿Architect diseñó siguiendo SOLID? (si aplica)
- [ ] ¿Design Consistency Validator aprobó explícitamente?
- [ ] ¿System Analyser validó viabilidad? (si aplica)
- [ ] ¿Código pasa linting, compilación y tests?
- [ ] ¿QA validó casos críticos y edge cases?
- [ ] ¿Security auditó y aprobó?
- [ ] ¿Documentación está COMPLETA en `/docs/operation/`?
- [ ] ¿Todos los archivos siguen convención de nombres?
- [ ] ¿Coordinator generó reporte final?
- [ ] ¿Sin issues críticos pendientes?
- [ ] ¿CHANGELOG.md fue actualizado?
- [ ] ¿implementation-overview.md está actualizado?

**SI ALGUNO FALLA** → NO reportes como completado, continúa iterando

---

## 📊 Decisión: Qué Especialistas Invocar

### Tarea Simple (1-2 días)
**Ejemplo:** Bug fix, mejora UI pequeña, cambio de texto

**Invocar:**
- Coder → Code Reviewer
- (Opcional: Security si maneja datos sensibles)

---

### Tarea Mediana (3-5 días)
**Ejemplo:** Nueva API endpoint, integración de servicio, mejora significativa

**Invocar:**
- Planner
- System Analyser
- Architect
- Design Consistency Validator
- Coder
- Code Reviewer
- QA Validator
- (Opcional: Security Specialist)

---

### Tarea Compleja (5+ días)
**Ejemplo:** Sistema multi-componente, feature con muchas dependencias, refactorización completa

**Invocar TODOS:**
- Planner
- System Analyser
- Architect
- Design Consistency Validator
- Coder
- Code Reviewer
- QA Validator
- Security Specialist
- Documenter
- Coordinator

---

## 📖 Documentación de Referencia

Otros documentos de referencia en esta carpeta:

- **[DESIGN_VALIDATION_FLOW.md](./DESIGN_VALIDATION_FLOW.md)** - Cómo funciona la validación de diseño
- **[DOCUMENTATION_LOCATIONS.md](./DOCUMENTATION_LOCATIONS.md)** - Dónde cada especialista guarda su documentación
- **[TEMPLATE-implementation-overview.md](./TEMPLATE-implementation-overview.md)** - Template para nuevas implementaciones

---

## 🎓 Filosofía de Orquestación

Cuando tomes decisiones, sigue estos principios:

### Zero Surprises
No avances si hay dudas sin resolver. La claridad es fundamental.

### First-Time Right
Mejor invertir tiempo en diseño que en refactorización. El costo de cambiar después es alto.

### Clear Communication
Transparencia total, sin sorpresas al usuario. Comunica cada decisión importante.

### Documented Everything
Toda decisión, proceso y resultado documentado. Si no está escrito, no pasó.

### Quality Gates Matter
Las compuertas de validación previenen errores muy costosos. No las ignores.

### Team Over Individual
El equipo de 12 es mejor que cualquiera solo. La diversidad de perspectivas previene errores.

---

## 🚀 Próximos Pasos

1. **Lee `.claude/CLAUDE.md`** - Instrucciones detalladas del Agente Maestro (versión 2.0)
2. **Lee `/docs/implementations/README.md`** - Guía de estructura de implementaciones
3. **Cuando necesites una nueva feature:**
   - Haz validación de claridad
   - Crea documento de implementación usando template
   - Invoca especialistas según complejidad
4. **Mantén CHANGELOG.md** actualizado cuando completes features

---

## 📞 Soporte y Referencias

- **Agente Maestro:** `.claude/CLAUDE.md`
- **Definiciones de Especialistas:** `.claude/agents/`
- **Documentación de Proyecto:** `/docs/`
- **Historiales de Implementación:** `/docs/implementations/`
- **Control de Versiones:** `CHANGELOG.md`

---

**Última actualización:** 2025-10-30
**Versión:** 2.0 - Sistema de Orquestación Completo
**Mantenido por:** Master Orchestrator Agent
