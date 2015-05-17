SELECT * FROM messages
WHERE user_id = (SELECT id FROM users WHERE name = 'anton') 
AND DATE(date)='2015-05-2';