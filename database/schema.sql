-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    tax_identifier VARCHAR(100) UNIQUE NOT NULL,
    tax_identifier_type VARCHAR(20) NOT NULL CHECK (tax_identifier_type IN ('EIN', 'VAT', 'GST', 'OTHER')),
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('RETAILER', 'WHOLESALER', 'DISTRIBUTOR', 'MANUFACTURER')),
    tier VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (tier IN ('PENDING', 'BRONZE', 'SILVER', 'GOLD', 'VIP')),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms VARCHAR(20) DEFAULT 'PREPAID' CHECK (payment_terms IN ('PREPAID', 'COD', 'NET_7', 'NET_15', 'NET_30')),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_orgs_tax_id ON organizations(tax_identifier) WHERE is_active = TRUE;
CREATE INDEX idx_orgs_tier ON organizations(tier) WHERE verification_status = 'VERIFIED';

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(320) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ORG_ADMIN', 'BUYER', 'SALES_REP', 'VIEWER')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    path VARCHAR(1000),
    depth INT NOT NULL DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE category_closure (
    ancestor_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    descendant_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    depth INT NOT NULL,
    PRIMARY KEY (ancestor_id, descendant_id)
);

-- CERTIFICATIONS
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    badge_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    brand VARCHAR(200),
    base_msrp DECIMAL(15,4) NOT NULL CHECK (base_msrp >= 0),
    currency_code CHAR(3) NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_visible_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_products_sku ON products(sku) WHERE is_active = TRUE;
CREATE INDEX idx_products_slug ON products(slug) WHERE is_active = TRUE;

-- PRODUCT SPECIFICATIONS
CREATE TABLE product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE UNIQUE,
    dilution_ratio VARCHAR(20),
    yield_per_unit DECIMAL(10,2),
    brix_value DECIMAL(5,2),
    ph_level DECIMAL(3,1),
    viscosity_cps DECIMAL(10,2),
    storage_temp_min_c DECIMAL(5,1),
    storage_temp_max_c DECIMAL(5,1),
    requires_refrigeration BOOLEAN DEFAULT FALSE,
    light_sensitive BOOLEAN DEFAULT FALSE,
    shelf_life_days INT,
    shelf_life_after_open_days INT,
    allergen_contains JSONB DEFAULT '[]',
    allergen_may_contain JSONB DEFAULT '[]',
    allergen_facility JSONB DEFAULT '[]',
    calories_per_100 DECIMAL(8,2),
    sugar_content_percent DECIMAL(5,2),
    is_kosher BOOLEAN DEFAULT FALSE,
    is_halal BOOLEAN DEFAULT FALSE,
    is_organic BOOLEAN DEFAULT FALSE,
    is_non_gmo BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    version INT NOT NULL DEFAULT 1
);

-- JUNCTION TABLES
CREATE TABLE product_certifications (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, certification_id)
);

CREATE TABLE product_categories (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (product_id, category_id)
);

-- PACKAGING UNITS
CREATE TABLE packaging_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    unit_type VARCHAR(50) NOT NULL CHECK (unit_type IN ('GALLON_JUG', '5GALLON_PAIL', '55GALLON_DRUM', '275GALLON_TOTE', 'KILOGRAM_PAIL')),
    quantity_in_base_unit DECIMAL(15,6) NOT NULL,
    base_unit VARCHAR(20) NOT NULL DEFAULT 'GALLON',
    weight_kg DECIMAL(10,3),
    dimensions_cm JSONB,
    units_per_pallet INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCT BATCHES
CREATE TABLE product_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    lot_number VARCHAR(100) UNIQUE NOT NULL,
    production_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    best_by_date DATE,
    quantity_produced DECIMAL(15,3) NOT NULL,
    quantity_available DECIMAL(15,3) NOT NULL DEFAULT 0,
    unit_of_measure VARCHAR(20) NOT NULL,
    production_facility VARCHAR(200),
    country_of_origin CHAR(2),
    qc_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (qc_status IN ('PENDING', 'PASSED', 'FAILED', 'QUARANTINED', 'RELEASED')),
    qc_test_date TIMESTAMPTZ,
    coa_document_url VARCHAR(500),
    recall_status VARCHAR(30) DEFAULT NULL CHECK (recall_status IN (NULL, 'VOLUNTARY', 'MANDATORY', 'COMPLETED')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_batches_lot ON product_batches(lot_number);
CREATE INDEX idx_batches_expiry ON product_batches(expiration_date) WHERE qc_status = 'RELEASED' AND recall_status IS NULL;
CREATE INDEX idx_batches_product ON product_batches(product_id, expiration_date);

-- PRICE BOOKS
CREATE TABLE price_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    target_tier VARCHAR(20) CHECK (target_tier IN ('BRONZE', 'SILVER', 'GOLD', 'VIP')),
    target_organization_id UUID REFERENCES organizations(id),
    priority INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_pb_tier ON price_books(target_tier) WHERE is_active = TRUE;
CREATE INDEX idx_pb_org ON price_books(target_organization_id) WHERE is_active = TRUE;

-- PRICE BOOK ENTRIES
CREATE TABLE price_book_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_book_id UUID NOT NULL REFERENCES price_books(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    packaging_unit_id UUID REFERENCES packaging_units(id),
    price DECIMAL(15,4) NOT NULL CHECK (price >= 0),
    min_quantity INT NOT NULL DEFAULT 1,
    max_quantity INT,
    discount_percent DECIMAL(5,2) CHECK (discount_percent >= 0 AND discount_percent <= 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1,
    UNIQUE (price_book_id, product_id, packaging_unit_id, min_quantity)
);

-- VOLUME DISCOUNTS
CREATE TABLE volume_discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD', 'VIP')),
    product_id UUID REFERENCES products(id),
    min_quantity INT NOT NULL,
    max_quantity INT,
    discount_percent DECIMAL(5,2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RFQ
CREATE TABLE rfq_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'PRICED', 'COUNTERED', 'APPROVED', 'REJECTED', 'CONVERTED_TO_ORDER', 'EXPIRED')),
    delivery_frequency VARCHAR(20) CHECK (delivery_frequency IN ('ONE_TIME', 'WEEKLY', 'MONTHLY', 'SEASONAL')),
    delivery_address JSONB,
    notes TEXT,
    assigned_tier VARCHAR(20) CHECK (assigned_tier IN ('BRONZE', 'SILVER', 'GOLD', 'VIP')),
    expires_at TIMESTAMPTZ,
    converted_order_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_rfq_org ON rfq_requests(organization_id);
CREATE INDEX idx_rfq_status ON rfq_requests(status);

CREATE TABLE rfq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID NOT NULL REFERENCES rfq_requests(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    packaging_unit_id UUID NOT NULL REFERENCES packaging_units(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    notes TEXT,
    quoted_unit_price DECIMAL(15,4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rfq_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID NOT NULL REFERENCES rfq_requests(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('CUSTOMER', 'SALES_REP')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED')),
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    shipping_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    po_number VARCHAR(100),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);
CREATE INDEX idx_orders_org ON orders(organization_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    packaging_unit_id UUID NOT NULL REFERENCES packaging_units(id),
    product_name VARCHAR(500) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(15,4) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES product_batches(id),
    lot_number VARCHAR(100) NOT NULL,
    quantity DECIMAL(15,3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    notes TEXT,
    actor_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SHIPMENTS
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) UNIQUE,
    carrier VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    estimated_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    delivered_to VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE temperature_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    temperature_c DECIMAL(5,2) NOT NULL,
    is_in_range BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    order_id UUID NOT NULL REFERENCES orders(id) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'OPEN', 'PAID', 'OVERDUE', 'CANCELLED', 'DISPUTED')),
    subtotal DECIMAL(15,2) NOT NULL,
    discount_total DECIMAL(15,2) DEFAULT 0,
    tax_total DECIMAL(15,2) DEFAULT 0,
    shipping_total DECIMAL(15,2) DEFAULT 0,
    grand_total DECIMAL(15,2) NOT NULL,
    currency CHAR(3) DEFAULT 'USD',
    payment_terms VARCHAR(20),
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_name VARCHAR(500) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    lot_number VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    actor_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- GMV TRACKING
CREATE TABLE gmv_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    amount DECIMAL(15,2) NOT NULL,
    recorded_month DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_gmv_org ON gmv_records(organization_id);
CREATE INDEX idx_gmv_month ON gmv_records(recorded_month);

-- SEQUENCES
CREATE TABLE sequences (
    name VARCHAR(50) PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    current_value INT NOT NULL DEFAULT 1
);

INSERT INTO sequences (name, prefix, current_value) VALUES
    ('orders', 'PAT-ORD-', 1000),
    ('rfq', 'PAT-RFQ-', 1000),
    ('invoices', 'PAT-INV-', 1000);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO categories (name, slug, description, depth, sort_order) VALUES
    ('Beverage Concentrates', 'beverage-concentrates', 'Cola, fruit, and energy drink concentrates', 0, 1),
    ('Jams & Spreads', 'jams-and-spreads', 'Fruit jams, jellies, and bakery fillings', 0, 2),
    ('Syrups & Mixers', 'syrups-and-mixers', 'Sweetening syrups and cocktail mixers', 0, 3),
    ('Equipment', 'equipment', 'Dispensing equipment and spare parts', 0, 4);

INSERT INTO certifications (name, description) VALUES
    ('Kosher Certified', 'Certified kosher by Orthodox Union'),
    ('Halal Certified', 'Certified halal by ISNA'),
    ('USDA Organic', 'Certified organic by USDA'),
    ('Non-GMO Project Verified', 'Verified non-GMO'),
    ('Gluten-Free', 'Certified gluten-free'),
    ('Vegan', 'Suitable for vegans');

INSERT INTO products (sku, name, slug, description, brand, base_msrp, is_visible_anonymous) VALUES
    ('CON-COL-5-1', 'PATSON Cola Concentrate 5:1', 'patson-cola-concentrate-5-1', 'Premium cola concentrate for fountain dispensing.', 'PATSON', 25.00, true),
    ('CON-COL-DIET-5-1', 'PATSON Diet Cola Concentrate 5:1', 'patson-diet-cola-concentrate-5-1', 'Zero-calorie diet cola concentrate.', 'PATSON', 26.00, true),
    ('CON-LEMON-5-1', 'PATSON Lemon Lime Concentrate 5:1', 'patson-lemon-lime-concentrate-5-1', 'Refreshing lemon-lime concentrate.', 'PATSON', 24.00, true),
    ('JAM-STR-5KG', 'PATSON Strawberry Jam 5kg', 'patson-strawberry-jam-5kg', 'Bakery-grade strawberry jam with real fruit pieces.', 'PATSON', 45.00, true),
    ('SYR-VAN-1G', 'PATSON Vanilla Syrup 1 Gallon', 'patson-vanilla-syrup-1g', 'Rich vanilla flavored syrup.', 'PATSON', 22.00, true);

INSERT INTO product_specifications (product_id, dilution_ratio, brix_value, ph_level, shelf_life_days, shelf_life_after_open_days, storage_temp_min_c, storage_temp_max_c, is_kosher, is_halal, is_vegan, is_gluten_free)
SELECT id, '5:1', 65.0, 2.8, 540, 90, 4.0, 25.0, true, true, true, true FROM products WHERE sku = 'CON-COL-5-1';

INSERT INTO product_specifications (product_id, dilution_ratio, brix_value, ph_level, shelf_life_days, shelf_life_after_open_days, storage_temp_min_c, storage_temp_max_c, is_kosher, is_halal, is_vegan, is_gluten_free)
SELECT id, '5:1', 62.0, 2.9, 540, 90, 4.0, 25.0, true, true, true, true FROM products WHERE sku = 'CON-COL-DIET-5-1';

INSERT INTO product_specifications (product_id, shelf_life_days, shelf_life_after_open_days, storage_temp_min_c, storage_temp_max_c, is_kosher, is_gluten_free)
SELECT id, 365, 30, 2.0, 25.0, true, true FROM products WHERE sku = 'JAM-STR-5KG';

INSERT INTO packaging_units (product_id, unit_type, quantity_in_base_unit, base_unit, weight_kg, units_per_pallet)
SELECT id, 'GALLON_JUG', 1, 'GALLON', 4.5, 120 FROM products WHERE sku = 'CON-COL-5-1'
UNION ALL SELECT id, '5GALLON_PAIL', 5, 'GALLON', 22.0, 36 FROM products WHERE sku = 'CON-COL-5-1'
UNION ALL SELECT id, '55GALLON_DRUM', 55, 'GALLON', 220.0, 4 FROM products WHERE sku = 'CON-COL-5-1'
UNION ALL SELECT id, '275GALLON_TOTE', 275, 'GALLON', 1100.0, 1 FROM products WHERE sku = 'CON-COL-5-1'
UNION ALL SELECT id, 'KILOGRAM_PAIL', 5, 'KILOGRAM', 5.5, 80 FROM products WHERE sku = 'JAM-STR-5KG'
UNION ALL SELECT id, 'GALLON_JUG', 1, 'GALLON', 4.2, 120 FROM products WHERE sku = 'SYR-VAN-1G';

INSERT INTO product_batches (product_id, lot_number, production_date, expiration_date, quantity_produced, quantity_available, unit_of_measure, qc_status)
SELECT id, 'LOT-2026-COL-001', '2026-06-01', '2027-12-01', 5000, 5000, 'GALLON', 'RELEASED' FROM products WHERE sku = 'CON-COL-5-1';

INSERT INTO product_batches (product_id, lot_number, production_date, expiration_date, quantity_produced, quantity_available, unit_of_measure, qc_status)
SELECT id, 'LOT-2026-JAM-001', '2026-05-15', '2027-05-15', 2000, 2000, 'KILOGRAM', 'RELEASED' FROM products WHERE sku = 'JAM-STR-5KG';