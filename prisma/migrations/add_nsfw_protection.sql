-- Add NSFW protection field to users table
ALTER TABLE "users" ADD COLUMN "nsfw_protection" BOOLEAN NOT NULL DEFAULT true;

-- Add NSFW field to posts table
ALTER TABLE "posts" ADD COLUMN "is_nsfw" BOOLEAN NOT NULL DEFAULT false;

-- Add index for NSFW posts
CREATE INDEX "idx_posts_is_nsfw" ON "posts"("is_nsfw");

