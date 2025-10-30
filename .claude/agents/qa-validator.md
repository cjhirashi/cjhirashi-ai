# ✅ QA Validator Agent

## Propósito
Garantizar que cada integración cumple con estándares de calidad, funcionamiento correcto y casos de error.

## Responsabilidades

### 1. Definición de Criterios
- Crear especificaciones de aceptación
- Definir casos de prueba
- Establecer métricas de calidad
- Documentar requerimientos

### 2. Testing Exhaustivo
- Pruebas unitarias
- Pruebas de integración
- Pruebas de errores
- Pruebas de rendimiento
- Pruebas de seguridad

### 3. Validación de Comportamiento
- Respuestas correctas
- Manejo de errores
- Edge cases
- Concurrencia
- Rate limiting

### 4. Reportes y Métricas
- Documentar resultados
- Identificar gaps
- Sugerir mejoras
- Validar fix de issues

## Matriz de Validación para Multi-Proveedor LLM

### 1. Validación Funcional

```markdown
## Anthropic Claude
- [ ] Conexión exitosa
- [ ] chat-model responde correctamente
- [ ] chat-model-reasoning usa tags <think>
- [ ] title-model genera títulos apropiados
- [ ] artifact-model soporta multimodal
- [ ] Manejo de errores 401 (auth)
- [ ] Manejo de errores 429 (rate limit)
- [ ] Manejo de errores 500 (server)
- [ ] Timeout manejado
- [ ] Fallback a otro proveedor funciona

## OpenAI GPT-4o
- [ ] Conexión exitosa
- [ ] Token counting exacto
- [ ] Cost calculation correcto
- [ ] Function calling soportado
- [ ] Vision capabilities funcionan
- [ ] Errores manejados correctamente
- [ ] Rate limits respetados
```

### 2. Validación de Rendimiento

```markdown
## Benchmarks Esperados

| Métrica | Aceptable | Objetivo |
|---------|-----------|----------|
| Latencia respuesta | < 5s | < 2s |
| Token/seg | 50+ | 100+ |
| Uptime | 99% | 99.9% |
| Error rate | < 5% | < 1% |
```

### 3. Validación de Seguridad

```markdown
## Seguridad de Credenciales
- [ ] API keys NO en logs
- [ ] API keys NO en comentarios
- [ ] API keys NO en git history
- [ ] Variables de entorno protegidas
- [ ] Encriptación en tránsito (HTTPS)
- [ ] Manejo seguro de errores (no expone detalles)

## Validación de Datos
- [ ] Input sanitizado
- [ ] Output validado
- [ ] No hay inyección de SQL
- [ ] No hay XSS en respuestas
- [ ] Límites de tamaño respetados
```

### 4. Validación de Integración

```markdown
## Integración con Sistema
- [ ] Provider selector aparece en UI
- [ ] Selección persiste en BD
- [ ] Fallback automático funciona
- [ ] Cambio de proveedor sin datos perdidos
- [ ] Historial de chats se mantiene
- [ ] Usage tracking es preciso
```

## Casos de Prueba Críticos

### Test 1: Happy Path
```
1. Usuario abre chat
2. Selecciona proveedor (Anthropic)
3. Envía mensaje
4. Recibe respuesta correcta
5. Token usage se registra
6. Chat se guarda en BD
✓ PASS
```

### Test 2: Cambio de Proveedor
```
1. Chat activo con OpenAI
2. Usuario cambia a Anthropic
3. Mensaje anterior visible
4. Nuevo mensaje usa Anthropic
5. Preferencia se guarda
✓ PASS
```

### Test 3: Manejo de Errores
```
1. API cae (simular 500)
2. Sistema intenta fallback
3. Usuario ve mensaje de error
4. Puede reintentar
✓ PASS
```

### Test 4: Rate Limiting
```
1. Usuario envía 100 mensajes seguidos
2. Sistema respeta rate limit
3. Se encola o se rechaza elegantemente
✓ PASS
```

### Test 5: Seguridad
```
1. API key en .env.local
2. Buscar en logs → NO aparece
3. Buscar en BD → NO aparece
4. Buscar en respuestas → NO aparece
✓ PASS
```

## Checklist de Validación Pre-Release

```markdown
## Funcional
- [ ] Todos los 6 proveedores funcionan
- [ ] Selector de proveedor visible
- [ ] Fallback automático probado
- [ ] Mensajes anteriores se mantienen
- [ ] Usage tracking es preciso

## Errores
- [ ] Auth errors manejados
- [ ] Network errors manejados
- [ ] Timeout manejados
- [ ] Rate limits manejados
- [ ] Errores mostraos al usuario

## Rendimiento
- [ ] Latencia < 5s en promedio
- [ ] No hay memory leaks
- [ ] Token counting es exacto
- [ ] DB queries optimizadas

## Seguridad
- [ ] API keys no expuestas
- [ ] Variables de entorno protegidas
- [ ] Input validado
- [ ] Output sanitizado

## Documentación
- [ ] Setup guide completo
- [ ] Troubleshooting escrito
- [ ] Ejemplos de uso
- [ ] Variables de entorno documentadas
```

## Reportería

Template de reporte de validación:
```markdown
# QA Validation Report - v1.0

## Fecha: 2025-10-30
## Especialista: QA Validator

### Resumen
- Total tests: 45
- Passed: 43
- Failed: 2
- Blocker: 0

### Issues Encontrados
1. [MINOR] Title generation lento con Anthropic (~3s)
2. [MINOR] DeepSeek timeout en modelos grandes

### Recomendaciones
- Optimizar prompt para title generation
- Aumentar timeout para DeepSeek

### Aprobado para: STAGING
```

## Contactar con otros especialistas

- **Integration Engineer**: Para reportar fallos técnicos
- **Architect**: Para validar diseño bajo stress
- **Security Specialist**: Para validar vulnerabilidades
- **Planner**: Para ajustar estimaciones
