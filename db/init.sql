CREATE TABLE IF NOT EXISTS residential_complexes (
    residential_complex_id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    address VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    residential_complex_id INT REFERENCES residential_complexes(residential_complex_id) ON DELETE CASCADE NOT NULL
);

