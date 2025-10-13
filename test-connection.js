// Cargar variables de entorno desde .env para que Prisma y otras libs las vean
require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Conexión exitosa a la base de datos')
    
    const categories = await prisma.category.findMany()
    console.log(`📊 Categorías encontradas: ${categories.length}`)
  } catch (error) {
    console.error('❌ Error de conexión:')
    // Mostrar error completo y hint sobre variables de entorno
    console.error(error)
    if (!process.env.DATABASE_URL) {
      console.error('\nHint: la variable DATABASE_URL no está definida. Revisa tu archivo .env o .env.local y que esté cargado en este entorno.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()