/*
  # Add signature columns to contracts table

  1. Changes
    - Add `vendor_signature` column for vendor digital signatures
    - Add `client_signature` column for client digital signatures

  2. Notes
    - Uses safe column addition with IF NOT EXISTS checks
    - Signatures stored as base64 data URLs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'vendor_signature'
  ) THEN
    ALTER TABLE contracts ADD COLUMN vendor_signature text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'client_signature'
  ) THEN
    ALTER TABLE contracts ADD COLUMN client_signature text;
  END IF;
END $$;