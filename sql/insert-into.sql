INSERT INTO kuriirikeskus.user_roles (role_name) VALUES ('Admin');
INSERT INTO kuriirikeskus.user_roles (role_name) VALUES ('Ajojärjestelijä');
INSERT INTO kuriirikeskus.user_roles (role_name) VALUES ('Kuljettaja');

INSERT INTO kuriirikeskus.users 
(
`username`,
`email`,
`password`,
`phone`,
`postalcode`,
`updatedAt`,
`createdAt`,
`user_role_id`)
VALUES
('admin', 
'keni@vuokrakuski.fi', 
'passu', 
'0505328172',
 '02500', 
current_timestamp(), 
current_timestamp(), 
4);