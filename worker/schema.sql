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
  sort    INTEGER NOT NULL DEFAULT 0,
  -- Bosta's id for the matching city, from GET /api/v0/cities. A governorate
  -- with no id here cannot be handed to Bosta automatically.
  bosta_city TEXT NOT NULL DEFAULT ''
);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- free_shipping_over = 0 turns the free-shipping threshold off entirely.
INSERT INTO settings (key, value) VALUES
  ('free_shipping_over', '1500'),
  ('default_shipping',   '165'),
  ('store_phone',        ''),
  ('store_email',        'ahmedgad4646@gmail.com'),
  ('store_whatsapp',     ''),
  ('cod_enabled',        '1'),
  ('orders_open',        '1'),
  ('social_facebook',    'https://www.facebook.com/share/1Dq2q1ZMuB/'),
  ('social_instagram',   'https://www.instagram.com/the.five.kids.wear'),
  ('social_tiktok',      'https://www.tiktok.com/@the.five.kids.wear'),
  -- Bosta stays off until the API key is set and a pickup location is picked.
  ('bosta_enabled',      '0'),
  ('bosta_pickup',       ''),
  ('bosta_auto',         '0');

-- Every Egyptian governorate Bosta serves, priced from Bosta's own sector for
-- that city plus 14% VAT (see worker/migrations/001_bosta.sql for the maths).
-- North Sinai ships inactive because Bosta reports no drop-off there.
INSERT INTO shipping_rates (name_ar, name_en, price, active, sort, bosta_city) VALUES
  ('القاهرة',        'Cairo',          115, 1,  1, 'FceDyHXwpSYYF9zGW'),
  ('الجيزة',         'Giza',           115, 1,  2, '0064Qb0OgcA'),
  ('القليوبية',      'Qalyubia',       130, 1,  3, 'yp3atroeTwnyiBNKE'),
  ('الإسكندرية',     'Alexandria',     120, 1,  4, 'Jrb6X6ucjiYgMP4T7'),
  ('البحيرة',        'Beheira',        120, 1,  5, 'g3GchTSmCgR2JynsJ'),
  ('كفر الشيخ',      'Kafr El Sheikh', 130, 1,  6, 'ByP7rFCjL6XzF6j4S'),
  ('الغربية',        'Gharbia',        130, 1,  7, 'K3RwC677J8kJytdZD'),
  ('المنوفية',       'Monufia',        130, 1,  8, 'ruBSjGBDX9wpRa3cc'),
  ('الدقهلية',       'Dakahlia',       130, 1,  9, 'RrDhS8YYsXAwZ9Zfo'),
  ('دمياط',          'Damietta',       130, 1, 10, 'qoZvYcZ8Cqji4pGp5'),
  ('الشرقية',        'Sharqia',        130, 1, 11, '6ExcoGbpYHnggP8JD'),
  ('بورسعيد',        'Port Said',      130, 1, 12, 'skFtf6ZmKo8kBEBDK'),
  ('الإسماعيلية',    'Ismailia',       130, 1, 13, 'PJqNriLtFtx2cfkKP'),
  ('السويس',         'Suez',           130, 1, 14, 'PickurJ5uJZ9rDTHW'),
  ('بني سويف',       'Beni Suef',      165, 1, 15, 'LzbbvTzZ7D2CgE2PL'),
  ('الفيوم',         'Faiyum',         165, 1, 16, 'BW5MiNxEirB7tuz2y'),
  ('المنيا',         'Minya',          165, 1, 17, 'si6eLnKjXqTFTMBj9'),
  ('أسيوط',          'Asyut',          165, 1, 18, '7mDPAohM3ArSZmWTm'),
  ('سوهاج',          'Sohag',          165, 1, 19, 'n3EENg2adhuR9xBZK'),
  ('قنا',            'Qena',           165, 1, 20, 'vfTHTes3uGjAszgtg'),
  ('الأقصر',         'Luxor',          165, 1, 21, 'wgYEdH2WMzxGE2Ztp'),
  ('أسوان',          'Aswan',          165, 1, 22, 'kLvZ5JY6LJPL5chzN'),
  ('البحر الأحمر',   'Red Sea',        165, 1, 23, 'r5TscLCNSjR2GimxQ'),
  ('مطروح',          'Matrouh',        165, 1, 24, 'KBpGiRZJMIx'),
  ('شمال سيناء',     'North Sinai',    175, 0, 25, 'ZuCaDAVQlPT'),
  ('جنوب سيناء',     'South Sinai',    175, 1, 26, 'nG_c44vHQht'),
  ('الوادي الجديد',  'New Valley',     175, 1, 27, 'w4yDVHVJWqa4HpbzA'),
  ('الساحل الشمالي', 'North Coast',    175, 1, 28, '2hGtNLfRgqGrJjnW9');

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
  -- Bosta's shipment id, its printed tracking number, and the last state its
  -- webhook reported. All empty until the order is handed over to Bosta.
  bosta_id       TEXT NOT NULL DEFAULT '',
  bosta_tracking TEXT NOT NULL DEFAULT '',
  bosta_state    TEXT NOT NULL DEFAULT '',
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
