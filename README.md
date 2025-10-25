[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/IsmaNov12/libreblog-nextjs)

# 📝 LibreBlog

LibreBlog es una plataforma moderna de blogging desarrollada con Next.js 15, donde los usuarios pueden crear, compartir y descubrir contenido de manera libre y segura. Enfocada en funcionalidades sociales, gran usabilidad, protección NSFW y un diseño visualmente atractivo y adaptable.

## ✨ Características Implementadas

### Creación y Gestión de Contenido
- **Editor Markdown avanzado**: Soporte para sintaxis Markdown, separación en páginas (`---PAGE---`), tabla de contenidos automáticas y edición responsiva.
- **Categorización**: Posts pueden clasificarse por categorías personalizadas.
- **Soporte multimedia**: Insertar imágenes y videos embebidos (YouTube, TikTok, Facebook).
- **Vista previa y paginación**: Preview interactiva y navegación por páginas largas.
- **Público y privados**: Posts pueden ser públicos o privados (borrador).
- **Permitir o bloquear comentarios** y descarga en PDF.

### Interacción Social
- **Sistema de comentarios**: Comentarios anidados, edición/eliminación, límites personalizables.
- **Sistema de notificaciones**: Notificaciones en tiempo real agregadas por eventos sociales (follows, comentarios, likes, respuestas). Panel responsive y gestión completa del historial.
- **Seguimiento de usuarios**: Sigue y obtén un feed personalizado de los posts de tus seguidos.
- **Likes y favoritos**: Interacción social rápida en posts.
- **Blocklist y censura personalizada**: Puedes bloquear usuarios o censurar su contenido/post.

### Moderación y Protección NSFW
- **Moderación NSFW manual**: Marcar contenido como NSFW con checkbox al crear un post.
- **Protección personal NSFW**: Filtro borroso configurable por usuario; persistente en base de datos.
- **Reportes de falsos positivos/negativos**: Permite feedback de usuarios para mejorar el sistema.
- **Blur y advertencias**: Los posts NSFW sólo se muestran tras confirmación si tienes activa la protección.

### Perfiles y Temas Personalizados
- **Perfiles públicos**: Bio, avatar, links sociales, seguidores/seguidos, temas visuales.
- **Decoraciones de avatar**: Selección de decoraciones GIF.
- **Temas de perfil**: Personalización visual con varios estilos (Halloween, Vaporwave, Aurora, etc.).

### Seguridad y Privacidad
- **Registro/login con Supabase Auth**: Confirmación de email, sólo usuarios autenticados acceden a funciones sociales.
- **Verificación de contraseñas comprometidas**: HaveIBeenPwned durante el registro/reset.
- **2FA y gestión completa desde Settings**.
- **Rate Limiting, honeypots y validación de emails.**
- **Row Level Security (RLS) en la base de datos.**

## 🛠️ Tecnologías Principales

- **Next.js 15** (App Router, Server/Client Components, API Routes)
- **React 18**, **TypeScript**, **Tailwind CSS**
- **Prisma ORM** + **PostgreSQL** (Gestión vía Supabase)
- **Supabase Auth** (incluye RLS y gestión de sesiones)
- **html2pdf.js** (descarga PDF de posts)
- **nsfwjs** y **bad-words** (detección y filtro NSFW por texto y manual)
- **Vitest** (testing), **ESLint** (linter), **Vercel** (deploy recomendado)

## 🏗️ Arquitectura y Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                   # Login, registro, recuperación y reset password
│   ├── (main)/                   # Explorar, feed de seguidos, dashboard, posts, settings
│   ├── api/                      # Endpoints api Next.js (posts, comments, users, notifications, etc)
│   └── ...                       # Páginas y layouts principales
├── components/                   # Componentes UI y funcionales
│   ├── post/                     # Lector, acciones, PDF
│   ├── comments/                 # Sección de comentarios
│   ├── notifications/            # Notificaciones
│   └── ...
├── lib/                          # Utilidades, clientes, validaciones, temas
├── prisma/                       # Modelo y migraciones BD (Postgres)
│   └── schema.prisma             # Define users, posts, comments, follows, likes, notifications, categorias
└── ...
```

## 🚀 Instalación y Uso Local

```bash
git clone https://github.com/tu-usuario/libreblog-nextjs.git
cd libreblog-nextjs
npm install
cp .env.example .env.local # configura tus claves y URLs
npx prisma generate
npx prisma db push
npm run dev
```
La app estará en [http://localhost:3000](http://localhost:3000)

Scripts útiles:
```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run start       # Servidor producción
npm run lint        # Linter ESLint
npx prisma studio   # GUI BD
npm run test        # Tests con vitest
```

## 🔎 Funcionalidades Destacadas

- **Editor Markdown** con paginación, tabla de contenidos, multimedia y vista previa interactiva
- **Sistema completo de comentarios y notificaciones**
- **Protección, filtro y reporte de contenido NSFW**
- **Perfiles y feeds personalizables, gestión de seguidores/seguidos**
- **Privacidad y seguridad robusta** (contraseñas, emails, 2FA, RLS, anti-spam, etc)

## ❓ FAQ - Preguntas Frecuentes

**¿Cómo registro una cuenta?**
- Simplemente usa la opción de registro. Requiere email válido y confirmación.

**¿Cómo recupero mi contraseña?**
- Utiliza la opción "¿Olvidaste tu contraseña?" en la pantalla de login. Llega un enlace seguro por email.

**¿Puedo bloquear usuarios o censurar contenido?**
- Sí, usa las opciones de blocklist/censura desde el perfil o comentarios.

**¿Cómo activo/desactivo el filtro NSFW?**
- Desde la página de configuración puedes activar/desactivar el filtro NSFW en cualquier momento.

**¿Qué tipos de archivos multimedia puedo insertar?**
- Imágenes por URL y videos de YouTube, TikTok o Facebook (embed).

**¿Qué pasa si olvido cerrar sesión?**
- Las sesiones expiran automáticamente y puedes revocarlas desde tu panel.

## 🛠️ Troubleshooting - Problemas Comunes

**El correo de confirmación no llega:**
- Revisa el correo no deseado/spam.
- Asegúrate de haber escrito correctamente el email.
- Intenta reenviarlo desde la página de login.

**No puedo iniciar sesión o registrar:**
- Verifica tu conexión y que tu correo esté confirmado.
- Intenta resetear la contraseña.

**El editor no carga o pierdo cambios:**
- Revisa tu conexión y actualiza la página.
- Usa navegadores modernos (Chrome, Firefox, Edge).

**Problemas de carga de imágenes/perfiles:**
- Revisa la URL de la imagen.
- Algunos bloqueadores de contenido pueden interferir.

**Desincronización de datos tras editar perfil o post:**
- Actualiza la página y limpia caché si es necesario.

Para problemas técnicos persistentes puedes abrir un issue en este repositorio.

## 🤝 Contribuir

¡Se aceptan contribuciones! Puedes colaborar de la siguiente forma:

1. Haz un **fork** de este repositorio.
2. Crea una rama para tu feature o fix:
   ```bash
   git checkout -b feat/mi-aporte
   ```
3. Realiza tus cambios (usa TypeScript, sigue la arquitectura modular y las guías de estilo de los componentes y Tailwind CSS).
4. Haz commit con mensajes claros y descriptivos:
   ```bash
   git commit -m 'feat: agrega filtro de categorías en explore'
   ```
5. Envía tu rama a tu fork:
   ```bash
   git push origin feat/mi-aporte
   ```
6. Abre un **Pull Request** explicando de manera breve tu mejora/corrección.
7. Espera revisión: nos comunicaremos vía comentarios en el PR.

**Tips para contribuir:**
- Usa TypeScript en toda contribución de código.
- Prioriza código modular, reutilizable y documentado.
- Prefiere componentes visuales pequeños y funciones puras.
- Si agregas dependencias, documenta el motivo en tu PR.

---

## 📄 Licencia

MIT

Cualquier duda, sugerencia o aporte es bienvenido vía issues o Pull Request en este repositorio.

