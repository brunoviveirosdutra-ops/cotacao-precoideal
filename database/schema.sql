CREATE TABLE IF NOT EXISTS admins (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS suppliers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    company_name TEXT NOT NULL,

    cnpj TEXT UNIQUE,

    contact_name TEXT,

    email TEXT UNIQUE,

    phone TEXT,

    password TEXT,

    status TEXT DEFAULT 'active',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS products (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    category TEXT NOT NULL,

    unit TEXT DEFAULT 'kg',

    description TEXT,

    status TEXT DEFAULT 'active',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS quotes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    deadline DATETIME,

    status TEXT DEFAULT 'open',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS quote_items (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    quote_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity REAL NOT NULL,

    FOREIGN KEY(quote_id) REFERENCES quotes(id),

    FOREIGN KEY(product_id) REFERENCES products(id)

);



CREATE TABLE IF NOT EXISTS supplier_answers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    quote_item_id INTEGER NOT NULL,

    supplier_id INTEGER NOT NULL,

    price REAL NOT NULL,

    observation TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(quote_item_id) REFERENCES quote_items(id),

    FOREIGN KEY(supplier_id) REFERENCES suppliers(id)

);