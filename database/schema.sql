PRAGMA foreign_keys = ON;

-- =====================================================
-- TABELA DE ADMINISTRADORES
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- TABELA DE FORNECEDORES
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    company_name TEXT NOT NULL,

    cnpj TEXT UNIQUE,

    contact_name TEXT,

    email TEXT UNIQUE NOT NULL,

    phone TEXT,

    password TEXT NOT NULL,

    status TEXT DEFAULT 'active',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- TABELA DE PRODUTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS products (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    category TEXT NOT NULL,

    unit TEXT DEFAULT 'kg',

    description TEXT,

    status TEXT DEFAULT 'active',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- TABELA DE COTAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS quotes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    description TEXT,

    deadline DATETIME NOT NULL,

    status TEXT DEFAULT 'open',

    created_by INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES admins(id)

);

-- =====================================================
-- PRODUTOS DA COTAÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS quote_items (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    quote_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity REAL NOT NULL,

    FOREIGN KEY (quote_id)
        REFERENCES quotes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)

);

-- =====================================================
-- FORNECEDORES PARTICIPANTES
-- =====================================================

CREATE TABLE IF NOT EXISTS quote_suppliers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    quote_id INTEGER NOT NULL,

    supplier_id INTEGER NOT NULL,

    viewed INTEGER DEFAULT 0,

    answered INTEGER DEFAULT 0,

    answer_date DATETIME,

    FOREIGN KEY (quote_id)
        REFERENCES quotes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)

);

-- =====================================================
-- RESPOSTAS DOS FORNECEDORES
-- =====================================================

CREATE TABLE IF NOT EXISTS supplier_answers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    quote_item_id INTEGER NOT NULL,

    supplier_id INTEGER NOT NULL,

    price REAL NOT NULL,

    observation TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (quote_item_id)
        REFERENCES quote_items(id)
        ON DELETE CASCADE,

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)

);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_quotes_status
ON quotes(status);

CREATE INDEX IF NOT EXISTS idx_quote_items_quote
ON quote_items(quote_id);

CREATE INDEX IF NOT EXISTS idx_quote_items_product
ON quote_items(product_id);

CREATE INDEX IF NOT EXISTS idx_quote_suppliers_quote
ON quote_suppliers(quote_id);

CREATE INDEX IF NOT EXISTS idx_quote_suppliers_supplier
ON quote_suppliers(supplier_id);

CREATE INDEX IF NOT EXISTS idx_supplier_answers_supplier
ON supplier_answers(supplier_id);

CREATE INDEX IF NOT EXISTS idx_supplier_answers_item
ON supplier_answers(quote_item_id);