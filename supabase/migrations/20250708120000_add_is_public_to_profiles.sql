-- Add is_public flag to profiles and update public access policy
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_public = true);
