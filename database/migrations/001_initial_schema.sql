-- 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: farmers
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    age INT,
    gender VARCHAR(50),
    category VARCHAR(100), -- e.g., small, marginal, large
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: farmer_farms
CREATE TABLE IF NOT EXISTS farmer_farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    state VARCHAR(100),
    district VARCHAR(100),
    taluka VARCHAR(100),
    village VARCHAR(100),
    land_area DECIMAL(10, 2),
    land_unit VARCHAR(50), -- e.g., acres, hectares
    irrigation_availability BOOLEAN,
    irrigation_type VARCHAR(100),
    soil_type VARCHAR(100),
    annual_income DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: farmer_crops
CREATE TABLE IF NOT EXISTS farmer_crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop VARCHAR(100),
    season VARCHAR(100),
    cultivated_area DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: schemes
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_mr VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    benefit_description_en TEXT,
    benefit_description_hi TEXT,
    benefit_description_mr TEXT,
    eligibility_description_en TEXT,
    eligibility_description_hi TEXT,
    eligibility_description_mr TEXT,
    application_description_en TEXT,
    application_description_hi TEXT,
    application_description_mr TEXT,
    category VARCHAR(100), -- e.g., farm_machinery, irrigation, financial
    source_url VARCHAR(500),
    source_name VARCHAR(255),
    source_document VARCHAR(500),
    last_verified_at TIMESTAMPTZ,
    verification_status VARCHAR(50) DEFAULT 'Verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: farmer_queries
CREATE TABLE IF NOT EXISTS farmer_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    language VARCHAR(10),
    transcript TEXT,
    intent VARCHAR(100),
    entities JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: voice_interactions
CREATE TABLE IF NOT EXISTS voice_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    language VARCHAR(10),
    context VARCHAR(100),
    transcript TEXT,
    structured_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
