-- PartyAxis complete MySQL schema for Hostinger/phpMyAdmin
-- Use this for a NEW empty database.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user',
  terms_accepted TINYINT(1) NOT NULL DEFAULT 0,
  privacy_accepted TINYINT(1) NOT NULL DEFAULT 0,
  rules_accepted TINYINT(1) NOT NULL DEFAULT 0,
  age_21_plus TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_at DATETIME NOT NULL,
  city VARCHAR(120) NOT NULL DEFAULT 'Singapore',
  location_name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  visibility ENUM('public', 'invite_only') NOT NULL DEFAULT 'public',
  image_url VARCHAR(500) NULL,
  status ENUM('draft', 'pending_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending_review',
  is_highlight TINYINT(1) NOT NULL DEFAULT 0,
  rejection_reason VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_events_status_start (status, start_at),
  KEY idx_events_user (user_id),
  KEY idx_events_highlight (is_highlight),
  CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  source VARCHAR(120) NULL,
  marketing_consent TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_newsletter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS moderation_actions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id INT UNSIGNED NULL,
  admin_user_id INT UNSIGNED NOT NULL,
  action ENUM('approve', 'reject', 'highlight_on', 'highlight_off', 'delete_event', 'role_change', 'request_changes') NOT NULL,
  note VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mod_event (event_id),
  KEY idx_mod_admin (admin_user_id),
  CONSTRAINT fk_mod_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  CONSTRAINT fk_mod_admin FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- After your first account registers, make yourself admin:
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

-- To make another account moderator:
-- UPDATE users SET role = 'moderator' WHERE email = 'moderator@example.com';
