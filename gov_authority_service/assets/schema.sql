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

CREATE TABLE Institute_type(
    institute_category varchar(15),
    institute_type int not null,
    primary key(institute_category)
);

CREATE TABLE Province(
    province_name varchar(31),
    province_code varchar(7) not null,
    primary key(province_name)
);


CREATE TABLE Governemnt_Institute(
    institute_id uuid4,
    institute_type int not null,
    primary key(institute_id),
    foreign key (institute_type) references Institute_type(institute_type) on delete cascade
);

CREATE TABLE Institute_Location(
    institute_id uuid4,
    addr_line_1 varchar(127) not null,
    addr_line_2 varchar(127) not null,
    city varchar(31) not null,
    district varchar(31) not null,
    province varchar(7) not null,
    location GEOGRAPHY(POINT,4326) not null,
    primary key(institute_id),
    foreign key (institute_id) references Governemnt_Institute(institute_id) on delete cascade,
    foreign key (province) references Province(province_code) on delete cascade 
);

CREATE TABLE Institute_Contact_Info(
    institute_id uuid4,
    email varchar(64) not null,
    phone_number varchar(15) not null,
    fax varchar(15),
    primary key (institute_id)
);

CREATE TABLE Institute_credentials(
    institute_id uuid4,
    password char(60) not null,
    primary key(institute_id)
);

CREATE TABLE Hospital(
    institute_id uuid4,
    icu_beds int,
    doctors int,
    ambulances int,
    capacity int,
    primary key (institute_id),
    foreign key (institute_id) references Governemnt_Institute(institute_id) on delete cascade
);

CREATE TABLE Police(
    institute_id uuid4,
    motor_vehicles int,
    motor_biycles int,
    officers int,
    weapons int,
    cells int,
    primary key(institute_id),
    foreign key (institute_id) references Governemnt_Institute(institute_id) on delete cascade
);

CREATE TABLE WeatherCenter(
    institute_id uuid4,
    humidity varchar(15),
    temperature varchar(15),
    wind_speed varchar(15),
    primary key(institute_id),
    foreign key (institute_id) references Governemnt_Institute(institute_id) on delete cascade
);

CREATE TABLE FireStation(
    institute_id uuid4,
    fire_trucks int,
    fire_fighters int
    primary key(institute_id),
    foreign key (institute_id) references Governemnt_Institute(institute_id) on delete cascade
);


/*
                               _                     
                              | |                    
  _ __  _ __ ___   ___ ___  __| |_   _ _ __ ___  ___ 
 | '_ \| '__/ _ \ / __/ _ \/ _` | | | | '__/ _ \/ __|
 | |_) | | | (_) | (_|  __/ (_| | |_| | | |  __/\__ \
 | .__/|_|  \___/ \___\___|\__,_|\__,_|_|  \___||___/
 | |                                                 
 |_|                                                 
*/

CREATE OR REPLACE PROCEDURE createGovInstitute(UUID4, INT, VARCHAR(127), VARCHAR(127),
										VARCHAR(31), VARCHAR(31), VARCHAR(7), GEOGRAPHY(POINT,4326),
                                        VARCHAR(64), VARCHAR(15), VARCHAR(15),CHAR(60))
LANGUAGE plpgsql    
AS $$
DECLARE
BEGIN
  INSERT INTO Governemnt_Institute values ($1, $2); 
  INSERT INTO Institute_Location values ($1, $3, $4, $5, $6, $7, $8);
  INSERT INTO Institute_Contact_Info values ($1, $9, $10, $11);
  INSERT INTO Institute_credentials values ($1, $12);
END;
$$;




