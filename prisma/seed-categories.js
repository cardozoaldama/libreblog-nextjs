const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  { name: 'Programación', slug: 'programacion', icon: '💻' },
  { name: 'Tecnología', slug: 'tecnologia', icon: '🚀' },
  { name: 'Educación', slug: 'educacion', icon: '📚' },
  { name: 'Ciencia', slug: 'ciencia', icon: '🔬' },
  { name: 'Arte', slug: 'arte', icon: '🎨' },
  { name: 'Música', slug: 'musica', icon: '🎵' },
  { name: 'Deportes', slug: 'deportes', icon: '⚽' },
  { name: 'Viajes', slug: 'viajes', icon: '✈️' },
  { name: 'Comida', slug: 'comida', icon: '🍔' },
  { name: 'Salud', slug: 'salud', icon: '💪' },
  { name: 'Negocios', slug: 'negocios', icon: '💼' },
  { name: 'Finanzas', slug: 'finanzas', icon: '💰' },
  { name: 'Diseño', slug: 'diseno', icon: '✨' },
  { name: 'Fotografía', slug: 'fotografia', icon: '📷' },
  { name: 'Cine', slug: 'cine', icon: '🎬' },
  { name: 'Gaming', slug: 'gaming', icon: '🎮' },
  { name: 'Moda', slug: 'moda', icon: '👗' },
  { name: 'Naturaleza', slug: 'naturaleza', icon: '🌿' },
  { name: 'Historia', slug: 'historia', icon: '📜' },
  { name: 'Otros', slug: 'otros', icon: '📌' },
]

async function main() {
  console.log('Seeding categories...')
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  
  console.log('✅ Categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
