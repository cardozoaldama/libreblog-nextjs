# 📝 LibreBlog

Una plataforma moderna de blogging construida con Next.js 15, donde los usuarios pueden crear, compartir y descubrir contenido de forma libre y creativa.

## ✨ Características

- 🖊️ **Editor Markdown** - Escribe con formato profesional
- 🔍 **Exploración** - Descubre contenido por categorías
- 👥 **Sistema de Seguimiento** - Conecta con otros escritores
- 📊 **Dashboard Personal** - Gestiona tus publicaciones
- 🎨 **Interfaz Moderna** - Diseño responsive con animaciones
- 🔒 **Control de Privacidad** - Posts públicos y privados
- 🖼️ **Soporte Multimedia** - Imágenes y videos embebidos
- 🛡️ **Seguridad Avanzada** - Verificación de contraseñas comprometidas
- 🔑 **Recuperación de Cuenta** - Sistema completo de reset de contraseña
- 🎨 **Logo Personalizado** - Identidad visual única con SVG animado

## 🚀 Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Deployment**: Vercel

## 🛠️ Instalación

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

## 📁 Estructura del Proyecto

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

## 🔐 Funcionalidades de Seguridad

### Verificación de Contraseñas
- **HaveIBeenPwned Integration** - Verifica contraseñas filtradas en brechas de datos
- **Hash SHA-1 Privacy-First** - Solo envía primeros 5 caracteres del hash
- **Indicadores Visuales** - 🛡️ Segura / ⚠️ Comprometida
- **Prevención Automática** - Bloquea contraseñas inseguras

### Recuperación de Cuenta
- **Email de Recuperación** - Enlace seguro via Supabase
- **Reset Seguro** - Verificación en tiempo real durante el cambio
- **Validación Robusta** - Mínimo 8 caracteres, verificación de compromiso
- **UX Optimizada** - Flujo claro con mensajes informativos

### Rutas de Seguridad
- `/forgot-password` - Solicitar recuperación de contraseña
- `/reset-password` - Restablecer contraseña con validaciones
- `/api/security/check-password` - API de verificación de compromiso

## 🎯 Funcionalidades Principales

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

## 🚀 Deployment

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
```

### Configuración de Supabase

1. **Email Templates** - Configura plantillas para recuperación de contraseña
2. **Auth Settings** - Habilita email confirmations y password recovery
3. **Security** - Configura rate limiting y políticas de contraseña
4. **Redirect URLs** - Añade `your-domain.com/reset-password` a allowed redirects

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Guillermo Martinez** - Full Stack Developer 🚀
- **Alejandro Alonso** - Full Stack Developer ⭐

### Apoyo Emocional
- **Miguel** - Gato Supervisor 🐱
- **Terry** - Perro Motivacional 🐶

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

## 🎊 Easter Egg

¿Puedes encontrar nuestro easter egg secreto? 👀
Pista: Busca en el footer... 🦶✨

---

Hecho con ❤️ por el equipo de LibreBlog