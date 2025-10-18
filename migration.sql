-- Eliminar columna nsfw_categories de posts
ALTER TABLE posts DROP COLUMN IF EXISTS nsfw_categories;

-- Agregar columna blocked_users a users si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'blocked_users'
  ) THEN
    ALTER TABLE users ADD COLUMN blocked_users UUID[] DEFAULT '{}';
  END IF;
END $$;
