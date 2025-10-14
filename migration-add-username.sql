-- ============================================
-- MIGRACIÓN: Agregar Username y Campos Nuevos
-- ============================================
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columnas nuevas
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS username VARCHAR(30),
ADD COLUMN IF NOT EXISTS public_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS username_last_changed TIMESTAMPTZ;

-- 2. Generar usernames únicos para usuarios existentes
-- Usa la parte antes del @ del email + número aleatorio si hay duplicados
DO $$
DECLARE
  user_record RECORD;
  base_username VARCHAR(30);
  final_username VARCHAR(30);
  counter INT;
BEGIN
  FOR user_record IN SELECT id, email FROM public.users WHERE username IS NULL
  LOOP
    -- Extraer parte antes del @
    base_username := LOWER(REGEXP_REPLACE(SPLIT_PART(user_record.email, '@', 1), '[^a-z0-9]', '', 'g'));
    
    -- Limitar a 20 caracteres para dejar espacio para números
    base_username := SUBSTRING(base_username FROM 1 FOR 20);
    
    -- Verificar si existe y agregar número si es necesario
    final_username := base_username;
    counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM public.users WHERE username = final_username) LOOP
      final_username := base_username || counter::TEXT;
      counter := counter + 1;
    END LOOP;
    
    -- Actualizar usuario con username único
    UPDATE public.users 
    SET username = final_username,
        username_last_changed = NOW()
    WHERE id = user_record.id;
    
    RAISE NOTICE 'Usuario % asignado username: %', user_record.email, final_username;
  END LOOP;
END $$;

-- 3. Hacer username obligatorio y único
ALTER TABLE public.users 
ALTER COLUMN username SET NOT NULL,
ADD CONSTRAINT users_username_unique UNIQUE (username);

-- 4. Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- 5. Verificar resultados
SELECT id, email, username, username_last_changed 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;
