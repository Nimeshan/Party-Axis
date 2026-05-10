-- PartyAxis upgrade SQL for an EXISTING database already imported earlier.
-- Run this in Hostinger phpMyAdmin → your database → SQL.

SET NAMES utf8mb4;

-- Add moderator role support.
ALTER TABLE users
  MODIFY role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user';

-- Make sure event moderation columns exist.
ALTER TABLE events
  MODIFY status ENUM('draft', 'pending_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS is_highlight TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500) NULL;

-- Add indexes if missing. If your MySQL version complains about duplicate index names, skip those lines.
CREATE INDEX idx_events_highlight ON events (is_highlight);

-- Rebuild audit table to support highlight/delete logs and keep logs after event deletion.
CREATE TABLE IF NOT EXISTS moderation_actions_new (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id INT UNSIGNED NULL,
  admin_user_id INT UNSIGNED NOT NULL,
  action ENUM('approve', 'reject', 'highlight_on', 'highlight_off', 'delete_event', 'role_change', 'request_changes') NOT NULL,
  note VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mod_event (event_id),
  KEY idx_mod_admin (admin_user_id),
  CONSTRAINT fk_mod_event_new FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  CONSTRAINT fk_mod_admin_new FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO moderation_actions_new (id, event_id, admin_user_id, action, note, created_at)
SELECT id, event_id, admin_user_id,
       CASE
         WHEN action IN ('approve', 'reject', 'request_changes') THEN action
         ELSE 'request_changes'
       END,
       note,
       created_at
FROM moderation_actions
ON DUPLICATE KEY UPDATE note = VALUES(note);

DROP TABLE moderation_actions;
RENAME TABLE moderation_actions_new TO moderation_actions;

-- Example: make one registered user a moderator.
-- UPDATE users SET role = 'moderator' WHERE email = 'moderator@example.com';
