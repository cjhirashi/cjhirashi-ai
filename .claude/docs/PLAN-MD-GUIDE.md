# Guía: plan.md - Documento Maestro Central

## ¿Qué es plan.md?

**plan.md es el documento central de control que consolida TODO el roadmap de implementación.**

Es el lugar donde el usuario va para entender:
- 📊 Estado general del proyecto por fases
- 📅 Cronograma completo
- ⚠️ Riesgos identificados
- 🎯 Hitos clave
- 📦 Lo que va a suceder y cuándo

---

## Flujo de Documentos en FASE 1

```
ENTRADA: Usuario da requerimiento
    ↓
Planner crea: requirements.md (Secciones 1-2-4 llenas, Sección 3 vacía)
    ↓
Usuario valida Secciones 1-2-4
    ↓
System Analyser llena: Sección 3 de requirements.md
    ↓
Usuario valida Sección 3
    ↓
Planner crea: plan.md (el documento maestro)
    ↓
SALIDA: requirements.md y plan.md completados y validados
```

---

## plan.md vs requirements.md

| Aspecto | requirements.md | plan.md |
|--------|-----------------|---------|
| **Propósito** | Define QUÉ se va a hacer y si es viable | Define CÓMO y CUÁNDO se va a hacer |
| **Contenido** | Análisis de requisitos + viabilidad técnica | Resumen del roadmap de 5 fases |
| **Audiencia** | Técnicos que validan viabilidad | Todos (usuario, especialistas, PM) |
| **Frecuencia de cambios** | No cambia después de validado | Actualiza conforme avanzan las fases |
| **Refs cruzadas** | Plan.md lo referencia | Referencia requirements.md |

---

## plan.md es el Roadmap Visual

**Secciones principales:**

### 1. Resumen Ejecutivo
- **Para**: Entender el proyecto de un vistazo
- **Contiene**: Objetivo, alcance, timeline, estado actual
- **Usa cuando**: Necesitas saber en 30 segundos qué es esto

### 2. Visión General
- **Para**: Entender el contexto completo
- **Contiene**: Descripción, objetivos, criterios de éxito
- **Usa cuando**: Necesitas contexto antes de entrar en detalles

### 3. Resumen de las 5 Fases
- **Para**: Ver qué pasa en CADA FASE
- **Contiene**: Para cada fase - especialistas, tareas, timeline, entregables
- **Usa cuando**: Necesitas saber qué ocurre en una fase específica
- **CLAVE**: Aquí se ve dónde estamos ahora y qué viene después

### 4. Cronograma Consolidado (Gantt Mermaid)
- **Para**: Ver el timeline COMPLETO visualmente
- **Contiene**: Diagrama Gantt con todas las 5 fases y hitos
- **Usa cuando**: Necesitas saber "¿cuánto tiempo tarda todo?"

### 5. Matriz de Riesgos
- **Para**: Saber qué puede salir mal y cómo se mitiga
- **Contiene**: Riesgos, probabilidad, impacto, mitigación
- **Usa cuando**: Necesitas entender qué está en riesgo

### 6. Dependencias Externas
- **Para**: Saber qué necesita el proyecto para funcionar
- **Contiene**: Librerías, servicios, variables de entorno
- **Usa cuando**: Necesitas setup o configuración

### 7. Estado General del Proyecto
- **Para**: SABER DÓNDE ESTAMOS AHORA
- **Contiene**: Fase actual, % progreso por fase, bloqueadores, próximos hitos
- **Usa cuando**: Revisas el estado durante la ejecución
- **ACTUALIZADO**: Conforme avanzan las fases

### 8. Referencias y Documentos Relacionados
- **Para**: Navegar a otros documentos
- **Contiene**: Links a requirements.md, documentos de fases
- **Usa cuando**: Necesitas profundizar en algo específico

---

## Ciclo de Vida de plan.md

### 📝 Creación (FASE 1)
- Planner lo crea DESPUÉS de que requirements.md es validado
- Contiene timeline estimado y riesgos teóricos
- Estado inicial: "Planificación"

### ⏳ Durante Ejecución (FASES 2-4)
- Se actualiza conforme avanzan las fases
- Sección 7 "Estado General" se actualiza regularmente
- Progreso por fase se va llenando (0% → 100%)
- Nuevos riesgos se agregan si surgen
- Bloqueadores se documentan

### ✅ Finalización (FASE 5)
- Plan.md marca estado general como "Completado"
- Todas las fases muestran ✅ 100%
- Referencias a documentos finales de cada fase

---

## Relación con Documentos de Fases

**plan.md es el ÍNDICE**

```
plan.md (resumen ejecutivo de todo)
    ↓
    ├─ FASE 2: Ver arquitectura en /docs/architecture/
    ├─ FASE 3: Ver código en /docs/integration/
    ├─ FASE 4: Ver testing en /docs/testing/ y seguridad en /docs/security/
    └─ FASE 5: Ver guías en /docs/operation/
```

Cada fase tiene su documento detallado, pero **plan.md es el punto central de referencia**.

---

## Responsabilidad: Quién Actualiza plan.md

| Fase | Quién Actualiza | Qué Actualiza |
|------|-----------------|---------------|
| FASE 1 | Planner | Crea plan.md completo |
| FASE 2 | Architect/Design Validator | Estado de FASE 2, riesgos nuevos |
| FASE 3 | Coder/Code Reviewer | Estado de FASE 3, bloqueadores |
| FASE 4 | QA Validator/Security Specialist | Estado de FASE 4, hallazgos |
| FASE 5 | Documenter | Estado de FASE 5, referencias finales |

**Orquestador Maestro**: Valida que las actualizaciones sean completas y precisas.

---

## Checklist: plan.md Completo

Plan.md está **COMPLETO** si tiene:

- [ ] Sección 1: Resumen Ejecutivo claro y conciso
- [ ] Sección 2: Visión General con objetivos y criterios
- [ ] Sección 3: Las 5 Fases descritas (especialistas, tareas, timeline, entregables)
- [ ] Sección 4: Diagrama Gantt Mermaid con todas las fases y hitos
- [ ] Sección 5: Matriz de Riesgos (del System Analyser + Planner)
- [ ] Sección 6: Dependencias Externas identificadas
- [ ] Sección 7: Estado General (fase actual, progreso %, bloqueadores)
- [ ] Sección 8: Referencias a requirements.md y carpetas de fases
- [ ] Fechas en Gantt realistas basadas en estimaciones
- [ ] Estado general = "Planificación" (en creación)
- [ ] Notas de actualización en pie de página

---

## Ejemplo de Estado General en Diferentes Momentos

### FASE 1 - Inicio
```
Fase Actual: FASE 1 (Planificación)

Progreso por Fase:
- FASE 1 (Planificación): ⏳ 50% - En Progreso
- FASE 2 (Diseño): ⏳ 0% - Pendiente
- FASE 3 (Implementación): ⏳ 0% - Pendiente
- FASE 4 (Validación): ⏳ 0% - Pendiente
- FASE 5 (Documentación): ⏳ 0% - Pendiente

Próximos Hitos:
1. Validación de requirements.md - Hoy
2. Crear plan.md - Mañana
3. Iniciar FASE 2 (Diseño) - En 2 días
```

### FASE 3 - Mitad
```
Fase Actual: FASE 3 (Implementación)

Progreso por Fase:
- FASE 1 (Planificación): ✅ 100% - Completada
- FASE 2 (Diseño): ✅ 100% - Completada
- FASE 3 (Implementación): ⏳ 60% - En Progreso
- FASE 4 (Validación): ⏳ 0% - Pendiente
- FASE 5 (Documentación): ⏳ 0% - Pendiente

Bloqueadores Actuales:
- Esperando resolución de bug X (estimado 1 día)

Próximos Hitos:
1. Completar módulo Y - En 2 días
2. Code Review de fase 3 - En 4 días
3. Iniciar FASE 4 (Validación) - En 5 días
```

### Finalización
```
Fase Actual: FASE 5 (Documentación)

Progreso por Fase:
- FASE 1 (Planificación): ✅ 100% - Completada
- FASE 2 (Diseño): ✅ 100% - Completada
- FASE 3 (Implementación): ✅ 100% - Completada
- FASE 4 (Validación): ✅ 100% - Completada
- FASE 5 (Documentación): ✅ 100% - Completada

Progreso General: ✅ 100%

Estado del Documento: COMPLETADO
```

---

## Principios Clave

**plan.md es:**
- ✅ El punto único de verdad para el roadmap
- ✅ Visible para todos (usuario, especialistas, coordinador)
- ✅ Vivo y que se actualiza conforme avanza el proyecto
- ✅ Conciso pero completo
- ✅ Referencia para documentos de fases más detallados

**plan.md NO es:**
- ❌ Un documento de especificación técnica (eso es requirements.md)
- ❌ Un documento detallado de arquitectura (eso es en /docs/architecture/)
- ❌ Un documento de código (eso es en /docs/integration/)
- ❌ Un documento detallado de testing (eso es en /docs/testing/)

---

**Resumen Final:**
plan.md es donde el proyecto "cobra vida visualmente". Es el dashboard que muestra dónde estamos, a dónde vamos, qué riesgos hay, y cuánto tiempo tarda todo.
