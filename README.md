Run the server:
node server/server.js

Run local mysql:

local: mysql.server start

MySQL:
1. create-tables.sql
2. Tables >> Tables data import wizard > tilaukset.csv
3. alter-tilaukset-table.sql
4. insert-into-sql

Usage:
1. Insert user by sql insert (insert-into.sql)
2. Login using rest endpoint http://localhost:3000/users/login 
{
    "username": "Tester",
	"password": "admin"
}
3. Update password PATCH http://localhost:3000/users/:id/password-changed
{
    "newPassword": "XXX"
}
4. Start creating user by POST http://localhost:3000/users