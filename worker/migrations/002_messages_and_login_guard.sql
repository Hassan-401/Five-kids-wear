-- Migration 002 — a real contact inbox, and a brake on password guessing.
--
-- Additive, like 001. Run once:
--   npm run db:migrate2          (local)
--   npm run db:migrate2:remote   (Cloudflare)

/* ------------------------------------------------------- contact inbox */

-- Until now the contact form and the newsletter box told the customer their
-- message had been sent and then dropped it on the floor. Both now land here
-- and are read from the dashboard.
CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL DEFAULT 'contact',  -- contact | newsletter
  name       TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  subject    TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  handled    INTEGER NOT NULL DEFAULT 0,
  -- SHA-256 of the sender's IP, kept only to rate-limit the form. The address
  -- itself is never stored, so the inbox holds no bare personal data.
  ip_hash    TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_handled ON messages(handled);
CREATE INDEX IF NOT EXISTS idx_messages_ip      ON messages(ip_hash, created_at);

/* -------------------------------------------------------- login guard */

-- PBKDF2 at 100k iterations makes each guess cost something, but nothing
-- stopped an attacker running thousands in parallel. After enough failures in
-- a row the username stops accepting attempts for a while.
CREATE TABLE IF NOT EXISTS login_attempts (
  username     TEXT PRIMARY KEY,
  fails        INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT NOT NULL DEFAULT ''
);
