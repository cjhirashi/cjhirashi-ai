# 📚 Documentación de Orquestación - Índice Central

Esta carpeta contiene toda la documentación sobre el sistema de orquestación multi-especialista de `cjhirashi-ai`.

**Objetivo:** Proporcionar un punto central de referencia para entender cómo funciona el flujo de orquestación, qué templates usar, y cómo consultar guías específicas.

---

## 📁 Estructura de Carpetas

```
.claude/docs/
├── /templates/          ← Templates listos para usar
├── /guides/             ← Guías y explicaciones detalladas
├── /reference/          ← Documentación de referencia
└── README.md            ← Este archivo (índice central)
```

---

## 📋 TEMPLATES (Listos para Usar)

**Ubicación:** `.claude/docs/templates/`

Templates son **estructuras vacías** que se rellenan con datos específicos.

### requirements.md
- **Archivo:** `TEMPLATE-requirements.md`
- **Propósito:** Estructura base para análisis de requisitos
- **Quién lo usa:** Planner (TAREA 1 de FASE 1)
- **Qué contiene:**
  - Sección 1: Resumen Ejecutivo
  - Sección 2: Análisis del Requerimiento
  - Sección 3: Análisis de Viabilidad (para System Analyser)
  - Sección 4: Desglose de Fases
  - Sección 5: Riesgos Iniciales
- **Nota:** Sección 3 se llena DESPUÉS que el usuario valida Secciones 1-2-4

### plan.md
- **Archivo:** `TEMPLATE-plan.md`
- **Propósito:** Documento maestro del roadmap de implementación
- **Quién lo usa:** Planner (TAREA 5 de FASE 1)
- **Qué contiene:**
  - 8 secciones: Resumen, Visión, Fases, Gantt, Riesgos, Dependencias, Estado, Referencias
  - Diagrama Gantt en Mermaid (visual del cronograma)
- **Nota:** Se crea DESPUÉS de validar requirements.md completo

---

## 📖 GUIDES (Guías y Explicaciones)

**Ubicación:** `.claude/docs/guides/`

Guías son **explicaciones detalladas** de cómo funcionan diferentes aspectos del sistema.

### PLAN-MD-GUIDE.md
- **Propósito:** Entender qué es plan.md y cómo funciona
- **Contenido:**
  - Definición de plan.md (documento maestro central)
  - Flujo entre requirements.md y plan.md
  - Ciclo de vida de plan.md (creación, ejecución, finalización)
  - Relación con documentos de fases
  - Responsabilidades de actualización
  - Ejemplos de estado en diferentes momentos
- **Cuándo leerlo:** Cuando necesitas entender la visión general de plan.md

### SEPARATION-OF-CONCERNS.md
- **Propósito:** Clarificar qué va en .claude/docs/ vs /docs/
- **Contenido:**
  - Diferencia entre orquestación y proyecto
  - Qué documentación va en cada lugar
  - Estructura de carpetas
  - Ejemplos concretos
- **Cuándo leerlo:** Cuando tienes dudas sobre dónde guardar documentación

---

## 🔍 REFERENCE (Documentación de Referencia)

**Ubicación:** `.claude/docs/reference/`

Documentación de referencia son **documentos técnicos y de flujo** que definen cómo funciona el sistema.

### DESIGN_VALIDATION_FLOW.md
- **Propósito:** Definir el flujo de validación de diseño
- **Contenido:**
  - Proceso de Design Consistency Validator
  - Cómo valida contra documentación oficial
  - Qué puede rechazar y por qué
  - Cómo iterar en caso de rechazo
- **Cuándo consultarlo:** Durante FASE 2 (Diseño)

### DOCUMENTATION_LOCATIONS.md
- **Propósito:** Referencia rápida de dónde guarda cada especialista
- **Contenido:**
  - Ubicación exacta de documentación por especialista
  - Nombre de archivos esperado
  - Convención de nombres obligatoria
  - Ejemplos correctos e incorrectos
- **Cuándo consultarlo:** Cuando guardas documentación

---

## 🎯 Cómo Usar Esta Documentación

### Si quieres crear una implementación nueva:

1. **Lee:** GUIDES → SEPARATION-OF-CONCERNS.md
2. **Usa:** TEMPLATES → requirements.md
3. **Sigue:** El flujo en CLAUDE.md del proyecto
4. **Consulta:** REFERENCE → DOCUMENTATION_LOCATIONS.md si tienes dudas

### Si necesitas entender cómo funciona el roadmap:

1. **Lee:** GUIDES → PLAN-MD-GUIDE.md
2. **Ve:** TEMPLATES → plan.md para ver estructura

### Si tienes dudas sobre validación de diseño:

1. **Lee:** REFERENCE → DESIGN_VALIDATION_FLOW.md

### Si no sabes dónde guardar algo:

1. **Consulta:** REFERENCE → DOCUMENTATION_LOCATIONS.md
2. O Lee: GUIDES → SEPARATION-OF-CONCERNS.md

---

## 📊 Cuadro de Referencia Rápida

| Necesito... | Ubicación | Archivo |
|------------|-----------|---------|
| Crear requirements.md | Templates | TEMPLATE-requirements.md |
| Crear plan.md | Templates | TEMPLATE-plan.md |
| Entender qué es plan.md | Guides | PLAN-MD-GUIDE.md |
| Saber dónde guardar | Reference | DOCUMENTATION_LOCATIONS.md |
| Entender validación de diseño | Reference | DESIGN_VALIDATION_FLOW.md |
| Clarificar .claude/docs vs /docs | Guides | SEPARATION-OF-CONCERNS.md |

---

## 📝 Convención de Nombres

### Templates
```
TEMPLATE-{documento}.md
TEMPLATE-requirements.md
TEMPLATE-plan.md
```

### Guides
```
{NOMBRE-DESCRIPTIVO}-GUIDE.md
PLAN-MD-GUIDE.md
```

### Reference
```
{NOMBRE-DESCRIPTIVO}-FLOW.md  (para procesos/flujos)
{NOMBRE-DESCRIPTIVO}-LOCATIONS.md  (para ubicaciones)
```

---

## 🔄 Estructura General del Sistema

```
.claude/
├── CLAUDE.md                    ← Instrucciones del Maestro Orquestador
├── agents/                      ← Definiciones de especialistas (11 agentes)
│   ├── planner.md
│   ├── system-analyser.md
│   ├── architect.md
│   └── [etc...]
│
└── docs/                        ← ESTA CARPETA (documentación)
    ├── /templates/              ← Templates para usar
    │   ├── TEMPLATE-requirements.md
    │   └── TEMPLATE-plan.md
    │
    ├── /guides/                 ← Guías explicativas
    │   ├── PLAN-MD-GUIDE.md
    │   └── SEPARATION-OF-CONCERNS.md
    │
    ├── /reference/              ← Documentación de referencia
    │   ├── DESIGN_VALIDATION_FLOW.md
    │   └── DOCUMENTATION_LOCATIONS.md
    │
    └── README.md                ← Este archivo
```

---

## 🚀 Siguiente Paso

Cuando necesites información específica, usa la tabla de referencia rápida arriba para ir directamente al archivo que necesitas.

**Última actualización:** 2025-10-31
**Versión:** 1.0 - Estructura organizada de documentación
