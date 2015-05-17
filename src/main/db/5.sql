(SELECT  users.name, count(messages.text) FROM messages

left join users
on users.id =messages.user_id
group by users.name)