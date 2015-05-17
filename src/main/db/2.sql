SELECT * FROM messages
WHERE user_id = (SELECT id FROM users WHERE name = 'anton');