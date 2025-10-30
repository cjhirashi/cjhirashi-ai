# Plan: Homepage + Dashboard de Agentes + Google OAuth

**Versión:** 1.0
**Fecha:** 2025-10-30
**Proyecto:** cjhirashi-ai
**Duración Estimada:** 40-48 horas de trabajo de agente

---

## Resumen Ejecutivo

Este plan detalla la implementación de una página principal con sistema de agentes, dashboard de usuario y autenticación con Google OAuth. El sistema permitirá a los usuarios acceder a agentes de IA especializados según los permisos asignados por el superusuario.

---

## Fase 1: Preparación de Base de Datos (8 horas)

### 1.1 Extensión del Schema Existente

**Tareas:**
1. Modificar tabla `User` para incluir campos de Google OAuth
2. Crear tabla `Agent` para catálogo de agentes
3. Crear tabla `Agent_Access` para control de acceso
4. Crear tabla `Agent_Category` para categorización
5. Crear tabla `User_Session_Log` para auditoría

**Archivos a modificar:**
- `lib/db/schema.ts`

**Schema propuesto:**

```typescript
// Extensión de User
user: {
  id: uuid (existente)
  email: varchar(64) (existente)
  password: varchar(64) nullable (existente)
  name: varchar(100) nullable
  image: text nullable
  googleId: varchar(100) nullable unique
  isSuperUser: boolean default false
  isActive: boolean default true
  createdAt: timestamp
  lastLoginAt: timestamp nullable
}

// Nueva tabla Agent
agent: {
  id: uuid primary key
  code: varchar(50) unique not null
  name: varchar(100) not null
  description: text not null
  categoryId: uuid references Agent_Category
  isPublic: boolean default false
  isDefault: boolean default false
  modelId: varchar(100) not null
  systemPrompt: text
  maxTokens: integer default 4096
  temperature: float default 0.7
  icon: varchar(50) nullable
  sortOrder: integer default 0
  isActive: boolean default true
  createdAt: timestamp
}

// Nueva tabla Agent_Category
agentCategory: {
  id: uuid primary key
  name: varchar(100) not null
  description: text nullable
  icon: varchar(50) nullable
  sortOrder: integer default 0
  isActive: boolean default true
}

// Nueva tabla Agent_Access
agentAccess: {
  id: uuid primary key
  userId: uuid references User not null
  agentId: uuid references Agent not null
  grantedBy: uuid references User not null
  grantedAt: timestamp not null
  expiresAt: timestamp nullable
  isActive: boolean default true
  unique(userId, agentId)
}

// Nueva tabla User_Session_Log
userSessionLog: {
  id: uuid primary key
  userId: uuid references User not null
  loginAt: timestamp not null
  logoutAt: timestamp nullable
  ipAddress: varchar(45) nullable
  userAgent: text nullable
  authMethod: varchar(20) not null // 'google', 'credentials', 'guest'
}
```

**Dependencias:** Ninguna

**Criterios de éxito:**
- ✅ Migraciones generadas sin errores
- ✅ Base de datos actualizada correctamente
- ✅ Tipos TypeScript generados automáticamente

**Riesgos:**
- 🔴 Conflictos con migraciones existentes → Mitigación: Revisar historial de migraciones
- 🟡 Pérdida de datos → Mitigación: Backup antes de migración

---

## Fase 2: Configuración de Google OAuth (6 horas)

### 2.1 Setup de Google OAuth Provider

**Tareas:**
1. Configurar Google Cloud Console y obtener credenciales
2. Agregar variables de entorno para OAuth
3. Integrar Google Provider en NextAuth
4. Modificar callbacks para manejo de datos de Google
5. Actualizar middleware de autenticación

**Archivos a modificar:**
- `.env.local`
- `app/(auth)/auth.config.ts`
- `app/(auth)/auth.ts`
- `middleware.ts`

**Configuración NextAuth:**

```typescript
// auth.ts - Agregar Google Provider
import Google from "next-auth/providers/google";

providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code"
      }
    }
  }),
  // Mantener Credentials existente
  // Mantener Guest existente
]

// Callbacks actualizados
callbacks: {
  async signIn({ user, account, profile }) {
    if (account?.provider === "google") {
      // Crear o actualizar usuario con datos de Google
      await upsertGoogleUser({
        email: user.email,
        name: user.name,
        image: user.image,
        googleId: account.providerAccountId
      });
    }
    return true;
  },

  async jwt({ token, user, account }) {
    if (account?.provider === "google") {
      token.type = "regular";
      // Verificar si es superusuario
      const dbUser = await getUserByEmail(user.email);
      token.isSuperUser = dbUser.isSuperUser;
    }
    return token;
  },

  async session({ session, token }) {
    session.user.type = token.type;
    session.user.isSuperUser = token.isSuperUser;
    return session;
  }
}
```

**Variables de entorno nuevas:**
```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Dependencias nuevas:**
- `next-auth/providers/google` (ya incluido en next-auth)

**Criterios de éxito:**
- ✅ Login con Google funcional
- ✅ Datos de perfil de Google almacenados
- ✅ Sesión mantiene tipo de usuario y permisos

**Riesgos:**
- 🔴 Configuración incorrecta de Google Cloud → Documentar proceso paso a paso
- 🟡 Conflictos con providers existentes → Test exhaustivo de todos los métodos

---

## Fase 3: Homepage y Navegación (10 horas)

### 3.1 Crear Homepage Pública

**Tareas:**
1. Diseñar y crear landing page
2. Implementar hero section con CTA
3. Crear sección de características
4. Implementar sección de agentes disponibles (preview)
5. Agregar footer con links

**Archivos a crear:**
- `app/(landing)/page.tsx`
- `app/(landing)/layout.tsx`
- `components/landing/hero.tsx`
- `components/landing/features.tsx`
- `components/landing/agents-preview.tsx`
- `components/landing/footer.tsx`

**Estructura de componentes:**

```typescript
// Hero Section
- Título principal
- Subtítulo explicativo
- Botones CTA: "Comenzar Gratis" | "Ver Demo"
- Imagen/Animación de showcase

// Features Section
- Grid de 3 columnas
- Características principales del sistema
- Iconos y descripciones

// Agents Preview
- Carrusel o grid de agentes públicos
- Categorías visibles
- Badge de "Requiere Registro"
```

### 3.2 Sistema de Navegación

**Tareas:**
1. Crear navbar responsive
2. Implementar menú de usuario
3. Agregar navegación condicional por tipo de usuario
4. Implementar breadcrumbs para dashboard

**Archivos a crear/modificar:**
- `components/layout/navbar.tsx`
- `components/layout/user-menu.tsx`
- `components/layout/breadcrumbs.tsx`
- `app/layout.tsx` (actualizar)

**Criterios de éxito:**
- ✅ Homepage responsive y atractiva
- ✅ Navegación clara e intuitiva
- ✅ CTAs funcionan correctamente
- ✅ Menú de usuario muestra info correcta

**Riesgos:**
- 🟡 Inconsistencias de diseño → Usar sistema de diseño existente (Tailwind + shadcn)

---

## Fase 4: Dashboard de Agentes (12 horas)

### 4.1 Dashboard Principal de Usuario

**Tareas:**
1. Crear layout de dashboard
2. Implementar sidebar con categorías de agentes
3. Crear grid/lista de agentes disponibles
4. Implementar filtros y búsqueda
5. Crear tarjetas de agente con acciones

**Archivos a crear:**
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/layout.tsx`
- `components/dashboard/agents-grid.tsx`
- `components/dashboard/agent-card.tsx`
- `components/dashboard/category-sidebar.tsx`
- `components/dashboard/search-filter.tsx`

### 4.2 Integración con Chat de Agentes

**Tareas:**
1. Modificar sistema de chat existente para soportar múltiples agentes
2. Crear selector de agente en interfaz de chat
3. Implementar cambio dinámico de modelo/prompt
4. Actualizar API de chat para validar acceso a agente

**Archivos a modificar:**
- `app/(chat)/api/chat/route.ts`
- `components/chat.tsx`
- `lib/ai/providers.ts`
- `hooks/use-agent.ts` (crear)

**Lógica de selección de agente:**

```typescript
// Hook para gestión de agente activo
export function useAgent() {
  const [activeAgent, setActiveAgent] = useState(null);
  const { data: availableAgents } = useSWR('/api/agents/available');

  const selectAgent = async (agentId: string) => {
    // Validar acceso
    const hasAccess = await validateAgentAccess(agentId);
    if (!hasAccess) {
      toast.error("No tienes acceso a este agente");
      return;
    }

    // Cambiar agente activo
    setActiveAgent(agentId);

    // Actualizar contexto de chat
    updateChatContext({ agentId });
  };

  return { activeAgent, availableAgents, selectAgent };
}
```

### 4.3 Página de Detalle de Agente

**Tareas:**
1. Crear página de información detallada del agente
2. Mostrar capacidades y ejemplos
3. Implementar botón de "Iniciar Chat"
4. Mostrar estadísticas de uso (si aplica)

**Archivos a crear:**
- `app/(dashboard)/agents/[id]/page.tsx`
- `components/agents/agent-detail.tsx`
- `components/agents/agent-capabilities.tsx`

**Criterios de éxito:**
- ✅ Dashboard muestra agentes correctamente filtrados por permisos
- ✅ Cambio de agente funciona sin problemas
- ✅ Chat mantiene contexto del agente seleccionado
- ✅ Validación de acceso funciona correctamente

**Riesgos:**
- 🔴 Complejidad en integración con chat existente → Análisis detallado del código actual
- 🟡 Performance con muchos agentes → Implementar paginación/virtualización

---

## Fase 5: APIs y Servicios (6 horas)

### 5.1 API de Agentes

**Tareas:**
1. Crear endpoint para listar agentes disponibles
2. Implementar endpoint de validación de acceso
3. Crear endpoint para obtener detalle de agente
4. Implementar caché de permisos

**Archivos a crear:**
- `app/api/agents/route.ts`
- `app/api/agents/[id]/route.ts`
- `app/api/agents/validate-access/route.ts`
- `lib/services/agent-service.ts`

**Endpoints:**

```typescript
// GET /api/agents
// Lista agentes disponibles para el usuario actual
{
  agents: [
    {
      id: string,
      name: string,
      description: string,
      category: string,
      hasAccess: boolean,
      isDefault: boolean
    }
  ]
}

// GET /api/agents/:id
// Detalle completo del agente

// POST /api/agents/validate-access
// Valida si usuario tiene acceso al agente
```

### 5.2 Servicios de Base de Datos

**Tareas:**
1. Crear queries para gestión de agentes
2. Implementar funciones de control de acceso
3. Crear helpers para auditoría

**Archivos a crear/modificar:**
- `lib/db/queries.ts`
- `lib/db/agent-queries.ts`

**Criterios de éxito:**
- ✅ APIs responden correctamente
- ✅ Validación de permisos es consistente
- ✅ Performance adecuado en queries

**Riesgos:**
- 🟡 N+1 queries → Optimizar con joins y caché

---

## Fase 6: Testing y Validación (8 horas)

### 6.1 Tests de Integración

**Tareas:**
1. Tests de flujo de autenticación con Google
2. Tests de control de acceso a agentes
3. Tests de dashboard y navegación
4. Tests de integración con chat

**Archivos a crear:**
- `tests/auth/google-oauth.test.ts`
- `tests/agents/access-control.test.ts`
- `tests/dashboard/navigation.test.ts`

### 6.2 Validación de Seguridad

**Tareas:**
1. Validar protección de rutas
2. Verificar control de acceso en APIs
3. Auditar manejo de tokens y sesiones
4. Revisar políticas CORS

**Criterios de éxito:**
- ✅ Todos los tests pasan
- ✅ No hay vulnerabilidades de seguridad
- ✅ Performance dentro de parámetros

---

## Dependencias y Consideraciones

### Dependencias Técnicas
- NextAuth v5 (ya instalado)
- PostgreSQL con Drizzle ORM (existente)
- Vercel AI SDK (existente)
- Google OAuth credentials (nuevo)

### Dependencias de Negocio
- Definición final de agentes disponibles
- Políticas de acceso por defecto
- Identificación del superusuario inicial

### Consideraciones de UX
- Diseño debe ser consistente con chat existente
- Experiencia mobile-first
- Feedback claro sobre permisos y accesos
- Onboarding para nuevos usuarios

---

## Cronograma y Estimaciones

| Fase | Duración | Dependencias |
|------|----------|--------------|
| Fase 1: Base de Datos | 8 horas | Ninguna |
| Fase 2: Google OAuth | 6 horas | Fase 1 |
| Fase 3: Homepage | 10 horas | Fase 2 |
| Fase 4: Dashboard | 12 horas | Fase 2, 3 |
| Fase 5: APIs | 6 horas | Fase 1, 4 |
| Fase 6: Testing | 8 horas | Todas las anteriores |

**Total:** 50 horas de trabajo efectivo

**Timeline recomendado:** 7-10 días laborables con 1-2 agentes trabajando en paralelo

---

## Riesgos Identificados y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Configuración incorrecta de Google OAuth | Media | Alto | Documentación detallada, ambiente de prueba |
| Conflictos con sistema de chat existente | Media | Alto | Análisis exhaustivo antes de integración |
| Performance con muchos agentes | Baja | Medio | Diseño con paginación desde el inicio |
| Complejidad en control de acceso | Media | Medio | Tests exhaustivos, código simple |
| Migración de BD rompe datos existentes | Baja | Alto | Backups, migraciones reversibles |

---

## Criterios de Éxito Global

- ✅ Usuarios pueden autenticarse con Google OAuth
- ✅ Homepage pública atractiva y funcional
- ✅ Dashboard muestra agentes según permisos
- ✅ Sistema de chat integrado con selección de agentes
- ✅ Control de acceso funciona correctamente
- ✅ Performance adecuado (< 2s carga inicial)
- ✅ Todos los tests pasan
- ✅ No vulnerabilidades de seguridad identificadas

---

## Notas Adicionales

- El sistema debe mantener compatibilidad con autenticación existente (Credentials y Guest)
- La implementación debe seguir los estándares del proyecto (TypeScript strict, Ultracite linting)
- Documentación de API debe actualizarse en paralelo
- Considerar implementación de rate limiting por agente en fase futura

---

**Fin del documento**