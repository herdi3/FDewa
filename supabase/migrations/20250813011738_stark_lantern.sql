/*
  # Add missing columns to projects table

  1. Changes
    - Add various missing columns to support all project features
    - Add columns for client confirmations, sub-statuses, digital items, etc.

  2. Notes
    - Uses safe column addition with IF NOT EXISTS checks
    - Sets appropriate default values
*/

DO $$
BEGIN
  -- Add active_sub_statuses column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'active_sub_statuses'
  ) THEN
    ALTER TABLE projects ADD COLUMN active_sub_statuses text[] DEFAULT '{}';
  END IF;

  -- Add client confirmation columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_editing_confirmed_by_client'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_editing_confirmed_by_client boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_printing_confirmed_by_client'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_printing_confirmed_by_client boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_delivery_confirmed_by_client'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_delivery_confirmed_by_client boolean DEFAULT false;
  END IF;

  -- Add sub-status tracking columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'confirmed_sub_statuses'
  ) THEN
    ALTER TABLE projects ADD COLUMN confirmed_sub_statuses text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'client_sub_status_notes'
  ) THEN
    ALTER TABLE projects ADD COLUMN client_sub_status_notes jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'sub_status_confirmation_sent_at'
  ) THEN
    ALTER TABLE projects ADD COLUMN sub_status_confirmation_sent_at jsonb DEFAULT '{}';
  END IF;

  -- Add digital items tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'completed_digital_items'
  ) THEN
    ALTER TABLE projects ADD COLUMN completed_digital_items text[] DEFAULT '{}';
  END IF;

  -- Add printing and transport costs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'printing_cost'
  ) THEN
    ALTER TABLE projects ADD COLUMN printing_cost numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'transport_cost'
  ) THEN
    ALTER TABLE projects ADD COLUMN transport_cost numeric DEFAULT 0;
  END IF;

  -- Add printing details
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'printing_details'
  ) THEN
    ALTER TABLE projects ADD COLUMN printing_details jsonb DEFAULT '[]';
  END IF;

  -- Add revisions support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'revisions'
  ) THEN
    ALTER TABLE projects ADD COLUMN revisions jsonb DEFAULT '[]';
  END IF;

  -- Add invoice signature
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'invoice_signature'
  ) THEN
    ALTER TABLE projects ADD COLUMN invoice_signature text;
  END IF;
END $$;