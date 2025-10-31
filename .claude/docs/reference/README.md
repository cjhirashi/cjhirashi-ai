# 🔍 REFERENCE - Documentación Técnica de Referencia

Esta carpeta contiene **documentación de referencia** - documentos técnicos que definen procesos, flujos y ubicaciones exactas.

Use esta carpeta cuando necesite consultas rápidas sobre "cómo funciona" o "dónde va esto".

---

## 📚 Documentos de Referencia

### 1. DESIGN_VALIDATION_FLOW.md
**Propósito:** Definir exactamente cómo funciona la validación de diseño

**Contenido:**
- Proceso de Design Consistency Validator
- Cómo valida contra documentación oficial
- Qué puede rechazar y por qué
- Cómo iterar en caso de rechazo
- Matriz de decisión (Aprueba / Requiere cambios / Rechaza)
- Escaladas y próximos pasos

**Cuándo consultarlo:**
- Durante FASE 2 (Diseño) cuando el Architect termina
- Cuando el Design Consistency Validator da feedback
- Cuando tienes dudas sobre qué se considera "válido" en diseño

**Público objetivo:** Architect, Design Consistency Validator, Maestro Orquestador

---

### 2. DOCUMENTATION_LOCATIONS.md
**Propósito:** Referencia rápida de dónde guarda cada especialista su documentación

**Contenido:**
- Ubicación exacta de documentación por especialista
- Nombre de archivos esperado
- Convención de nombres obligatoria
- Ejemplos correctos e incorrectos
- Tabla de referencia rápida (especialista → ubicación → tipo archivo)

**Cuándo consultarlo:**
- SIEMPRE que vas a guardar documentación
- Cuando tienes dudas sobre la estructura de carpetas
- Cuando creas un nuevo documento

**Público objetivo:** Todos los especialistas, Maestro Orquestador

**Nota:** Este es el documento más consultado - mantén referencia rápida.

---

## 🎯 Cómo Usar Esta Documentación

### Consulta Rápida de Ubicación
```
¿Dónde guarda el QA Validator su documentación?
→ Abre DOCUMENTATION_LOCATIONS.md
→ Busca "QA Validator" en la tabla
→ Obtén la ubicación exacta
```

### Entender Proceso de Validación
```
¿Cómo valida el Design Consistency Validator?
→ Lee DESIGN_VALIDATION_FLOW.md
→ Sigue el flujo de decisión
→ Entiende qué puede rechazar
```

---

## 📋 Decisión Rápida: Cuál Documento Consultar

**¿Dónde guardo esto?**
→ DOCUMENTATION_LOCATIONS.md

**¿Cómo funciona la validación de diseño?**
→ DESIGN_VALIDATION_FLOW.md

**¿Cuál es el flujo exacto?**
→ DESIGN_VALIDATION_FLOW.md

**¿Qué estructura de carpetas debo usar?**
→ DOCUMENTATION_LOCATIONS.md (o SEPARATION-OF-CONCERNS.md en guides)

---

## 🔑 Información Crítica

### Convención de Nombres Obligatoria
Todos los documentos deben seguir:
```
{tipo}-{proyecto}-{descripcion}.md
```

Ejemplos:
```
design-auth-system-flow.md
implementation-payment-integration.md
validation-user-dashboard.md
```

### Ubicaciones Principales
```
/docs/implementations/{nombre}/    ← Documentos de implementación
/docs/architecture/                ← Diseños
/docs/testing/                     ← Plans y reportes de testing
/docs/security/                    ← Auditorías y seguridad
/docs/operation/                   ← Guías de operación
```

---

## 💡 Tips de Uso

- **Estos documentos son prescriptivos** - no son sugerencias, son requisitos
- **Consulta DOCUMENTATION_LOCATIONS antes de guardar** - evita guardar en lugar incorrecto
- **Mantén enlace a estos documentos** en tus proyectos para fácil acceso
- **Si encuentras inconsistencias**, actualiza estos documentos primero

---

## 🔗 Referencias Cruzadas

| Necesito... | Documento |
|------------|-----------|
| Ubicación exacta de archivo | DOCUMENTATION_LOCATIONS.md |
| Entender flujo de validación de diseño | DESIGN_VALIDATION_FLOW.md |
| Saber si algo es correcto guardar | DOCUMENTATION_LOCATIONS.md |
| Clarificar .claude/docs vs /docs/ | SEPARATION-OF-CONCERNS.md en guides |
| Ejemplos de estructura | DOCUMENTATION_LOCATIONS.md |

---

## ⚡ Referencia Súper Rápida

```
DUDAS SOBRE UBICACIÓN → DOCUMENTATION_LOCATIONS.md
DUDAS SOBRE VALIDACIÓN DISEÑO → DESIGN_VALIDATION_FLOW.md
DUDAS GENERALES → Lee SEPARATION-OF-CONCERNS.md en guides
```

---

**Última actualización:** 2025-10-31
**Versión:** 1.0 - Documentación de Referencia
