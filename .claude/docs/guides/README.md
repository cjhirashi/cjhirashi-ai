# 📖 GUIDES - Guías y Explicaciones Detalladas

Esta carpeta contiene **guías** que explican cómo funcionan diferentes aspectos del sistema de orquestación.

Las guías proporcionan contexto, ejemplos y explicaciones para ayudarte a entender el "por qué" y el "cómo" del sistema.

---

## 📚 Guías Disponibles

### 1. PLAN-MD-GUIDE.md
**Propósito:** Entender qué es plan.md y cómo funciona como documento maestro

**Contenido:**
- Definición de plan.md (documento maestro central)
- Flujo entre requirements.md y plan.md
- Comparación: plan.md vs requirements.md
- Ciclo de vida de plan.md (creación, ejecución, finalización)
- Relación con documentos de fases
- Responsabilidades de actualización por fase
- Ejemplos de estado en diferentes momentos

**Cuándo leerla:**
- Cuando necesitas entender la visión general de plan.md
- Cuando tienes dudas sobre cómo actualizar plan.md
- Cuando quieres saber qué pasa en cada fase

**Público objetivo:** Maestro Orquestador, especialistas, usuario/PM

---

### 2. SEPARATION-OF-CONCERNS.md
**Propósito:** Clarificar la separación entre .claude/docs/ y /docs/

**Contenido:**
- Diferencia entre orquestación y documentación del proyecto
- Qué va en .claude/docs/ (sistema de orquestación)
- Qué va en /docs/ (documentación del proyecto)
- Estructura de carpetas de cada uno
- Ejemplos concretos de qué guardar dónde

**Cuándo leerla:**
- Cuando tienes dudas sobre dónde guardar documentación
- Cuando necesitas clarificar si algo es "orquestación" o "proyecto"
- Cuando creas nuevos documentos y no sabes dónde van

**Público objetivo:** Maestro Orquestador, todos los especialistas

---

## 🎯 Cómo Usar Estas Guías

### Si necesitas entender plan.md:
1. Lee **PLAN-MD-GUIDE.md** completamente
2. Luego consulta TEMPLATE-plan.md en `/templates/` para ver estructura

### Si tienes dudas sobre dónde guardar algo:
1. Lee **SEPARATION-OF-CONCERNS.md**
2. Luego consulta `/reference/DOCUMENTATION_LOCATIONS.md` para ubicaciones exactas

### Si quieres ejemplos específicos:
1. Busca la sección "Ejemplos" en cada guía
2. Adapta los ejemplos a tu caso específico

---

## 🔑 Conceptos Clave

### .claude/docs/ (Orquestación)
- **Qué contiene:** Sistema de cómo implementar
- **Quién lo usa:** Maestro Orquestador, especialistas
- **Estructura:** Templates, guides, reference
- **No cambia:** Frecuencia (es estable)

### /docs/ (Proyecto)
- **Qué contiene:** Documentación del proyecto
- **Quién lo usa:** Equipo, usuarios, documentadores
- **Estructura:** implementations, architecture, testing, etc.
- **Cambia:** Constantemente (crece con el proyecto)

---

## 📋 Mapa Mental de Lectura

**Nuevo en el sistema?**
```
SEPARATION-OF-CONCERNS.md
    ↓
README.md en .claude/docs/ (índice central)
    ↓
PLAN-MD-GUIDE.md (si trabajas con plans)
    ↓
TEMPLATE-plan.md (en /templates/)
```

**¿Dudas sobre dónde guardar?**
```
SEPARATION-OF-CONCERNS.md
    ↓
/reference/DOCUMENTATION_LOCATIONS.md
```

**¿Dudas sobre plan.md?**
```
PLAN-MD-GUIDE.md
    ↓
TEMPLATE-plan.md (en /templates/)
    ↓
Lee ejemplos de estado en PLAN-MD-GUIDE.md
```

---

## 💡 Consejos

- **Lee las guías completas**, no solo busques palabras clave
- **Los ejemplos son reales** - puedes adaptarlos a tu caso
- **Regresa a estas guías** cuando tengas dudas conceptuales
- **Combina con SEPARATION-OF-CONCERNS.md** si tienes dudas de ubicación

---

## 🔗 Referencias Cruzadas

| Si buscas... | Lee esto |
|-------------|----------|
| Entender plan.md | PLAN-MD-GUIDE.md |
| Clarificar .claude/docs vs /docs/ | SEPARATION-OF-CONCERNS.md |
| Ubicaciones exactas de archivos | `/reference/DOCUMENTATION_LOCATIONS.md` |
| Templates para usar | `/templates/README.md` |

---

**Última actualización:** 2025-10-31
**Versión:** 1.0 - Documentación de Guías
