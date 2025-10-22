# 📝 LibreBlog

Una plataforma moderna de blogging construida con Next.js 15, donde los usuarios pueden crear, compartir y descubrir contenido de forma libre y creativa.

## ✨ Características

### 📝 Creación de Contenido
-  **Editor Markdown Avanzado** - Escribe con formato profesional y búsqueda integrada (Ctrl+F)
-  **Paginación Inteligente** - Divide posts largos en páginas con navegación optimizada
-  **Tabla de Contenidos** - Navegación automática por secciones
-  **Preview en Tiempo Real** - Vista previa con paginación interactiva
-  **Soporte Multimedia** - Imágenes, videos (YouTube, TikTok, Facebook)
-  **Generación de PDF** - Descarga posts en formato PDF
-  **Control de Privacidad** - Posts públicos, privados y borradores

### 💬 Sistema de Comentarios
-  **Comentarios Anidados** - Respuestas ilimitadas con estructura jerárquica
-  **Límites Inteligentes** - 2 comentarios por usuario, 10 para autores
-  **Soporte de Imágenes/GIFs** - Detección automática de URLs de imágenes
-  **Edición y Eliminación** - Control total sobre tus comentarios
-  **Límite de Caracteres** - 600 caracteres con contador visual
-  **Modal de Confirmación** - Diseño elegante para acciones críticas

### 🔔 Sistema de Notificaciones
-  **Notificaciones en Tiempo Real** - Campana con badge de no leídas
-  **Agregación Inteligente** - Agrupa notificaciones similares (ahorra 99% espacio)
-  **4 Tipos de Notificaciones** - Follows, likes, comentarios, respuestas
-  **Gestión Completa** - Marcar leídas, borrar individual, limpiar masivo
-  **TTL Automático** - Limpieza de notificaciones antiguas (30 días)
-  **Dropdown Responsive** - Panel optimizado para móvil y desktop

### 👥 Interacción Social
-  **Sistema de Seguimiento** - Conecta con otros escritores
-  **Perfiles Temáticos** - 6 temas personalizables (Halloween, Cyberpunk, Aurora, etc.)
-  **16 Decoraciones de Avatar** - GIFs animados para personalizar perfil
-  **Blocklist Personal** - Censura contenido de usuarios específicos
-  **Likes y Favoritos** - Interactúa con contenido que te gusta
-  **Feed Personalizado** - Filtros por categoría y autor en página de seguidos

### 🔒 Seguridad Avanzada
-  **Verificación HaveIBeenPwned** - Previene contraseñas comprometidas
-  **Recuperación de Cuenta** - Email seguro con Supabase Auth
-  **Protección Anti-Spam** - Validación de emails y honeypots
-  **Confirmación de Email** - Solo usuarios verificados en BD
-  **Row Level Security (RLS)** - Políticas de seguridad en Supabase
-  **Rate Limiting** - Control de solicitudes por usuario

### 🎨 Diseño y UX
-  **Interfaz Moderna** - Diseño responsive con animaciones fluidas
-  **Nueva Paleta de Colores** - Gradientes cohesivos en toda la app
-  **Logo Pluma Antigua** - Identidad visual única con SVG animado
-  **Waves Decorativas** - Transiciones suaves entre secciones
-  **Optimización Móvil** - Experiencia perfecta en todos los dispositivos
-  **Easter Egg** - Página secreta con información del equipo

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** - App Router, Server Components, API Routes
- **React 18** - Hooks, Context API, Suspense
- **TypeScript** - Type safety en todo el proyecto
- **Tailwind CSS** - Utility-first styling con custom config
- **ReactMarkdown** - Renderizado de Markdown con remark-gfm
- **Lucide React** - Iconos modernos y consistentes

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - Type-safe database queries
- **PostgreSQL** - Base de datos relacional (Supabase)
- **Supabase Auth** - Autenticación y gestión de usuarios
- **Row Level Security** - Políticas de seguridad en BD

### Librerías y Herramientas
- **html2pdf.js** - Generación de PDFs desde HTML
- **NSFW.js** - Detección de contenido NSFW (opcional)
- **bad-words** - Filtrado de palabras inapropiadas (opcional)
- **Vercel** - Deployment y hosting
- **Git** - Control de versiones

### Seguridad
- **HaveIBeenPwned API** - Verificación de contraseñas comprometidas
- **Supabase RLS** - Row Level Security en base de datos
- **Rate Limiting** - Control de solicitudes por usuario
- **Email Validation** - Validación de formato y dominios desechables
- **Honeypot** - Protección anti-bot invisible

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/libreblog-nextjs.git
cd libreblog-nextjs
```

2. **Instalar dependencias**
```bash
npm install
# Incluye nsfwjs y bad-words para moderación NSFW
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

# Moderación NSFW (no requiere configuración adicional)

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

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
npx prisma studio    # Abre Prisma Studio (GUI para BD)
npx prisma generate  # Genera cliente de Prisma
npx prisma db push   # Sincroniza schema con BD
```

##  Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Rutas de autenticación
│   │   ├── login/         # Inicio de sesión
│   │   ├── register/      # Registro de usuarios
│   │   ├── forgot-password/  # Recuperación de contraseña
│   │   └── reset-password/   # Reset de contraseña
│   ├── (main)/            # Rutas principales
│   │   ├── explore/       # Exploración de posts
│   │   ├── following/     # Feed de seguidos
│   │   ├── dashboard/     # Dashboard personal
│   │   ├── profile/       # Perfiles de usuario
│   │   ├── post/          # Vista y gestión de posts
│   │   ├── settings/      # Configuración de cuenta
│   │   └── notifications/ # Página de notificaciones
│   ├── api/               # API Routes
│   │   ├── posts/         # CRUD de posts
│   │   ├── comments/      # Sistema de comentarios
│   │   ├── notifications/ # Gestión de notificaciones
│   │   ├── users/         # Gestión de usuarios
│   │   └── security/      # Endpoints de seguridad
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── layout/           # Navbar, Footer, etc.
│   ├── post/             # Componentes de posts
│   ├── comments/         # Sistema de comentarios
│   ├── notifications/    # NotificationBell y componentes
│   ├── profile/          # Componentes de perfil
│   ├── settings/         # Secciones de configuración
│   └── editor/           # SearchableTextarea y herramientas
├── lib/                  # Utilidades y configuración
│   ├── prisma.ts         # Cliente de Prisma (connection pool: 10)
│   ├── supabase/         # Configuración de Supabase
│   ├── notifications.ts  # Lógica de notificaciones
│   ├── commentRules.ts   # Validaciones de comentarios
│   ├── profileThemes.ts  # Temas y decoraciones
│   └── utils.ts          # Funciones utilitarias
├── types/                # Definiciones de tipos TypeScript
└── prisma/               # Schema y migraciones
    ├── schema.prisma     # Modelos de base de datos
    └── migrations/       # Migraciones SQL (incluye RLS)
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
- **Moderación NSFW automática** - Análisis inteligente de contenido

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

## 🛡️ Sistema de Moderación NSFW

LibreBlog incluye un sistema de moderación de contenido NSFW (Not Safe For Work) basado en marcado manual por el usuario.

### ✨ Características de Moderación

#### 🔍 Detección Automática Inteligente
- **Análisis de texto**: Detecta palabras clave y patrones NSFW con categorización avanzada
- **Análisis visual**: Uso de NSFW.js para detección de contenido NSFW en imágenes
- **Verificación de URLs**: Identifica dominios conocidos y enlaces sospechosos
- **Categorización inteligente**: Clasifica contenido en categorías (sexual, violencia, drogas, adulto, etc.)

#### 🎨 Filtros Visuales Interactivos
- **Efecto borroso**: Contenido NSFW se muestra con blur suave
- **Overlay informativo**: Muestra categorías detectadas y explicación clara
- **Botón de revelación**: Confirmación de mayoría de edad requerida
- **Advertencias visibles**: Etiquetas NSFW en posts y dashboard

#### ⚙️ Configuración Personalizada
- **Toggle de protección**: Los usuarios pueden activar/desactivar filtros
- **Configuración persistente**: Preferencias guardadas en base de datos
- **Interfaz intuitiva**: Panel de configuración en ajustes del usuario

#### 📢 Sistema de Reportes
- **Reportes de usuarios**: Permite reportar falsos positivos/negativos
- **Feedback continuo**: Ayuda a mejorar la precisión del sistema
- **Prevención de abuso**: No permite reportar posts propios

### 🏗️ Arquitectura Técnica

#### API de Moderación (`/api/moderate/nsfw`)
```typescript
POST /api/moderate/nsfw
{
  "content": "contenido del post",
  "title": "título del post",
  "images": ["url1", "url2"]
}

Response:
{
  "isNSFW": boolean,
  "confidence": number,
  "categories": ["sexual", "violencia"],
  "reasons": ["Palabra clave detectada: xxx"],
  "detectedContent": {
    "text": ["palabras"],
    "urls": ["urls"],
    "images": ["imagenes"]
  }
}
```

#### Base de Datos
- **`users.nsfw_protection`**: Preferencia del usuario (boolean, default: true)
- **`posts.is_nsfw`**: Marca si el post es NSFW (boolean, default: false)
- **`posts.nsfw_categories`**: Array de categorías detectadas (string[], default: [])

#### Componentes UI
- **`NSFWFilter`**: Componente principal con filtros visuales y reportes
- **`NSFWWarning`**: Advertencias en posts con categorías
- **`NSFWProtectionSection`**: Panel de configuración en settings

### 🔧 Configuración

#### 1. Librerías de Moderación
1. Instala las dependencias necesarias:
```bash
npm install nsfwjs bad-words
```
2. Las librerías funcionan automáticamente sin configuración adicional

#### 2. Variables de Entorno
No se requieren variables adicionales para la moderación NSFW.

#### 3. Migración de Base de Datos
```bash
npx prisma db push
# O aplica la migración específica
node prisma/migrations/add_nsfw_categories.sql
```

### 📊 Métricas y Monitoreo

#### Información Registrada
- Resultados de moderación por post
- Nivel de confianza de detección
- Categorías identificadas
- Elementos específicos detectados (texto, URLs, imágenes)
- Reportes de usuarios sobre falsos positivos/negativos

#### Logs Disponibles
```
[NSFW Moderation] Result: isNSFW=true, confidence=0.85, categories=[sexual,sospechoso], text_words=2, urls=0, images=1
```

### 🎯 Flujo de Usuario

#### Usuario con Protección Activada (Default)
1. **Crea post** → Sistema analiza automáticamente
2. **Detección** → Marca como NSFW si aplica con categorías
3. **Visualización** → Filtro borroso + advertencia con categorías
4. **Revelación** → Click para ver con confirmación
5. **Feedback** → Opción de reportar si hay error

#### Usuario con Protección Desactivada
1. **Ve todo** → Sin filtros ni advertencias
2. **Configuración** → Puede activar en cualquier momento
3. **Persistencia** → Preferencia guardada en perfil

### 🔒 Seguridad y Privacidad

#### Datos No Almacenados
- Contenido no se guarda para análisis posterior
- Solo resultado final (isNSFW + categorías) se almacena
- No hay tracking de contenido específico del usuario

#### Procesamiento Seguro
- Análisis ocurre en servidor
- Librerías locales gratuitas sin límites
- Fallback automático si librerías no disponibles
- Configuración privada por usuario

### 🚀 Características Avanzadas

#### Integración con Librerías Open-Source
- **NSFW.js**: Análisis visual profesional con TensorFlow.js
- **bad-words**: Detección de palabras clave NSFW
- **Categorización automática**: Sexual, violencia, drogas, etc.
- **Confianza adaptable**: Umbrales ajustables por tipo

#### Escalabilidad
- **Procesamiento en tiempo real**: Sin impacto en UX
- **Caché inteligente**: Resultados guardados para posts existentes
- **Fallback robusto**: Sistema funciona sin API externa

#### Mejoras Continuas
- **Sistema de reportes**: Feedback de usuarios mejora precisión
- **Métricas detalladas**: Seguimiento de rendimiento
- **Actualizaciones**: Lista de palabras y dominios mantenible

### 📈 Beneficios

- **Protección automática**: Contenido inapropiado filtrado automáticamente
- **Experiencia personalizable**: Cada usuario controla su experiencia
- **Transparencia**: Categorías visibles explican las detecciones
- **Mejora continua**: Reportes ayudan a refinar el sistema
- **Seguridad**: Protección de menores sin censurar contenido legítimo

---

**Nota**: El sistema está diseñado para ser protector sin ser restrictivo. Los usuarios siempre tienen control total sobre su experiencia y pueden desactivar los filtros cuando lo deseen.

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

# Moderación NSFW (no requiere configuración adicional)

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
# No se requieren variables adicionales para NSFW

## 🤝 Contribuir

Contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork el proyecto**
2. **Crea una rama** para tu feature
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit tus cambios** con mensajes descriptivos
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push a la rama**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Abre un Pull Request** con descripción detallada

### Convenciones de Commits
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan código)
- `refactor:` - Refactorización de código
- `test:` - Añadir o modificar tests
- `chore:` - Tareas de mantenimiento

### Guías de Estilo
- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de Tailwind CSS
- Escribe componentes reutilizables y modulares
- Documenta funciones complejas con JSDoc
- Mantén los componentes pequeños y enfocados

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

### MIT License

Permite uso comercial, modificación, distribución y uso privado.
Requiere incluir el aviso de copyright y la licencia en todas las copias.

## 🔄 Changelog

### v2.1.0 (2025) - Sistema de Comentarios y Notificaciones
- 💬 **Sistema de Comentarios Completo**
  - Comentarios anidados con respuestas ilimitadas
  - Límites inteligentes: 2 por usuario, 10 para autores
  - Soporte de imágenes/GIFs con detección automática
  - Límite de 600 caracteres con contador visual
  - Modal de confirmación elegante para eliminación
  - Redirección a perfil desde avatar/nombre
- 🔔 **Sistema de Notificaciones Avanzado**
  - Agregación inteligente (ahorra 99% espacio)
  - 4 tipos: follows, likes, comentarios, respuestas
  - Dropdown responsive con gestión completa
  - TTL automático de 30 días
  - Botones de borrado individual y masivo
- 🔍 **Editor con Búsqueda Integrada**
  - Búsqueda tipo IDE (Ctrl+F)
  - Navegación entre coincidencias
  - Contador y scroll inteligente
  - Responsive para móvil y desktop
- 📄 **Paginación Inteligente**
  - Muestra solo páginas cercanas a la actual
  - Primera y última siempre visibles
  - Puntos suspensivos entre rangos
  - Evita overflow con muchas páginas
- 🎨 **Mejoras Responsive**
  - NotificationBell: fixed en móvil, sin overflow
  - Perfil: estadísticas adaptables con whitespace-nowrap
  - Settings: cards de seguidores/siguiendo optimizadas
  - Avatares con tamaño fijo para evitar deformaciones
- 🔒 **Row Level Security (RLS)**
  - Políticas de seguridad para comments y notifications
  - Script SQL completo con documentación
  - Verificación y troubleshooting incluidos
- 🛠️ **Optimizaciones Técnicas**
  - Connection pool aumentado de 1 a 10
  - Filtros por categoría y autor en following
  - Preview con paginación interactiva en editor
  - Documentación completa (GUIA, DIAGRAMAS PlantUML)

### v2.0.0 (2025) - Rediseño Visual
- 🎨 Rediseño completo con nueva paleta de colores
- 🖋️ Logo cambiado a pluma antigua
- 🎭 Sistema de temas de perfil con 6 opciones
- 🖼️ 16 decoraciones de avatar personalizables
- 🌊 Waves decorativas entre secciones
- 🔄 Moderación NSFW cambiada a manual
- 🚫 Sistema de blocklist personal
- 📄 Paginación optimizada a 20 posts
- ✨ Animaciones mejoradas en toda la UI
- 🎯 Mejoras visuales en todas las páginas

## 👥 Equipo

- **Guillermo Martinez** - Full Stack Developer - Sistema de comentarios, notificaciones, editor avanzado
- **Alejandro Alonso** - Full Stack Developer - Diseño UI/UX, sistema de temas, optimizaciones

## 🙏 Agradecimientos

- Comunidad de Next.js por la excelente documentación
- Supabase por la plataforma de backend completa
- Vercel por el hosting y deployment seamless
- Todos los contribuidores y testers del proyecto

## 📞 Contacto

¿Tienes preguntas o sugerencias? Contáctanos:
- GitHub Issues: [Reportar un problema](https://github.com/tu-usuario/libreblog-nextjs/issues)
- Email: contacto@libreblog.com (ejemplo)
- Twitter: @libreblog (ejemplo)

---

**LibreBlog** - Escribe libremente, comparte creativamente 📝✨ 

## 🎨 Diseño y Branding (v2.0.0)

### Nueva Paleta de Colores
- **#000022** - Negro profundo (fondos oscuros)
- **#0c2b4d** - Azul oscuro (primario)
- **#36234e** - Púrpura oscuro (secundario)
- **#5f638f** - Púrpura claro (acentos)
- **#dedff1** - Blanco perla (texto claro)

### Logo Rediseñado
- **Pluma Antigua (Quill Pen)** - Símbolo de escritura clásica
- **SVG con Gradientes** - Colores de la nueva paleta
- **Responsive** - Adaptable a navbar, home y favicon
- **Animaciones** - Efectos hover y transiciones suaves
- **Identidad Visual** - Representa la esencia de la escritura

### Sistema de Temas de Perfil
- **6 Temas Personalizables** - Halloween, Christmas, Cyberpunk, Aurora, Minimal, Vaporwave
- **16 Decoraciones** - Avatares personalizables con GIFs animados
- **Biografía Personalizada** - Colores adaptados a cada tema
- **Estadísticas Temáticas** - Cards con estilos únicos por tema

### Elementos Visuales
- **Gradientes Cohesivos** - Paleta unificada en toda la aplicación
- **Efectos de Profundidad** - Sombras con colores de la paleta
- **Animaciones Fluidas** - Fade-in, slide-in, scale en componentes
- **Waves Decorativas** - Transiciones suaves entre secciones
- **Favicon Personalizado** - Pluma antigua con nueva paleta

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
- **Moderación NSFW Manual** - Sistema de checkbox para marcar contenido
- **Blocklist Personal** - Usuarios pueden censurar contenido de otros

### Control de Entorno
- **Desarrollo** - Simulación de emails, sin envíos reales
- **Producción** - Emails reales de Supabase
- **Configuración Flexible** - Flags para habilitar/deshabilitar funcionalidades

### Funcionalidades de Usuario
- **Censura Personal** - Blur de contenido de usuarios bloqueados
- **Protección para No Registrados** - Todas las imágenes con blur como incentivo
- **Paginación Optimizada** - 20 posts por página en explore/following
- **Filtros de Dashboard** - Todos/Públicos/Borradores
- **Botón de Bloqueo Mejorado** - Gradientes y animaciones modernas

## 🎯 Características Destacadas

### Sistema de Comentarios
Sistema completo con comentarios anidados, límites inteligentes (2 por usuario, 10 para autores), soporte de imágenes/GIFs, y validaciones robustas. Los usuarios pueden editar y eliminar sus comentarios, y los autores tienen control total sobre los comentarios en sus posts.

### Sistema de Notificaciones
Notificaciones en tiempo real con agregación inteligente que reduce el uso de espacio en un 99%. Soporta 4 tipos de notificaciones (follows, likes, comentarios, respuestas) con TTL automático de 30 días y gestión completa desde dropdown o página dedicada.

### Paginación Inteligente
Sistema de paginación que muestra solo páginas cercanas a la actual, evitando overflow en posts con muchas páginas. Incluye primera y última página siempre visibles con puntos suspensivos entre rangos.

### Editor Avanzado
Editor Markdown con búsqueda integrada tipo IDE (Ctrl+F), navegación entre coincidencias, preview en tiempo real con paginación interactiva, y soporte completo para multimedia.

### Seguridad Robusta
Verificación de contraseñas con HaveIBeenPwned, Row Level Security en Supabase, protección anti-spam, validación de emails, y rate limiting. Solo usuarios con email confirmado pueden acceder a la plataforma.

## 📦 Versión 2.1.0

### Cambios Principales

#### Sistema de Comentarios y Notificaciones
- Nueva paleta de colores aplicada en toda la aplicación
- Logo rediseñado de blog circular a pluma antigua
- Sistema de temas de perfil con 6 opciones
- 16 decoraciones de avatar disponibles
- Waves decorativas entre secciones
- Animaciones mejoradas en todos los componentes

#### Páginas Rediseñadas
- **Home**: Hero con gradiente oscuro, waves, posts destacados estilo Pokémon
- **Explore**: Nueva paleta, filtros mejorados, cards actualizadas
- **Dashboard**: Estadísticas coloridas, filtros de posts
- **Following**: Diseño coherente con nueva paleta
- **Post View**: Hero con gradiente, imagen destacada mejorada
- **Create Post**: Inputs y preview con nuevos colores
- **Settings**: Cards y secciones con nueva paleta
- **Login/Register**: Diseño moderno con gradientes y animaciones
- **Forgot Password**: Interfaz mejorada con nueva paleta
- **Easter Egg**: Developers con cards expandibles y confeti instantáneo

#### Componentes Mejorados
- **Navbar**: Pluma antigua, colores actualizados
- **Footer**: Gradiente oscuro, versión 2.0.0
- **Button**: Gradientes de la nueva paleta
- **Card**: Bordes y sombras con nuevos colores
- **BlockUserButton**: Gradientes modernos con efectos hover

#### Sistema de Moderación
- Cambio de automático a manual (checkbox)
- Eliminado campo `nsfwCategories` de base de datos
- Blur solo en cover images
- Sistema de blocklist personal por usuario

#### Optimizaciones
- Paginación reducida a 20 posts
- Filtros de dashboard mejorados
- Z-index corregido en botones de acción
- Waves sin superposición de contenido
- Connection pool aumentado a 10 conexiones
- Paginación inteligente para posts largos
- Responsive mejorado en toda la aplicación





## 💡 Guía de Uso

### Para Autores
- Usa `---PAGE---` en tu contenido Markdown para dividir posts largos en páginas
- Activa "Tabla de Contenidos" para posts con múltiples secciones
- Marca posts como NSFW manualmente si contienen contenido sensible
- Usa el preview con paginación para ver cómo quedará tu post final
- Aprovecha el editor con búsqueda (Ctrl+F) para posts largos

### Para Lectores
- Activa la protección NSFW en configuración para filtrar contenido
- Usa la blocklist personal para censurar usuarios específicos
- Personaliza tu perfil con temas y decoraciones
- Filtra posts por categoría y autor en la página de seguidos
- Recibe notificaciones en tiempo real de tu contenido favorito

