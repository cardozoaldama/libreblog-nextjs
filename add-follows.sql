-- Crear tabla de seguimientos
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);