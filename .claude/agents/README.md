# 🤖 Equipo de Agentes Especialistas

Este directorio contiene documentación para un equipo de **agentes expertos** que trabajan en coordinación para implementar características complejas en el proyecto con máxima calidad y seguridad.

## 👥 Los Especialistas

### 1. 🎯 [Planner](./planner.md) - Especialista en Planificación
- Desglosar tareas complejas
- Crear cronogramas realistas
- Identificar dependencias
- Documentar riesgos

### 2. 🏗️ [Architect](./architect.md) - Especialista en Arquitectura
- Diseñar soluciones escalables
- Validar patrones de diseño
- Asegurar coherencia técnica
- Revisar decisiones

### 3. 🔍 [Design Validator](./design-validator.md) - Especialista en Validación de Diseño ⭐ **NUEVO**
- **Quality Gate antes de implementación**
- Validar diseños en documentación oficial
- Buscar proyectos funcionales en GitHub
- Verificar compatibilidad de versiones
- Crear PoC de componentes críticos
- **Previene errores antes de codificar**

### 4. 💻 [Coder](./coder.md) - Especialista en Implementación ⭐ **NUEVO**
- Implementar código limpio y bien documentado
- Integrar APIs y servicios externos
- Manejar autenticación y error handling
- Escribir tests unitarios e integración
- **Responsable de código + APIs**

### 5. 🔍 [Code Reviewer](./code-reviewer.md) - Revisor de Código ⭐ **NUEVO**
- Validar calidad del código
- Revisar cumplimiento de especificación
- Asegurar estándares del proyecto
- Poder de escalada a Architect

### 6. ✅ [QA Validator](./qa-validator.md) - Especialista en Validación
- Definir criterios de aceptación
- Crear casos de prueba
- Validar funcionamiento
- Reportar calidad

### 7. 🔐 [Security Specialist](./security-specialist.md) - Especialista en Seguridad
- Proteger credenciales
- Auditar vulnerabilidades
- Validar compliance
- Gestionar secretos

### 8. 🎭 [Coordinator](./coordinator.md) - Coordinador
- Orquestar trabajo de especialistas
- Resolver conflictos
- Identificar bloqueos
- Reportar progreso

---

## 📁 Documentación: Ubicación de Archivos

**IMPORTANTE**: Toda la documentación del proyecto debe guardarse en `/docs/`, **NO aquí**.

Consulta estas referencias:
- 📖 **[.claude/docs/DOCUMENTATION_LOCATIONS.md](../docs/DOCUMENTATION_LOCATIONS.md)** - Dónde guarda cada agente su documentación
- 📖 **[.claude/docs/DESIGN_VALIDATION_FLOW.md](../docs/DESIGN_VALIDATION_FLOW.md)** - Flujo de validación de diseños
- 📖 **[/docs/DOCUMENTATION_STRUCTURE.md](../../docs/DOCUMENTATION_STRUCTURE.md)** - Estructura completa de `/docs/`

**Estructura de .claude/**:
- `.claude/agents/` = Definiciones de agentes de ORQUESTACIÓN (solo .md)
- `.claude/docs/` = Documentación sobre cómo usan los agentes sus carpetas
- `/docs/` = Documentación de PROYECTO (planes, diseños, implementación, testing, etc.)

---

## 🔄 Flujo de Trabajo

### Cuando se necesita implementar una característica compleja:

```
1. COORDINADOR recibe la solicitud
   "Integrar 6 proveedores de LLM"

2. PLANNER crea plan detallado
   ✓ Fases, estimaciones, dependencias, riesgos

3. ARCHITECT diseña solución
   ✓ Arquitectura, patrones, interfaces
   ✓ Valida con Security Specialist

4. DESIGN VALIDATOR revisa y aprueba ⭐ NUEVO
   ✓ Valida en documentación oficial
   ✓ Busca proyectos reales funcionales en GitHub
   ✓ Verifica compatibilidad de versiones
   ✓ Crea PoC si es necesario
   ✓ Reporte: ✅ APROBADO o ❌ REQUIERE AJUSTES
   ✓ Si hay issues → Vuelve a ARCHITECT

5. INTEGRATION ENGINEER implementa
   ✓ Escribe código
   ✓ Maneja APIs
   ✓ Implementa error handling

6. QA VALIDATOR prueba exhaustivamente
   ✓ Casos de prueba
   ✓ Validación de errores
   ✓ Benchmarks

7. SECURITY SPECIALIST audita
   ✓ Credenciales protegidas
   ✓ No hay exposiciones
   ✓ Cumplimiento de políticas

8. COORDINATOR reporta completitud
   ✓ Status: ✅ DONE
   ✓ Documentación: ✅ COMPLETE
   ✓ Quality: ✅ VALIDATED
```

**La diferencia clave**: Design Validator actúa como **Quality Gate ANTES de implementar**, previniendo que se pierdan días en errores que ya están documentados en fuentes oficiales.

## 📋 Cómo Usar Este Equipo

### Opción A: Solo necesitas una tarea pequeña
"Necesito agregar validación de API keys"
→ Coordinador asigna a Security Specialist

### Opción B: Tarea mediana
"Integrar Anthropic"
→ Coordinador → Coder + QA Validator + Security

### Opción C: Tarea compleja
"Arquitectura Multi-Proveedor LLM"
→ **TODO EL EQUIPO**
1. Planner: Plan (2-3 horas)
2. Architect: Diseño (4-6 horas)
3. Design Validator: Validación del diseño (2-3 horas) ⭐ **NUEVO**
4. Coder: Implementación de código + APIs (16-20 horas)
5. Code Reviewer: Revisión de código (2-3 horas) ⭐ **NUEVO**
6. QA Validator: Testing (8-12 horas)
7. Security: Auditoría (4-6 horas)
8. Coordinator: Reporte final (1 hora)

## 🎯 Ejemplo: Multi-Proveedor LLM

### Mensaje al Coordinador:
```
"Necesitamos integrar Anthropic, OpenAI, Google Gemini,
DeepSeek y Vertex AI. El usuario puede seleccionar cuál
usar. Queremos máxima calidad y seguridad."
```

### Coordinador responde:
```
Entendido. Activando equipo completo.

FASE 1: PLANNER
├─ Análisis de arquitectura actual: 1 hora
├─ Creación de plan detallado: 1 hora
├─ Estimación de esfuerzo: 30 min
└─ ETA: 2.5 horas

FASE 2: ARCHITECT
├─ Diseño multi-proveedor: 2 horas
├─ Diagramas y patrones: 2 horas
├─ Validación con Security: 1 hora
└─ ETA: 5 horas

FASE 3: DESIGN VALIDATOR ⭐ NUEVO
├─ Validar en documentación oficial: 1.5 horas
├─ Buscar proyectos GitHub funcionales: 1 hora
├─ Crear PoC de validación: 1 hora
└─ ETA: 3.5 horas
   (Retorno: ✅ APROBADO o ❌ REQUIERE AJUSTES)

FASE 4: CODER (Implementación de código + APIs)
├─ Refactorizar providers.ts: 4 horas
├─ Integrar Anthropic: 3 horas
├─ Integrar OpenAI: 3 horas
├─ Integrar Google Gemini: 3 horas
├─ Integrar DeepSeek: 3 horas
├─ Integrar Vertex AI: 4 horas
└─ ETA: 20 horas

FASE 5: CODE REVIEWER ⭐ NUEVO
├─ Revisar calidad de código: 2 horas
├─ Validar integraciones: 1 hora
└─ ETA: 3 horas

FASE 6: QA VALIDATOR
├─ Plan de testing: 2 horas
├─ Tests unitarios: 4 horas
├─ Tests integración: 4 horas
├─ Tests seguridad: 2 horas
└─ ETA: 12 horas

FASE 7: SECURITY SPECIALIST
├─ Auditoría de credenciales: 2 horas
├─ Validación de inputs/outputs: 1 hora
├─ Política de secretos: 2 horas
└─ ETA: 5 horas

FASE 8: COORDINADOR
├─ Reporte final: 1 hora
└─ ETA: 1 hora

═════════════════════════════════════════
TIEMPO TOTAL ESTIMADO: 52 horas (6-7 días de trabajo)
FECHA ESTIMADA: 5-7 noviembre 2025
═════════════════════════════════════════
✨ MEJORA: Coder + Code Reviewer actúan como especialistas
   dedicados. Consolidación de Integration Engineer optimiza
   flujo. ROI: Mejor calidad con menos complejidad.

¿Aprobado para proceder?
```

## 📊 Validaciones en Cada Fase

```
PLANNER ✓
├─ ¿Requerimientos entendidos?
├─ ¿Plan es realista?
└─ ¿Riesgos identificados?

ARCHITECT ✓
├─ ¿Diseño sigue SOLID?
├─ ¿Coherente con codebase?
└─ ¿Security validado?

CODER ✓
├─ ¿Código compila?
├─ ¿APIs integradas funcionan?
├─ ¿Error handling completo?
└─ ¿Tests unitarios listos?

CODE REVIEWER ✓
├─ ¿Código cumple estándares?
├─ ¿Especificación implementada?
└─ ¿Legibilidad y documentación?

QA VALIDATOR ✓
├─ ¿Tests pasan 100%?
├─ ¿Casos edge cubiertos?
└─ ¿Documentación completa?

SECURITY SPECIALIST ✓
├─ ¿Secretos protegidos?
├─ ¿No hay exposiciones?
└─ ¿Compliance ok?

COORDINATOR ✓
├─ ¿Todo validado?
├─ ¿Documentación?
└─ ✅ APROBADO PARA PRODUCTION
```

## 🚨 Checklist Pre-Deployment

Antes de cualquier merge/deploy:

- [ ] **Planner**: Plan está documentado
- [ ] **Architect**: Diseño aprobado
- [ ] **Design Validator**: Diseño validado en fuentes oficiales ⭐ **GATE CRÍTICO**
- [ ] **Coder**: Código escrito, compilado, integraciones OK
- [ ] **Code Reviewer**: Código revisado y aprobado ⭐ **GATE DE CALIDAD**
- [ ] **QA Validator**: Todos los tests pasan
- [ ] **Security**: Auditoría completada sin issues críticos
- [ ] **Coordinator**: Status final: ✅ READY

## 📞 Cómo Contactar a los Especialistas

### Directo a un especialista:
```
"@Planner, ¿cuántos días para el plan de X?"
"@Architect, valida este diseño"
"@Coder, implementa la integración con Y"
"@Code Reviewer, revisa este código"
```

### A través del Coordinador:
```
"Coordinador, necesitamos implementar X"
→ Coordinador asigna a especialistas apropiados
```

## 📈 Métricas de Calidad

El equipo mantiene estándares altos:

| Métrica | Mínimo | Objetivo |
|---------|--------|----------|
| Test Coverage | 70% | 85%+ |
| Security Score | 100/100 | 100/100 |
| Documentation | 90% | 100% |
| Code Review | 2+ | 2+ especialistas |
| Performance | Aceptable | Optimizado |

## 🔐 Seguridad del Equipo

El equipo está diseñado con:
- **Zero Trust**: Cada paso se valida
- **Defense in Depth**: Múltiples capas de revisión
- **Separation of Concerns**: Cada especialista su rol
- **Full Audit Trail**: Todo se documenta

## 📝 Documentación Generada

Cada implementación produce:
1. **Plan** - Cronograma y estrategia
2. **Arquitectura** - Diagramas y decisiones
3. **Implementación** - Código + Integraciones de APIs
4. **Revisión** - Reporte de calidad de código
5. **Test Plan** - Casos de prueba
6. **Security Report** - Validaciones de seguridad
7. **User Guide** - Cómo el usuario lo usa

## 🎯 Misión del Equipo

> **Implementar características complejas con máxima calidad, seguridad y documentación, asegurando que cada línea de código es validada por múltiples especialistas.**

---

**Creado**: 2025-10-30
**Última actualización**: 2025-10-31
**Versión**: 1.1 - Consolidación de Integration Engineer en Coder
**Agentes Activos**: 10 especialistas
**Mantenedor**: Coordinador
