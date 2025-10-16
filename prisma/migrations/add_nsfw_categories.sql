-- Add NSFW categories field to posts table
ALTER TABLE "posts" ADD COLUMN "nsfw_categories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
