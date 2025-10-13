const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function applyMigration() {
  try {
    console.log('Aplicando migración de follows...')
    
    // Crear tabla de follows
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS follows (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(follower_id, following_id)
        );
      `
    })

    if (createTableError) {
      console.error('Error creando tabla:', createTableError)
      return
    }

    // Crear índices
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
        CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
      `
    })

    if (indexError) {
      console.error('Error creando índices:', indexError)
      return
    }

    console.log('✅ Migración aplicada correctamente')
  } catch (error) {
    console.error('Error aplicando migración:', error)
  }
}

applyMigration()