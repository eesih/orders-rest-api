INSERT INTO kuriirikeskus.user_roles (id, role_name) VALUES (1, 'Admin');
INSERT INTO kuriirikeskus.user_roles (id, role_name) VALUES (2, 'Ajojärjestelijä');
INSERT INTO kuriirikeskus.user_roles (id, role_name) VALUES (3, 'Kuljettaja');

//password admin
INSERT INTO `users` (`id`,`username`,`password`,`email`,`phone`,`first_name`,`last_name`,`address`,`postalcode`,`city`,`user_role_id`,`createdAt`,`updatedAt`, `needPasswordChange`) 
VALUES (NULL,'Test','$2a$10$bWMUCWf4hcfC.gQhfL.7cOcthYTOtVIHHOpU2iAFJTs/fgZ.LO0Oa','test@email.fi', '0501234567', 'Tester', 'Testing', 'New York'
,'22222', 'New York', 1, current_timestamp(), current_timestamp(), true); 

 
