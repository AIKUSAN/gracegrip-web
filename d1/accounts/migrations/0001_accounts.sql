CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  synced_progress TEXT,
  sync_revision INTEGER NOT NULL DEFAULT 0,
  synced_at TEXT,
  verified_email TEXT,
  article_email_opt_in INTEGER NOT NULL DEFAULT 0,
  unsubscribe_token_hash TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS accounts_verified_email_idx ON accounts(verified_email);
CREATE UNIQUE INDEX IF NOT EXISTS accounts_unsubscribe_token_idx ON accounts(unsubscribe_token_hash);

CREATE TABLE IF NOT EXISTS credentials (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  transports TEXT NOT NULL DEFAULT '[]',
  device_type TEXT NOT NULL,
  backed_up INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS credentials_account_idx ON credentials(account_id);

CREATE TABLE IF NOT EXISTS auth_challenges (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('register', 'login')),
  account_id TEXT,
  challenge TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT
);
CREATE INDEX IF NOT EXISTS auth_challenges_expiry_idx ON auth_challenges(expires_at);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  authenticated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_account_idx ON sessions(account_id);

CREATE TABLE IF NOT EXISTS recovery_codes (
  code_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS recovery_codes_account_idx ON recovery_codes(account_id);

CREATE TABLE IF NOT EXISTS auth_rate (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_tokens (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('verify', 'recover')),
  pending_email TEXT,
  expires_at TEXT NOT NULL,
  consumed_at TEXT
);
CREATE INDEX IF NOT EXISTS email_tokens_expiry_idx ON email_tokens(expires_at);

CREATE TABLE IF NOT EXISTS email_quota (
  quota_key TEXT PRIMARY KEY,
  used INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS email_quota_expiry_idx ON email_quota(expires_at);

CREATE TABLE IF NOT EXISTS article_email_sent (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  sent_at TEXT NOT NULL,
  PRIMARY KEY (account_id, slug)
);

CREATE TABLE IF NOT EXISTS ai_daily_quota (
  quota_key TEXT PRIMARY KEY,
  used INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ai_daily_quota_expiry_idx ON ai_daily_quota(expires_at);

CREATE TABLE IF NOT EXISTS ai_response_reports (
  id TEXT PRIMARY KEY,
  route TEXT NOT NULL CHECK (route IN ('local', 'cloud')),
  category TEXT NOT NULL CHECK (category IN ('unsafe', 'inaccurate', 'unhelpful', 'other')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ai_response_reports_created_idx ON ai_response_reports(created_at);
