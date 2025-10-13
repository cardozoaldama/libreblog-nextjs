const { PrismaClient } = require('@prisma/client')

async function createLikesTable() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Verificando y creando tabla likes...')
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, post_id)
      );
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
    `
    
    console.log('✅ Tabla likes verificada/creada correctamente')
  } catch (error) {
    console.error('Error con tabla likes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createLikesTable()