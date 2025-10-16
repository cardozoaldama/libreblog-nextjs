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
-  **Moderación NSFW Inteligente** - Detección automática de contenido inapropiado
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
- **AI/ML**: NSFW.js y bad-words (Moderación NSFW)
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

LibreBlog incluye un sistema avanzado de moderación de contenido NSFW (Not Safe For Work) que protege a los usuarios del contenido inapropiado mediante detección automática inteligente.

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
- **Moderación NSFW** - Protección automática de contenido inapropiado

### Control de Entorno
- **Desarrollo** - Simulación de emails, sin envíos reales
- **Producción** - Emails reales de Supabase
- **Configuración Flexible** - Flags para habilitar/deshabilitar funcionalidades

