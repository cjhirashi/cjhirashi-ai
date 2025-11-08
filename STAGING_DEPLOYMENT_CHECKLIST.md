# CHECKLIST DE DEPLOYMENT A STAGING ✅

**Branch:** feature/dashboard-restructure
**Estado:** PRODUCTION-READY
**Plataforma:** Vercel

---

## FASE 1: PRE-DEPLOYMENT (15 minutos)

### ✅ Verificación de Build Local

```bash
# Limpiar y rebuilder
rm -rf .next
pnpm build
```

**Resultado Esperado:**
- ✓ Compiled successfully
- ✓ 40 rutas generadas
- ✓ 0 errores

**Status:** [ ] COMPLETADO

---

### ✅ Configurar Variables de Entorno en Vercel

#### Paso 1: Login a Vercel
```bash
vercel login
```

#### Paso 2: Link al proyecto (si no está linkeado)
```bash
vercel link
```

#### Paso 3: Agregar variables de entorno

```bash
# AUTH_SECRET (generar nuevo para staging)
openssl rand -base64 32
# Copiar output y ejecutar:
vercel env add AUTH_SECRET production

# POSTGRES_URL (usar database de staging)
vercel env add POSTGRES_URL production

# BLOB_READ_WRITE_TOKEN
vercel env add BLOB_READ_WRITE_TOKEN production

# OPCIONAL: REDIS_URL (para resumable streams)
vercel env add REDIS_URL production

# NODE_ENV (forzar producción)
vercel env add NODE_ENV production
```

#### Paso 4: Verificar variables
```bash
vercel env ls
```

**Variables Requeridas:**
- [ ] AUTH_SECRET
- [ ] POSTGRES_URL
- [ ] BLOB_READ_WRITE_TOKEN
- [ ] NODE_ENV=production

**Status:** [ ] COMPLETADO

---

### ✅ Preparar Base de Datos de Staging

#### Opción A: Crear nueva database en Neon

1. Ir a https://console.neon.tech/
2. Click "New Project" → "Create new database"
3. Nombrar: `cjhirashi-ai-staging`
4. Copiar connection string
5. Ejecutar migraciones:

```bash
# Configurar POSTGRES_URL temporalmente para migraciones
export POSTGRES_URL="tu-staging-connection-string"

# Ejecutar migraciones
pnpm db:migrate

# Verificar schema
pnpm db:studio
```

**Status:** [ ] COMPLETADO

---

### ✅ Push de Cambios Finales

```bash
# Verificar branch
git status

# Add y commit de documentación de deployment
git add DEPLOYMENT_STAGING_GUIDE.md STAGING_DEPLOYMENT_CHECKLIST.md
git commit -m "docs: Add staging deployment documentation"

# Push a GitHub
git push origin feature/dashboard-restructure
```

**Status:** [ ] COMPLETADO

---

## FASE 2: DEPLOYMENT (5-10 minutos)

### ✅ Ejecutar Deploy

#### Opción A: Deploy desde CLI (RECOMENDADO)

```bash
vercel --prod
```

#### Opción B: Deploy desde Dashboard

1. Ir a https://vercel.com/dashboard
2. Seleccionar proyecto
3. Click "Deploy" → Branch: `feature/dashboard-restructure`
4. Confirmar deployment

**URL de Staging:** _____________________________ (anotar aquí)

**Status:** [ ] COMPLETADO

---

### ✅ Verificar Deployment Exitoso

Esperar a que Vercel muestre:
```
✓ Production: https://tu-staging-url.vercel.app [copied to clipboard]
```

**Status:** [ ] COMPLETADO

---

## FASE 3: VERIFICACIÓN POST-DEPLOYMENT (20 minutos)

### ✅ Health Checks Básicos

```bash
# Test 1: Ping
curl https://tu-staging-url.vercel.app/ping
# Esperado: "pong"

# Test 2: Root page
curl -I https://tu-staging-url.vercel.app/
# Esperado: 307 redirect

# Test 3: API (sin auth)
curl https://tu-staging-url.vercel.app/api/chat
# Esperado: 401 Unauthorized
```

**Status:** [ ] COMPLETADO

---

### ✅ Verificación de Rutas Principales

Abrir en navegador y verificar:

**Public Routes:**
- [ ] `/` → Redirige correctamente según estado de auth
- [ ] `/landing` → Muestra landing page
- [ ] `/login` → Muestra login form
- [ ] `/register` → Muestra register form

**Legacy Routes (Backward Compatibility):**
- [ ] `/chat` → Redirige a `/dashboard/agents/chat-general`
- [ ] `/chat/test123` → Redirige a `/dashboard/agents/chat-general/test123`

**Dashboard Routes:**
- [ ] `/dashboard` → Redirige a login (sin auth) o muestra dashboard (con auth)
- [ ] `/dashboard/agents/chat-general` → Muestra chat
- [ ] `/dashboard/documents` → Muestra documents page

**Status:** [ ] COMPLETADO

---

### ✅ Test Flow de Usuario Completo

#### 1. Guest User Flow
- [ ] Navegar a `/` sin estar autenticado
- [ ] Sistema crea guest user automáticamente
- [ ] Redirige a `/landing`
- [ ] Landing page se muestra correctamente

#### 2. Registration Flow
- [ ] Click "Register" desde landing o ir a `/register`
- [ ] Completar form: `test@example.com` / `TestPassword123!`
- [ ] Registro exitoso
- [ ] Redirige a `/dashboard`

#### 3. Login Flow
- [ ] Logout (si está autenticado)
- [ ] Ir a `/login`
- [ ] Login con credenciales: `test@example.com` / `TestPassword123!`
- [ ] Login exitoso
- [ ] Redirige a `/dashboard`

#### 4. Chat Functionality
- [ ] Click en "New Chat" (+)
- [ ] Enviar mensaje: "Hello, test message"
- [ ] Recibir respuesta del AI (streaming)
- [ ] Verificar que mensaje se guarda en historial

#### 5. Navigation Performance
- [ ] Click en logo "Chatbot" → Navegación rápida a chat-general
- [ ] Click en chat del historial → Abre conversación directamente
- [ ] Click en "Documents" → Muestra documents page
- [ ] Navegación se siente responsive (< 100ms)

#### 6. Security Validations
- [ ] Intentar 6 logins incorrectos → Rate limit activa
- [ ] Intentar registrar con `guest-123@example.com` → Rechazado
- [ ] Acceder a `/dashboard` sin auth → Redirige a login
- [ ] Guest user intenta acceder a dashboard → Redirige a register

**Status:** [ ] COMPLETADO

---

### ✅ Performance Testing

#### Lighthouse Score (Target: > 80)

```bash
npx lighthouse https://tu-staging-url.vercel.app --view
```

**Resultados:**
- Performance: _____ / 100
- Accessibility: _____ / 100
- Best Practices: _____ / 100
- SEO: _____ / 100

**Target:** Todos > 80

**Status:** [ ] COMPLETADO

---

### ✅ Error Monitoring Setup

#### Verificar Logs en Tiempo Real

```bash
vercel logs --follow
```

**Qué buscar:**
- ✓ No hay errores críticos
- ✓ Requests completan exitosamente
- ✓ No hay memory leaks
- ✓ Response times < 500ms

**Status:** [ ] COMPLETADO

---

## FASE 4: MONITOREO CONTINUO (Primeras 24-48 horas)

### ✅ Dashboard de Vercel

Ir a: https://vercel.com/dashboard → Tu Proyecto → Analytics

**Métricas a Monitorear:**
- [ ] Request count (ver patrones de tráfico)
- [ ] Error rate (debe ser < 1%)
- [ ] Response times (p95 < 500ms)
- [ ] Geographic distribution

**Status:** [ ] EN PROGRESO

---

### ✅ Database Monitoring

Ir a: Neon Console → Tu Database Staging → Monitoring

**Métricas a Monitorear:**
- [ ] Connection count (debe ser estable)
- [ ] Query performance (< 100ms promedio)
- [ ] Storage usage
- [ ] No errores de conexión

**Status:** [ ] EN PROGRESO

---

### ✅ Alertas Configuradas

**Alertas Recomendadas en Vercel:**
- [ ] Error rate > 5% → Email alert
- [ ] Response time p95 > 1000ms → Email alert
- [ ] Deployment failed → Email alert

**Configurar en:** Vercel Dashboard → Settings → Notifications

**Status:** [ ] COMPLETADO

---

## TROUBLESHOOTING RÁPIDO

### Si Build Falla

```bash
# 1. Verificar build local
pnpm build

# 2. Revisar logs de Vercel
vercel logs

# 3. Verificar variables de entorno
vercel env ls
```

### Si Auth No Funciona

1. Verificar `AUTH_SECRET` está configurado
2. Verificar `POSTGRES_URL` es accesible
3. Verificar secure cookies habilitados
4. Clear browser cookies y cache

### Si AI No Responde

1. Verificar `AI_GATEWAY_API_KEY` (si no es Vercel)
2. Revisar logs: `vercel logs --filter "api/chat"`
3. Verificar modelo disponible en AI Gateway

### Si Redirects No Funcionan

1. Clear browser cache
2. Verificar `middleware.ts` desplegado
3. Verificar Network tab en DevTools

---

## ROLLBACK PLAN

Si algo sale mal, rollback inmediato:

### Desde Vercel Dashboard
1. Ir a Deployments
2. Encontrar deployment anterior exitoso
3. Click "..." → "Promote to Production"

### Desde CLI
```bash
vercel ls
vercel rollback [url-del-deployment-anterior]
```

---

## RESUMEN DE STATUS

**Pre-Deployment:**
- [ ] Build local exitoso
- [ ] Variables de entorno configuradas
- [ ] Database preparada
- [ ] Cambios pushed a GitHub

**Deployment:**
- [ ] Deploy ejecutado exitosamente
- [ ] URL de staging obtenida
- [ ] Deployment completado sin errores

**Post-Deployment:**
- [ ] Health checks pasados
- [ ] Rutas principales funcionando
- [ ] Test flow completo exitoso
- [ ] Performance aceptable
- [ ] Monitoring configurado

**Monitoreo Continuo:**
- [ ] Vercel Analytics activo
- [ ] Database monitoring activo
- [ ] Alertas configuradas
- [ ] Logs siendo revisados

---

## SIGUIENTE PASO

Una vez que TODOS los checkboxes estén marcados:

1. ✅ Documentar URL de staging en README
2. ✅ Notificar al equipo que staging está listo
3. ✅ Comenzar testing período (1-2 semanas)
4. ✅ Recopilar feedback
5. ✅ Preparar para producción

---

**Última Actualización:** 2025-11-08
**Preparado Por:** Claude Code
**Estado del Sistema:** LISTO PARA DEPLOYMENT

**URL DE STAGING:** _____________________________ (completar después de deployment)
