USE chat;
SELECT name FROM (SELECT  users.name, count(messages.text) AS count FROM messages
LEFT JOIN users
ON users.id =messages.user_id
GROUP BY users.name)AS newTable WHERE count>3;
