CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES admin_users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    year INTEGER NOT NULL,
    price BIGINT NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    power INTEGER NOT NULL,
    acceleration NUMERIC(4,1) NOT NULL,
    drive VARCHAR(50) NOT NULL,
    cover TEXT NOT NULL,
    gallery JSONB NOT NULL DEFAULT '[]',
    video TEXT,
    tag VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);