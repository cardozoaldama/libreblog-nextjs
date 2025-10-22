-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all comments
CREATE POLICY "Anyone can read comments"
ON comments FOR SELECT
USING (true);

-- Policy: Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id::uuid);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id::uuid)
WITH CHECK (auth.uid() = user_id::uuid);

-- Policy: Users can delete their own comments OR post authors can delete comments on their posts
CREATE POLICY "Users can delete own comments or post author can delete"
ON comments FOR DELETE
USING (
  auth.uid() = user_id::uuid
  OR 
  auth.uid() IN (
    SELECT author_id::uuid FROM posts WHERE id = comments.post_id
  )
);

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id::uuid);

-- Policy: System can create notifications (via service role)
CREATE POLICY "Service role can create notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id::uuid)
WITH CHECK (auth.uid() = user_id::uuid);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id::uuid);
