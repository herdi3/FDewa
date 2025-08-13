/*
  # Add missing columns to transactions table

  1. Changes
    - Add `printing_item_id` column for linking to printing items
    - Add `vendor_signature` column for digital signatures

  2. Notes
    - Uses safe column addition with IF NOT EXISTS checks
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'printing_item_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN printing_item_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'vendor_signature'
  ) THEN
    ALTER TABLE transactions ADD COLUMN vendor_signature text;
  END IF;
END $$;