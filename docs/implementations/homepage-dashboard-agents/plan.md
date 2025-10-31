# Plan: Homepage + Dashboard de Agentes

**Versión:** 2.0
**Fecha:** 2025-10-30
**Proyecto:** cjhirashi-ai

---

## 📋 CONCEPTUALIZACIÓN

### Objetivo
Crear una separación clara entre:
- **Área Pública (Homepage):** Información sobre la plataforma
- **Área Privada (Dashboard):** Panel de control para usuarios autenticados

---

## 🏠 Homepage (Pública)

### Propósito
Mostrar qué es la plataforma y sus capacidades. **No invita a suscribirse** (será implementación futura).

### Contenido
- **Hero Section:** Explicación de qué es el sistema de agentes IA
- Información general sobre la plataforma
- (Futuro: Tier de suscripción - se implementará cuando el sistema esté completo)

### Acceso
- URL: `/`
- Sin autenticación requerida
- Cualquier usuario puede ver

### Nota
- Por ahora es para **uso personal** y para **invitar usuarios a utilizar los agentes**

---

## 📊 Dashboard (Privado - Autenticado)

### Propósito
Panel central para usuarios autenticados. Acceso a todas las herramientas de la plataforma.

### Estructura
```
Dashboard (para todos los usuarios)
├── Sidebar (navegación principal)
│   ├── Agentes (área principal)
│   ├── Perfil de Usuario
│   ├── Storage (almacenamiento de archivos)
│   └── [Futuro: TODO, otras herramientas]
│
└── Área de contenido (según sección seleccionada)
    ├── Agentes: Grid/lista de agentes disponibles
    ├── Perfil: Personalización de datos del usuario
    ├── Storage: Gestor de archivos
    └── [Futuro: Otras herramientas]
```

### Secciones Actuales (Implementación 1)

#### **1. Agentes**
- Lista de agentes disponibles
- Integración con agentes existentes
- Selección de agente para usar
- (Detalles de visualización: se definirán en fase de implementación de agentes)

#### **2. Perfil de Usuario**
- Personalización de datos del usuario
- Los agentes usarán esta información para conocer al usuario
- Campos: nombre, email, bio/descripción personal, preferencias, etc.
- Los agentes tendrán acceso a esta información en el contexto
- (Detalles específicos de campos: se definirán con los agentes)

#### **3. Storage**
- Acceso al sistema de almacenamiento de archivos
- (Será implementación separada - Impl. 4)
- Por ahora: placeholder/link a futura sección

#### **4. Futuras Herramientas**
- TODO
- Otras herramientas por definir
- (Se implementarán en futuras implementaciones)

### Acceso
- URL: `/dashboard`
- Requiere autenticación (Credentials o Guest)
- Accesible para **todos los usuarios** (regulares y guests)

### Notas
- El Dashboard es el **centro neurálgico** de la plataforma
- Todos los usuarios tienen acceso a las mismas secciones
- Control de acceso granular a agentes específicos será en Impl. 2 (Admin)
- Por ahora, todos ven los mismos agentes públicos

---

## 🔄 Flujos Principales

### Flujo 1: Usuario No Autenticado
```
Homepage (pública)
    ↓
Lee información
    ↓
(Futuro: Botón de suscripción)
```

### Flujo 2: Usuario Autenticado
```
Login (Credentials o Guest)
    ↓
Dashboard
    ├── Ir a Agentes
    │   ├── Ver agentes disponibles
    │   └── Seleccionar agente para usar
    │
    ├── Ir a Perfil
    │   └── Personalizar datos (que los agentes usarán)
    │
    └── Ir a Storage
        └── Gestionar archivos (futuro)
```

---

## 🗂️ Estructura de Rutas

### Rutas Públicas
```
/ ............................ Homepage (pública)
/login ...................... Login (existente)
/register ................... Registro (existente)
```

### Rutas Privadas (Autenticadas)
```
/dashboard .................. Dashboard principal
/dashboard/agents ........... Sección de agentes
/dashboard/profile .......... Sección de perfil de usuario
/dashboard/storage .......... Sección de almacenamiento
```

---

## 👥 Tipos de Usuario

### Usuario Regular
- Acceso a homepage (pública)
- Acceso a dashboard y todas sus secciones
- Ve agentes públicos disponibles

### Superusuario
- Acceso a todo lo anterior
- Acceso a panel de administración de usuarios (Impl. 2)
- Acceso a panel de administración de la plataforma:
  - Personalización de tema (colores)
  - Carga de logo de la plataforma
  - Carga de icono de la plataforma

---

## 🔐 Autenticación (Actual)

**Para esta Implementación 1:**
- ✅ Credentials Provider (email/password)
- ❌ Guest Provider (ELIMINADO)
- **(Google OAuth será Impl. 1B separada)**

**Flujo:**
1. Usuario llega a homepage (pública)
2. Si no está autenticado, puede ver información
3. Para acceder a dashboard, DEBE autenticarse con email/password
4. Después de login, accede a dashboard y sus secciones

---

## 📋 Criterios de Éxito de Conceptualización

- ✅ Separación clara entre área pública y privada
- ✅ Homepage comunica qué es la plataforma
- ✅ Dashboard es el centro de todas las herramientas
- ✅ Sidebar permite navegar entre secciones
- ✅ Flujos de usuario son claros
- ✅ Autenticación usa sistema existente (sin Google OAuth)
- ✅ Estructura escalable para futuras herramientas

---

## 🎨 Panel de Administración de la Plataforma (Solo Superusuario)

**Acceso:** Solo disponible para superusuario

**Características:**
- Personalización de tema (colores principales)
- Carga de logo de la plataforma
- Carga de icono de la plataforma
- Estos ajustes se aplican globalmente a toda la plataforma

**Ubicación:** Separado del panel de administración de usuarios (Impl. 2)

---

## 🚫 Fuera de Scope (Implementación 1)

- ❌ Google OAuth (será Impl. 1B separada)
- ❌ Tier de suscripción (será Impl. futura)
- ❌ Detalles de visualización de agentes (se define en Impl. de agentes)
- ❌ Sistema de almacenamiento completo (será Impl. 4)
- ❌ TODO y otras herramientas futuras
- ❌ Gestión de usuarios (será Impl. 2)
- ❌ Control granular de acceso a agentes (será Impl. 2)

---

## 📦 Dependencias Técnicas

### Ya Existentes
- Next.js 15 con App Router
- NextAuth v5 (Credentials + Guest providers)
- PostgreSQL + Drizzle ORM
- Tailwind CSS + shadcn/ui

### Para Esta Implementación
- Sistema de autenticación actual (sin cambios)
- Agentes existentes (se integran)

---

## 🔧 Script para Crear Superusuario

**Necesario:** Script para crear el primer superusuario

**Propósito:**
- Crear un usuario inicial con rol de superusuario
- Permitir configurar credenciales (email, password)
- Asignar permisos de administrador

**Ubicación del script:** `scripts/create-superuser.ts`

**Uso (Implementación 1):**
```bash
pnpm run create-superuser --email=admin@example.com --password=securepassword
```

**Lo que hace (Implementación 1):**
1. Verifica que el usuario no exista
2. Hashea la contraseña
3. Crea el usuario con `isSuperUser: true`
4. Confirma creación

**Autenticación soportada (Impl. 1):**
- ✅ Email + Password

**Futuras mejoras (Impl. 1B - Google OAuth):**
- ⏳ Soporte para autenticación con Google OAuth
- ⏳ El script se modificará para permitir autenticación dual (email/password O Google)

**Nota:** Este script será necesario para la primera instalación/setup de la plataforma

---

## ✅ Validación de Conceptualización

**¿Está clara la conceptualización?**

- [ ] Homepage pública muestra información
- [ ] Dashboard privado con sidebar
- [ ] Secciones: Agentes, Perfil, Storage, Futuras herramientas
- [ ] Perfil de usuario: personalización de datos para que agentes conozcan al usuario
- [ ] Autenticación: SOLO Credentials (email/password)
- [ ] Guest Provider: ELIMINADO
- [ ] Todos los usuarios (regulares) acceden a las mismas secciones
- [ ] Superusuario accede a panel de administración de plataforma
- [ ] Script create-superuser para crear primer admin
- [ ] Google OAuth es implementación separada (1B)

---

## ⏭️ Próximos Pasos

1. **Usuario valida conceptualización** ← Aquí
2. Crear plan detallado con fases
3. Invocar System Analyser para viabilidad
4. Invocar Architect para diseño
5. Comenzar implementación

---

**Documento actualizado:** 2025-10-30
**Estado:** Esperando validación de conceptualización
