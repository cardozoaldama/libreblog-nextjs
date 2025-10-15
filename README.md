# 📝 LibreBlog

Una plataforma moderna de blogging construida con Next.js 15, donde los usuarios pueden crear, compartir y descubrir contenido de forma libre y creativa.

## ✨ Características

-  **Editor Markdown** - Escribe con formato profesional
-  **Exploración** - Descubre contenido por categorías
-  **Sistema de Seguimiento** - Conecta con otros escritores
-  **Dashboard Personal** - Gestiona tus publicaciones
-  **Interfaz Moderna** - Diseño responsive con animaciones
-  **Control de Privacidad** - Posts públicos y privados
-  **Soporte Multimedia** - Imágenes y videos embebidos
-  **Seguridad Avanzada** - Verificación de contraseñas comprometidas
-  **Recuperación de Cuenta** - Sistema completo de reset de contraseña
-  **Logo Personalizado** - Identidad visual única con SVG animado
-  **Easter Egg** - Página secreta con información del equipo
-  **Protección Anti-Spam** - Validación de emails y honeypots
-  **Control de Entorno** - Gestión inteligente de emails por ambiente

## Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Deployment**: Vercel

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/libreblog-nextjs.git
cd libreblog-nextjs
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Completa las variables en `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Database
DATABASE_URL=tu_database_url
DIRECT_URL=tu_direct_database_url

# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true
```

4. **Configurar la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

##  Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/            # Rutas de autenticación
│   ├── (main)/            # Rutas principales
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI
│   ├── layout/           # Componentes de layout
│   └── post/             # Componentes de posts
├── lib/                  # Utilidades y configuración
│   ├── prisma.ts         # Cliente de Prisma
│   ├── supabase/         # Configuración de Supabase
│   └── utils.ts          # Funciones utilitarias
└── types/                # Definiciones de tipos TypeScript
```

## 🔒 Funcionalidades de Seguridad

### Verificación de Contraseñas
- **HaveIBeenPwned Integration** - Verifica contraseñas filtradas en brechas de datos
- **Hash SHA-1 Privacy-First** - Solo envía primeros 5 caracteres del hash
- **Indicadores Visuales** - Segura / Comprometida
- **Prevención Automática** - Bloquea contraseñas inseguras

### Recuperación de Cuenta
- **Email de Recuperación** - Enlace seguro via Supabase
- **Reset Seguro** - Verificación en tiempo real durante el cambio
- **Validación Robusta** - Mínimo 8 caracteres, verificación de compromiso
- **UX Optimizada** - Flujo claro con mensajes informativos
- **Cooldown de 60s** - Previene spam en solicitudes de reset

### Protección Anti-Spam
- **Validación de Email** - Formato correcto y dominios válidos
- **Bloqueo de Desechables** - Previene emails temporales (10minutemail, etc.)
- **Honeypot Invisible** - Detecta y bloquea bots automáticamente
- **Rate Limiting** - Control de solicitudes por usuario
- **Control por Entorno** - No envía emails reales en desarrollo

### Confirmación de Email
- **Registro Seguro** - Solo usuarios confirmados se crean en BD
- **Verificación Automática** - Callback valida `email_confirmed_at`
- **Mensajes Claros** - Feedback específico para cada estado
- **Limpieza Automática** - No usuarios "fantasma" en la base de datos

### Rutas de Seguridad
- `/forgot-password` - Solicitar recuperación de contraseña
- `/reset-password` - Restablecer contraseña con validaciones
- `/api/security/check-password` - API de verificación de compromiso

##  Funcionalidades Principales

### Autenticación y Seguridad
- Registro e inicio de sesión con Supabase
- **Verificación HaveIBeenPwned** - Previene contraseñas comprometidas
- **Recuperación de contraseña** - Email seguro con Supabase Auth
- **Validación de fortaleza** - Indicadores en tiempo real
- Gestión automática de sesiones
- Perfiles de usuario personalizables

### Gestión de Posts
- Editor Markdown integrado
- Categorización de contenido
- Sistema de borradores y publicación
- Subida de imágenes y videos

### Interacción Social
- Sistema de seguimiento entre usuarios
- Likes en publicaciones
- Perfiles públicos
- Feed personalizado

### Administración
- Dashboard personal
- Estadísticas de posts
- Gestión de configuración
- Control de privacidad

##  Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Variables de Entorno para Producción

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=your_postgresql_database_url
DIRECT_URL=your_direct_database_url

# App Configuration
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true
```

### Configuración de Supabase

1. **Authentication → Sign In / Providers**:
   - ✅ **Enable Email provider**
   - ✅ **Allow new users to sign up**
   - ✅ **Confirm email** (OBLIGATORIO para seguridad)
   - ✅ **Secure email change**
   - ✅ **Secure password change**

2. **Authentication → Settings**:
   - **Minimum password length**: 8 caracteres
   - **Password Requirements**: Al menos 1 mayúscula, 1 minúscula, 1 número

3. **Email Templates** - Configura plantillas para recuperación de contraseña
4. **Redirect URLs** - Añade `your-domain.com/reset-password` a allowed redirects

### Configuración de Vercel

En Vercel Dashboard → Project → Environment Variables:
- `NEXT_PUBLIC_APP_ENV=production` (Scope: Production)
- `NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true` (Scope: Production)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Guillermo Martinez** - Developer 
- **Alejandro Alonso** - Developer 

## 🎨 Diseño y Branding

### Logo Personalizado
- **SVG Animado** - Logo único con gradientes y efectos
- **Responsive** - Adaptable a navbar, home y favicon
- **Animaciones** - Efectos hover, pulse y glow
- **Identidad Visual** - Representa creatividad y comunidad

### Elementos Visuales
- **Gradientes Modernos** - Azul, púrpura, rosa y amarillo
- **Efectos de Profundidad** - Sombras, blur y backdrop-blur
- **Animaciones Fluidas** - Transiciones suaves en toda la UI
- **Favicon Personalizado** - SVG optimizado para navegadores

## 🚀 Características Técnicas

### Optimizaciones de Rendimiento
- **Next.js 15** - App Router y Server Components
- **Prisma ORM** - Type-safe database queries
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety en todo el proyecto

### Seguridad Implementada
- **Validación de Emails** - Formato y dominios desechables
- **Honeypot Anti-Bot** - Protección invisible contra spam
- **Rate Limiting** - Control de solicitudes por usuario
- **Confirmación de Email** - Solo usuarios verificados en BD
- **Contraseñas Seguras** - Verificación con HaveIBeenPwned

### Control de Entorno
- **Desarrollo** - Simulación de emails, sin envíos reales
- **Producción** - Emails reales de Supabase
- **Configuración Flexible** - Flags para habilitar/deshabilitar funcionalidades

