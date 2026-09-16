-- Five Kids Wear — D1 schema.
--
-- Apply it with:
--   npx wrangler d1 execute five-kids-wear --local  --file=./worker/schema.sql
--   npx wrangler d1 execute five-kids-wear --remote --file=./worker/schema.sql
--
-- Money is stored as whole Egyptian pounds (INTEGER). Lists that the storefront
-- treats as opaque (sizes, colours, images) are stored as JSON text.

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS shipping_rates;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS admins;

/* ------------------------------------------------------------------ */
/* catalogue                                                           */
/* ------------------------------------------------------------------ */

CREATE TABLE categories (
  id         TEXT PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  name_ar    TEXT NOT NULL,
  name_en    TEXT NOT NULL,
  image      TEXT NOT NULL DEFAULT '',
  tint       TEXT NOT NULL DEFAULT 'from-sky-100 to-pink-100',
  -- 1 when the tile art is a photograph (cropped to fill) rather than artwork
  photo      INTEGER NOT NULL DEFAULT 0,
  sort       INTEGER NOT NULL DEFAULT 0,
  active     INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE products (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  desc_ar     TEXT NOT NULL DEFAULT '',
  desc_en     TEXT NOT NULL DEFAULT '',
  price       INTEGER NOT NULL,
  old_price   INTEGER,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  gender      TEXT NOT NULL DEFAULT 'unisex',   -- boys | girls | unisex
  sizes       TEXT NOT NULL DEFAULT '[]',       -- JSON: ["2","4",...]
  colors      TEXT NOT NULL DEFAULT '[]',       -- JSON: [{nameAr,nameEn,hex}]
  images      TEXT NOT NULL DEFAULT '[]',       -- JSON: ["/images/...", ...]
  is_new      INTEGER NOT NULL DEFAULT 0,
  in_stock    INTEGER NOT NULL DEFAULT 1,
  popularity  INTEGER NOT NULL DEFAULT 50,      -- drives "best sellers"
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active   ON products(active);

/* ------------------------------------------------------------------ */
/* shipping + settings                                                 */
/* ------------------------------------------------------------------ */

CREATE TABLE shipping_rates (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL UNIQUE,
  price   INTEGER NOT NULL,
  active  INTEGER NOT NULL DEFAULT 1,
  sort    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- free_shipping_over = 0 turns the free-shipping threshold off entirely.
INSERT INTO settings (key, value) VALUES
  ('free_shipping_over', '1000'),
  ('default_shipping',   '60'),
  ('store_phone',        ''),
  ('store_email',        ''),
  ('store_whatsapp',     ''),
  ('cod_enabled',        '1'),
  ('orders_open',        '1');

-- All 27 governorates, with rates the client can change from the dashboard.
INSERT INTO shipping_rates (name_ar, name_en, price, sort) VALUES
  ('القاهرة',       'Cairo',          50,  1),
  ('الجيزة',        'Giza',           50,  2),
  ('القليوبية',     'Qalyubia',       50,  3),
  ('الإسكندرية',    'Alexandria',     60,  4),
  ('البحيرة',       'Beheira',        60,  5),
  ('كفر الشيخ',     'Kafr El Sheikh', 60,  6),
  ('الغربية',       'Gharbia',        60,  7),
  ('المنوفية',      'Monufia',        60,  8),
  ('الدقهلية',      'Dakahlia',       60,  9),
  ('دمياط',         'Damietta',       60, 10),
  ('الشرقية',       'Sharqia',        60, 11),
  ('بورسعيد',       'Port Said',      70, 12),
  ('الإسماعيلية',   'Ismailia',       70, 13),
  ('السويس',        'Suez',           70, 14),
  ('بني سويف',      'Beni Suef',      75, 15),
  ('الفيوم',        'Faiyum',         75, 16),
  ('المنيا',        'Minya',          75, 17),
  ('أسيوط',         'Asyut',          75, 18),
  ('سوهاج',         'Sohag',          75, 19),
  ('قنا',           'Qena',           80, 20),
  ('الأقصر',        'Luxor',          80, 21),
  ('أسوان',         'Aswan',          80, 22),
  ('البحر الأحمر',  'Red Sea',        90, 23),
  ('مطروح',         'Matrouh',        90, 24),
  ('شمال سيناء',    'North Sinai',    90, 25),
  ('جنوب سيناء',    'South Sinai',    90, 26),
  ('الوادي الجديد', 'New Valley',     90, 27);

/* ------------------------------------------------------------------ */
/* orders                                                              */
/* ------------------------------------------------------------------ */

CREATE TABLE orders (
  id          TEXT PRIMARY KEY,               -- FKW-10248
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT NOT NULL DEFAULT '',
  governorate TEXT NOT NULL,                  -- English name, as stored
  address     TEXT NOT NULL,
  notes       TEXT NOT NULL DEFAULT '',
  payment     TEXT NOT NULL DEFAULT 'cod',
  subtotal    INTEGER NOT NULL,
  shipping    INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  -- pending | confirmed | shipped | delivered | cancelled
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_orders_status  ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_phone   ON orders(phone);

-- Item rows keep their own copy of the name, image and price so an order still
-- reads correctly after the product is renamed, repriced or deleted.
CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL DEFAULT '',
  slug       TEXT NOT NULL DEFAULT '',
  name_ar    TEXT NOT NULL,
  name_en    TEXT NOT NULL,
  image      TEXT NOT NULL DEFAULT '',
  size       TEXT NOT NULL DEFAULT '',
  color      TEXT NOT NULL DEFAULT '',
  qty        INTEGER NOT NULL,
  price      INTEGER NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

/* ------------------------------------------------------------------ */
/* dashboard accounts                                                  */
/* ------------------------------------------------------------------ */

CREATE TABLE admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,                -- pbkdf2$<iterations>$<salt>$<hash>
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Only the SHA-256 of the cookie token is stored, so a copy of the database
-- cannot be turned into a live dashboard session.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  admin_id   INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_expires ON sessions(expires_at);
