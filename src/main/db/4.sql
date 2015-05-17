 SELECT * FROM users
 WHERE (select(text) FROM messages
WHERE user_id = (SELECT id FROM users))>1 ;