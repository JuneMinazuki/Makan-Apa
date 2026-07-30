ALTER TABLE map_locations 
    ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE map_locations 
    ALTER COLUMN is_approved SET DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_map_locations_is_approved 
    ON map_locations (is_approved);