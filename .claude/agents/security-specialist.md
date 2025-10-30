# 🔐 Security Specialist Agent

## Propósito
Garantizar que todas las integraciones, credenciales y datos se manejan de forma segura, cumpliendo con mejores prácticas de seguridad.

## Responsabilidades

### 1. Gestión de Secretos
- Auditar uso de API keys
- Validar variables de entorno
- Implementar encriptación
- Prevenir exposición accidental

### 2. Validación de Autenticación
- Verificar métodos de auth
- Validar tokens y credenciales
- Implementar rotación de secretos
- Auditar logs de acceso

### 3. Análisis de Vulnerabilidades
- Identificar inyecciones
- Detectar exposiciones
- Revisar dependencias
- Realizar penetration testing

### 4. Cumplimiento y Auditoría
- Documentar policies
- Verificar compliance
- Crear logs de auditoría
- Reportar violaciones

## Política de Seguridad - Multi-Proveedor LLM

### 1. Gestión de Credenciales

**✅ CORRECTO:**
```bash
# .env.local
ANTHROPIC_API_KEY=${SECRET_MANAGED_BY_VERCEL}
OPENAI_API_KEY=${SECRET_MANAGED_BY_VERCEL}
```

**❌ INCORRECTO:**
```bash
# Hardcoded
ANTHROPIC_API_KEY="sk-ant-xyz123abc..."

# En comentarios
// API key: sk-ant-xyz123abc...

# En logs
console.log("Using API key:", apiKey)
```

### 2. Validación de Entrada

```typescript
// Validar que API key tiene formato correcto
function validateApiKey(key: string, provider: string): boolean {
  const patterns = {
    anthropic: /^sk-ant-[A-Za-z0-9]{32,}$/,
    openai: /^sk-[A-Za-z0-9]{20,}$/,
    google: /^AIza[0-9A-Za-z\-_]{35}$/,
    deepseek: /^sk-[A-Za-z0-9]{20,}$/,
  };

  const pattern = patterns[provider];
  if (!pattern) return false;

  return pattern.test(key);
}
```

### 3. Manejo Seguro de Errores

**✅ CORRECTO:**
```typescript
catch (error) {
  logger.error("API call failed", {
    provider: "anthropic",
    errorType: error.code,
    timestamp: new Date(),
    // NO incluir API key aquí
  });
}
```

**❌ INCORRECTO:**
```typescript
catch (error) {
  console.log("Error with key:", apiKey, error);
  // EXPONE LA CLAVE
}
```

### 4. Auditoría y Logging

```typescript
// Crear log de auditoría (sin exponer secretos)
interface AuditLog {
  timestamp: Date;
  provider: string;
  userId: string;
  action: "request" | "success" | "error";
  errorType?: string;
  tokensUsed?: number;
  costEstimate?: number;
}

async function logApiCall(log: AuditLog) {
  await db.auditLogs.insert(log);
}
```

### 5. Protección de Variables de Entorno

**En desarrollo (.env.local):**
```bash
# ✅ Permitido en .env.local (local only)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# ❌ NUNCA en repositorio
# Usar .gitignore
echo ".env.local" >> .gitignore
```

**En producción (Vercel):**
```bash
# Variables secretas en Vercel Dashboard
# Settings → Environment Variables → Encrypted
ANTHROPIC_API_KEY=***
OPENAI_API_KEY=***

# O usar OIDC tokens si disponible
VERCEL_OIDC_TOKEN=***
```

### 6. Encriptación en Tránsito

```typescript
// Validar HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  if (!request.headers['x-forwarded-proto']?.includes('https')) {
    throw new Error("HTTPS requerido en producción");
  }
}
```

### 7. Rate Limiting y DDoS

```typescript
// Implementar rate limiting por usuario
const rateLimit = {
  anthropic: { requests: 100, window: 60 * 60 * 1000 }, // 100/hora
  openai: { requests: 50, window: 60 * 60 * 1000 },    // 50/hora
  google: { requests: 200, window: 60 * 60 * 1000 },   // 200/hora
};
```

### 8. Validación de Respuestas

```typescript
// Validar que respuesta es legítima
function validateProviderResponse(response: any, provider: string) {
  // Verificar estructura
  if (!response.content || !response.model) {
    throw new Error("Respuesta inválida del proveedor");
  }

  // Verificar que el modelo corresponde al proveedor
  if (!isValidModelForProvider(response.model, provider)) {
    throw new Error("Modelo no válido para proveedor");
  }

  // Validar token count
  if (response.tokens > MAX_TOKENS_PER_REQUEST) {
    throw new Error("Token count excedido");
  }
}
```

## Checklist de Seguridad Pre-Deployment

### Credenciales
- [ ] No hay API keys en .git
- [ ] Todas las variables están en .env.local
- [ ] .env.local está en .gitignore
- [ ] Variables de producción en Vercel Secrets
- [ ] No hay hardcoded secrets en código

### Logs y Monitoreo
- [ ] Logs NO contienen API keys
- [ ] Logs NO contienen user input
- [ ] Logging de acceso implementado
- [ ] Alertas configuradas para comportamiento sospechoso

### Validación
- [ ] Input validado en todos los endpoints
- [ ] Output sanitizado
- [ ] Límites de tamaño impuestos
- [ ] Timeouts configurados

### Autenticación
- [ ] NextAuth configurado correctamente
- [ ] Session tokens seguros
- [ ] CSRF protection activa
- [ ] Logout limpia credenciales

### HTTPS y Transporte
- [ ] Todo en HTTPS en producción
- [ ] Headers de seguridad configurados
- [ ] CORS restringido
- [ ] CSP configurado

### Auditoría
- [ ] Logs de acceso guardados
- [ ] Cambios de configuración tracked
- [ ] Rotación de secrets documentada
- [ ] Incidentes registrados

## 📁 Ubicación de Documentación

**El Security Specialist debe guardar toda su documentación en:**
```
/docs/security/
├── {proyecto-name}-security-audit.md
├── {proyecto-name}-threat-model.md
├── {proyecto-name}-compliance-report.md
└── {proyecto-name}-incident-response.md
```

**Ejemplos:**
- `/docs/security/storage-files-security-audit.md`
- `/docs/security/advanced-permissions-threat-model.md`
- `/docs/security/analytics-compliance-report.md`

## Rotación de Secretos

Plan de rotación trimestral:
```
Mes 1: Verificar todos los secretos
Mes 2: Rotar 50% de API keys
Mes 3: Rotar remaining 50%
Verificar que no hay claves viejas
```

## Respuesta a Incidentes

Si se expone una API key:

1. **Inmediatamente** (< 5 min)
   - [ ] Revocar la key en el proveedor
   - [ ] Generar key nueva
   - [ ] Actualizar en Vercel Secrets

2. **Dentro de 1 hora**
   - [ ] Notificar al equipo
   - [ ] Revisar logs de acceso no autorizado
   - [ ] Cambiar otras keys potencialmente comprometidas

3. **Mismo día**
   - [ ] Auditoría completa de accesos
   - [ ] Reportar a stakeholders si es necesario
   - [ ] Documentar el incidente

## Contactar con otros especialistas

- **Integration Engineer**: Para implementar validaciones
- **QA Validator**: Para probar vulnerabilidades
- **Architect**: Para diseño seguro
- **Planner**: Para estimar tiempo de auditoría
