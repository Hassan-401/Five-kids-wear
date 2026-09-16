-- Migration 001 — Bosta shipping, social links, VAT-corrected rates.
--
-- Unlike `worker/schema.sql`, this file is ADDITIVE: it never drops a table, so
-- it is safe to run against the live database with orders in it. Run it once:
--
--   npm run db:migrate          (local)
--   npm run db:migrate:remote   (Cloudflare)
--
-- SQLite has no `ADD COLUMN IF NOT EXISTS`, so re-running it fails on the
-- ALTERs with "duplicate column name" — that error means it already ran.

/* --------------------------------------------------- Bosta on an order */

-- Bosta's own id for the shipment, its human tracking number, and the last
-- state its webhook reported. Empty until the order is handed to Bosta.
ALTER TABLE orders ADD COLUMN bosta_id       TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN bosta_tracking TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN bosta_state    TEXT NOT NULL DEFAULT '';

-- Which Bosta city a governorate maps to. Bosta needs its own id, not a name.
ALTER TABLE shipping_rates ADD COLUMN bosta_city TEXT NOT NULL DEFAULT '';

/* ------------------------------------------------------- new settings */

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('social_facebook',  'https://www.facebook.com/share/1Dq2q1ZMuB/'),
  ('social_instagram', 'https://www.instagram.com/the.five.kids.wear'),
  ('social_tiktok',    'https://www.tiktok.com/@the.five.kids.wear'),
  ('bosta_enabled',    '0'),
  ('bosta_pickup',     ''),
  ('bosta_auto',       '0');

UPDATE settings SET value = 'ahmedgad4646@gmail.com' WHERE key = 'store_email' AND value = '';

/* ---------------------------------------------------- shipping prices */

-- Bosta's quoted forward-delivery price is per SECTOR and excludes 14% VAT:
--   sector 1 Cairo/Giza        97  → 110.58 → we charge 115
--   sector 2 Alexandria/Beheira 102 → 116.28 → we charge 120
--   sector 3 Delta & Canal     110 → 125.40 → we charge 130
--   sector 4+5 Upper Egypt/Red Sea 140 → 159.60 → we charge 165
--   sector 6+7 North Coast, Sinai, New Valley — not in Bosta's published
--             table, so 175 is a placeholder until they quote it.
-- The sector of every city comes from Bosta's own GET /api/v0/cities.
UPDATE shipping_rates SET price = 115, bosta_city = 'FceDyHXwpSYYF9zGW' WHERE name_en = 'Cairo';
UPDATE shipping_rates SET price = 115, bosta_city = '0064Qb0OgcA' WHERE name_en = 'Giza';
UPDATE shipping_rates SET price = 130, bosta_city = 'yp3atroeTwnyiBNKE' WHERE name_en = 'Qalyubia';
UPDATE shipping_rates SET price = 120, bosta_city = 'Jrb6X6ucjiYgMP4T7' WHERE name_en = 'Alexandria';
UPDATE shipping_rates SET price = 120, bosta_city = 'g3GchTSmCgR2JynsJ' WHERE name_en = 'Beheira';
UPDATE shipping_rates SET price = 130, bosta_city = 'ByP7rFCjL6XzF6j4S' WHERE name_en = 'Kafr El Sheikh';
UPDATE shipping_rates SET price = 130, bosta_city = 'K3RwC677J8kJytdZD' WHERE name_en = 'Gharbia';
UPDATE shipping_rates SET price = 130, bosta_city = 'ruBSjGBDX9wpRa3cc' WHERE name_en = 'Monufia';
UPDATE shipping_rates SET price = 130, bosta_city = 'RrDhS8YYsXAwZ9Zfo' WHERE name_en = 'Dakahlia';
UPDATE shipping_rates SET price = 130, bosta_city = 'qoZvYcZ8Cqji4pGp5' WHERE name_en = 'Damietta';
UPDATE shipping_rates SET price = 130, bosta_city = '6ExcoGbpYHnggP8JD' WHERE name_en = 'Sharqia';
UPDATE shipping_rates SET price = 130, bosta_city = 'skFtf6ZmKo8kBEBDK' WHERE name_en = 'Port Said';
UPDATE shipping_rates SET price = 130, bosta_city = 'PJqNriLtFtx2cfkKP' WHERE name_en = 'Ismailia';
UPDATE shipping_rates SET price = 130, bosta_city = 'PickurJ5uJZ9rDTHW' WHERE name_en = 'Suez';
UPDATE shipping_rates SET price = 165, bosta_city = 'LzbbvTzZ7D2CgE2PL' WHERE name_en = 'Beni Suef';
UPDATE shipping_rates SET price = 165, bosta_city = 'BW5MiNxEirB7tuz2y' WHERE name_en = 'Faiyum';
UPDATE shipping_rates SET price = 165, bosta_city = 'si6eLnKjXqTFTMBj9' WHERE name_en = 'Minya';
UPDATE shipping_rates SET price = 165, bosta_city = '7mDPAohM3ArSZmWTm' WHERE name_en = 'Asyut';
UPDATE shipping_rates SET price = 165, bosta_city = 'n3EENg2adhuR9xBZK' WHERE name_en = 'Sohag';
UPDATE shipping_rates SET price = 165, bosta_city = 'vfTHTes3uGjAszgtg' WHERE name_en = 'Qena';
UPDATE shipping_rates SET price = 165, bosta_city = 'wgYEdH2WMzxGE2Ztp' WHERE name_en = 'Luxor';
UPDATE shipping_rates SET price = 165, bosta_city = 'kLvZ5JY6LJPL5chzN' WHERE name_en = 'Aswan';
UPDATE shipping_rates SET price = 165, bosta_city = 'r5TscLCNSjR2GimxQ' WHERE name_en = 'Red Sea';
UPDATE shipping_rates SET price = 165, bosta_city = 'KBpGiRZJMIx' WHERE name_en = 'Matrouh';
UPDATE shipping_rates SET price = 175, bosta_city = 'ZuCaDAVQlPT', active = 0 WHERE name_en = 'North Sinai';
UPDATE shipping_rates SET price = 175, bosta_city = 'nG_c44vHQht' WHERE name_en = 'South Sinai';
UPDATE shipping_rates SET price = 175, bosta_city = 'w4yDVHVJWqa4HpbzA' WHERE name_en = 'New Valley';
INSERT INTO shipping_rates (name_ar, name_en, price, active, sort, bosta_city) VALUES ('الساحل الشمالي', 'North Coast', 175, 1, 28, '2hGtNLfRgqGrJjnW9')
  ON CONFLICT(name_en) DO UPDATE SET price = excluded.price, bosta_city = excluded.bosta_city;

-- The old 1000 threshold gave away a 115–175 delivery on a two-item order.
UPDATE settings SET value = '1500' WHERE key = 'free_shipping_over';
UPDATE settings SET value = '165'  WHERE key = 'default_shipping';
