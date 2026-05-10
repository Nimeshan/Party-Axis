-- Run AFTER the person registers an account on PartyAxis.
-- Replace the email addresses before running.

UPDATE users SET role='admin' WHERE email='your-email@example.com';
UPDATE users SET role='moderator' WHERE email='moderator@example.com';
