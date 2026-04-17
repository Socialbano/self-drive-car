-- Migration: Add Manual Vehicle Entry Support for Invoices
-- This allows admins to generate ad-hoc bills without directly linking to the 'cars' table.

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS manual_vehicle_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS manual_vehicle_type VARCHAR(100) DEFAULT NULL;

-- Optionally, add this to the agreements table if they also want to support ad-hoc agreements in the future
ALTER TABLE agreements
ADD COLUMN IF NOT EXISTS manual_vehicle_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS manual_vehicle_type VARCHAR(100) DEFAULT NULL;
