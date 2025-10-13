const { PrismaClient } = require('@prisma/client')

async function createFollowsTable() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Creando tabla follows...')
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(follower_id, following_id)
      );
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
    `
    
    console.log('✅ Tabla follows creada correctamente')
  } catch (error) {
    console.error('Error creando tabla:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createFollowsTable()