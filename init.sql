
--
-- Table structure for table `todolist`
--

CREATE TABLE `todolist` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `checked` tinyint(1) NOT NULL,
  `date` varchar(10) NOT NULL,
   primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8md4;
