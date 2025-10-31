# 📋 TEMPLATES - Estructuras Listas para Usar

Esta carpeta contiene **templates** (estructuras vacías) que se rellenan con datos específicos para cada nueva implementación.

---

## 📄 Templates Disponibles

### 1. TEMPLATE-requirements.md
**Propósito:** Estructura base para análisis de requisitos y viabilidad técnica

**Quién lo usa:** Planner (TAREA 1 de FASE 1)

**Cuándo se usa:**
- Al inicio de cada nueva implementación
- Para organizar análisis de requisitos y viabilidad

**Estructura:**
- Sección 1: Resumen Ejecutivo
- Sección 2: Análisis del Requerimiento (RF, RNF, constraints)
- Sección 3: Análisis de Viabilidad del Sistema (completada por System Analyser)
- Sección 4: Desglose de Fases (planificación inicial)
- Sección 5: Riesgos Iniciales

**Nota Importante:** Sección 3 se completa DESPUÉS de que el usuario valida Secciones 1-2-4.

---

### 2. TEMPLATE-plan.md
**Propósito:** Documento maestro del roadmap de implementación

**Quién lo usa:** Planner (TAREA 5 de FASE 1)

**Cuándo se usa:**
- DESPUÉS de validar requirements.md completo
- Para consolidar el roadmap de 5 fases

**Estructura:**
1. Resumen Ejecutivo
2. Visión General del Proyecto
3. Resumen de las 5 Fases
4. Cronograma Consolidado (Gantt Mermaid)
5. Matriz de Riesgos
6. Dependencias Externas
7. Estado General del Proyecto
8. Referencias y Documentos Relacionados

**Característica Clave:** Incluye diagrama Gantt en Mermaid para visualizar cronograma.

---

## 🚀 Cómo Usar Estos Templates

### Paso 1: Copiar el template
```bash
# Para requirements.md
cp .claude/docs/templates/TEMPLATE-requirements.md /docs/implementations/{nombre-feature}/requirements.md

# Para plan.md
cp .claude/docs/templates/TEMPLATE-plan.md /docs/implementations/{nombre-feature}/plan.md
```

### Paso 2: Reemplazar placeholders
Los templates contienen placeholders como `[Nombre Feature]`, `[Descripción]`, etc.
Reemplaza cada uno con información específica de tu implementación.

### Paso 3: Llenar secciones
- **requirements.md**: Planner llena Secciones 1-2-4-5, System Analyser llena Sección 3
- **plan.md**: Planner llena todas las secciones basándose en requirements.md validado

---

## 📋 Checklist de Uso

✅ ¿Entiendo qué template usar?
✅ ¿Copié el template a la ubicación correcta?
✅ ¿Reemplacé todos los placeholders?
✅ ¿Seguí el flujo de validación correcto?
✅ ¿Guardé en `/docs/implementations/{nombre-feature}/`?

---

## 🔗 Referencia Rápida

| Template | Ubicación | Cuándo Usarlo | Quién lo Usa |
|----------|-----------|---------------|-------------|
| TEMPLATE-requirements.md | Esta carpeta | Inicio de FASE 1 | Planner |
| TEMPLATE-plan.md | Esta carpeta | Después de validar requirements.md | Planner |

---

**Última actualización:** 2025-10-31
**Versión:** 1.0 - Documentación de Templates
