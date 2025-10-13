-- Agregar campos de redes sociales al modelo User
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "website_url" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "facebook_url" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "instagram_url" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "x_url" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tiktok_url" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "linkedin_url" TEXT;
