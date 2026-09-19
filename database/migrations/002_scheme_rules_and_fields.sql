-- 002_scheme_rules.sql

CREATE TABLE IF NOT EXISTS scheme_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL, -- e.g., land_area, farmer_category, state
    operator VARCHAR(20) NOT NULL,    -- =, !=, >, >=, <, <=, IN, NOT_IN, CONTAINS
    value JSONB NOT NULL,             -- stored as JSONB to support arrays/strings/numbers
    required BOOLEAN DEFAULT true,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 003_application_fields.sql

CREATE TABLE IF NOT EXISTS scheme_application_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    label_en VARCHAR(255) NOT NULL,
    label_hi VARCHAR(255),
    label_mr VARCHAR(255),
    field_type VARCHAR(50) NOT NULL, -- text, number, date, select, radio, checkbox, textarea, file
    required BOOLEAN DEFAULT true,
    help_text_en TEXT,
    help_text_hi TEXT,
    help_text_mr TEXT,
    validation_rule TEXT,
    field_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, in_review, ready, redirected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    field_id UUID REFERENCES scheme_application_fields(id) ON DELETE CASCADE,
    answer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheme_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    storage_path VARCHAR(500),
    document_type VARCHAR(100),
    required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
