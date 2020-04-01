DROP TABLE IF EXISTS UserDetail cascade;
DROP TABLE IF EXISTS UserCredential cascade;
DROP DOMAIN IF EXISTS UUID4 cascade;


/*
      _                       _           
     | |                     (_)          
   __| | ___  _ __ ___   __ _ _ _ __  ___ 
  / _` |/ _ \| '_ ` _ \ / _` | | '_ \/ __|
 | (_| | (_) | | | | | | (_| | | | | \__ \
  \__,_|\___/|_| |_| |_|\__,_|_|_| |_|___/
*/

CREATE DOMAIN UUID4 AS CHAR(36) CHECK(
    VALUE ~ '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
);


/* 
  _        _     _           
 | |      | |   | |          
 | |_ __ _| |__ | | ___  ___ 
 | __/ _` | '_ \| |/ _ \/ __|
 | || (_| | |_) | |  __/\__ \
  \__\__,_|_.__/|_|\___||___/
 */


CREATE TABLE UserDetail (
    user_id uuid4 primary key,
    nic varchar(15) UNIQUE,
    first_name varchar(63) not null,
    last_name varchar(63) not null,
    dob date not null,
    addr_line_1 varchar(127) not null,
    addr_line_2 varchar(127) not null,
    city varchar(63) not null,
    email varchar(127) not null,
    telephone_number varchar(31) not null
);

CREATE TABLE UserCredential (
    user_id uuid4,
    password char(60) not null,
    primary key(user_id),
    foreign key (user_id) references UserDetail(user_id)
);