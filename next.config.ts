import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Ocultar información del servidor en producción
  poweredByHeader: false,
  // Comprimir respuestas
  compress: true,
  // Configuración de producción
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: {
        exclude: ['error'], // Solo mantener console.error en producción
      },
    },
  }),
};

export default nextConfig;
