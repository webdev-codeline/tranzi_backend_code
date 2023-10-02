CREATE TABLE IF NOT EXISTS populations (
    id SERIAL PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    population INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_state_city
ON populations (state, city);