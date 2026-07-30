CREATE TABLE IF NOT EXISTS map_locations (
    id SMALLINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type SMALLINT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    schedule INT[][] NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_map_locations_coords 
    ON map_locations (lat, lng);

CREATE INDEX IF NOT EXISTS idx_map_locations_type 
    ON map_locations (type);

CREATE INDEX IF NOT EXISTS idx_map_locations_is_approved 
    ON map_locations (is_approved);
