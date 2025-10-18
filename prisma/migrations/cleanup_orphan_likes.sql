-- Eliminar likes huérfanos (posts que ya no existen)
DELETE FROM likes
WHERE post_id NOT IN (SELECT id FROM posts);

-- Agregar columna profile_theme
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_theme VARCHAR(50) DEFAULT 'aurora';
