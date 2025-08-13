/*
  # Add client_type column to clients table

  1. Changes
    - Add `client_type` column to `clients` table with default value 'Langsung'
    - This column tracks whether client came directly or through vendor

  2. Notes
    - Uses safe column addition with IF NOT EXISTS check
    - Sets default value for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'client_type'
  ) THEN
    ALTER TABLE clients ADD COLUMN client_type text DEFAULT 'Langsung';
  END IF;
END $$;