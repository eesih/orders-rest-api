  CREATE TABLE `tilaukset` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `time` int(16) NOT NULL,
  `tilaaja` varchar(255) NOT NULL,
  `sposti` varchar(255) NOT NULL,
  `puh` varchar(255) NOT NULL,
  `lahettaja` varchar(255) NOT NULL,
  `puh2` varchar(255) NOT NULL,
  `nouto` varchar(255) NOT NULL,
  `vastaanottaja` varchar(255) NOT NULL,
  `puh3` varchar(255) NOT NULL,
  `vienti` varchar(255) NOT NULL,
  `lisatieto` text NOT NULL,
  `lisatieto2` text NOT NULL,
  `yhthenk` varchar(255) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9474 DEFAULT CHARSET=latin1;

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `postalcode` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_role_id` (`user_role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;

CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
SELECT * FROM kuriirikeskus.user_tokens;
