Run the server:
node index.js

Docker mysql
docker run -d -p 3306:3306 -e MYSQL_USER=kuriiri -e MYSQL_PASSWORD=vuokrakuski -e MYSQL_DATABASE=kuriirikeskus mysql/mysql-server

MySQL:
1. create-tables.sql
2. Tables >> Tables data import wizard > tilaukset.csv
3. alter-tilaukset-table.sql
4. insert-into-sql
