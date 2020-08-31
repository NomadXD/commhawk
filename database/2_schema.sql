\c user_data;

DROP TABLE IF EXISTS UserDetail cascade;
DROP TABLE IF EXISTS UserCredential cascade;
DROP DOMAIN IF EXISTS UUID4 cascade;
DROP PROCEDURE IF EXISTS createUser cascade;


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
    foreign key (user_id) references UserDetail(user_id) on delete cascade
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


CREATE OR REPLACE PROCEDURE createUser(UUID4, VARCHAR(15), VARCHAR(63), VARCHAR(63),
										DATE, VARCHAR(127), VARCHAR(127), VARCHAR(63),
									   VARCHAR(127), VARCHAR(31),CHAR(60))
LANGUAGE plpgsql    
AS $$
DECLARE
BEGIN
  INSERT INTO UserDetail values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10); 
  INSERT INTO UserCredential values ($1, $11);
END;
$$;


\c gov_auth;

CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

DROP TABLE IF EXISTS Government_Institute cascade;
DROP TABLE IF EXISTS Province cascade;
DROP TABLE IF EXISTS Institute_Status;
DROP TABLE IF EXISTS Institute_type;
DROP TABLE IF EXISTS Hospital_category;
DROP TABLE IF EXISTS Police_station_category;
DROP DOMAIN IF EXISTS UUID4 cascade;
DROP PROCEDURE IF EXISTS createGovInstitute cascade;

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
    institute_category_name varchar(31),
    institute_type int not null UNIQUE,
    primary key(institute_category_name)
);

CREATE TABLE Province(
    province_name varchar(31),
    province_code varchar(7) not null UNIQUE,
    primary key(province_name)
);


CREATE TABLE Institute_Status(
    institute_status varchar(31),
    institute_status_code int not null UNIQUE,
    primary key(institute_status)
);

CREATE TABLE Hospital_category(
    hospital_category varchar(63),
    hospital_category_code int not null UNIQUE,
    primary key (hospital_category)
);

CREATE TABLE Police_station_category(
    station_category varchar(63),
    station_category_id varchar(7) not null UNIQUE,
    primary key (station_category)
);


CREATE TABLE Government_Institute(
    institute_id uuid4,
    institute_type int not null,
    institute_status int not null,
    primary key(institute_id),
    foreign key (institute_type) references Institute_type(institute_type) on delete cascade,
    foreign key (institute_status) references Institute_Status(institute_status_code) on delete cascade
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
    foreign key (institute_id) references Government_Institute(institute_id) on delete cascade,
    foreign key (province) references Province(province_code) on delete cascade
);

CREATE TABLE Institute_Contact_Info(
    institute_id uuid4,
    email varchar(63) not null,
    phone_number varchar(15) not null,
    fax varchar(15),
    primary key (institute_id),
    foreign key (institute_id) references Government_Institute(institute_id)
);

CREATE TABLE Institute_credentials(
    institute_id uuid4,
    password char(60) not null,
    primary key(institute_id),
    foreign key (institute_id) references Government_Institute(institute_id)
);

CREATE TABLE Hospital(
    institute_id uuid4,
    hospital_category int not null,
    icu_beds int not null,
    doctors int not null,
    ambulances int not null,
    capacity int not null,
    primary key (institute_id),
    UNIQUE(hospital_category,city),
    foreign key (institute_id) references Government_Institute(institute_id) on delete cascade,
    foreign key (hospital_category) references Hospital_category(hospital_category_code) on delete cascade
) INHERITS (Institute_Location);

CREATE TABLE Police(
    institute_id uuid4,
    station_category varchar(7) not null,
    motor_vehicles int not null,
    motor_biycles int not null,
    officers int not null,
    weapons int not null,
    cells int not null,
    primary key(institute_id),
    UNIQUE(city),
    foreign key (institute_id) references Government_Institute(institute_id) on delete cascade,
    foreign key (station_category) references Police_station_category(station_category_id) on delete cascade
) INHERITS (Institute_Location);

CREATE TABLE WeatherCenter(
    institute_id uuid4,
    humidity varchar(15),
    temperature varchar(15),
    wind_speed varchar(15),
    primary key(institute_id),
    foreign key (institute_id) references Government_Institute(institute_id) on delete cascade
);

CREATE TABLE FireStation(
    institute_id uuid4,
    fire_trucks int,
    fire_fighters int,
    primary key (institute_id),
    UNIQUE(city),
    foreign key (institute_id) references Government_Institute(institute_id) on delete cascade
) INHERITS (Institute_Location);


create table report(
	report_id uuid4,
	title varchar(255) not null,
	description text not null,
	date timestamp not null,
	province varchar(7) not null,
	primary key (report_id),
	foreign key (province) references province(province_code) on delete cascade
);

create table report_category(
	report_id uuid4,
	category int not null,
	foreign key (category) references institute_type(institute_type) on delete cascade,
	foreign key (report_id) references report(report_id) on delete cascade
);


create table report_token(
	report_id uuid4,
	token varchar(31) not null,
	foreign key (report_id) references report(report_id) on delete cascade
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
                                        VARCHAR(63), VARCHAR(15), VARCHAR(15),CHAR(60))
LANGUAGE plpgsql    
AS $$
DECLARE
BEGIN
    -- common for all the institutes
  INSERT INTO Government_Institute values ($1, $2,1); 
  INSERT INTO Institute_Location values ($1, $3, $4, $5, $6, $7, $8);
  INSERT INTO Institute_Contact_Info values ($1, $9, $10, $11);
  INSERT INTO Institute_credentials values ($1, $12);
END;
$$;


CREATE OR REPLACE PROCEDURE createPoliceStation(UUID4, INT, VARCHAR(127), VARCHAR(127),
										VARCHAR(31), VARCHAR(31), VARCHAR(7), GEOGRAPHY(POINT,4326),
                                        VARCHAR(63), VARCHAR(15), VARCHAR(15),CHAR(60),VARCHAR(7),INT,
                                        INT, INT, INT, INT)
LANGUAGE plpgsql    
AS $$
DECLARE
BEGIN
    -- common for all the institutes
  INSERT INTO Government_Institute values ($1, $2,1); 
  --INSERT INTO Institute_Location values ($1, $3, $4, $5, $6, $7, $8);
  INSERT INTO Institute_Contact_Info values ($1, $9, $10, $11);
  INSERT INTO Institute_credentials values ($1, $12);
    -- police station specific data
  INSERT INTO Police values ($1, $3, $4, $5, $6, $7, $8, $13, $14, $15, $16, $17, $18); 
END;
$$;


CREATE OR REPLACE PROCEDURE createHospital(UUID4, INT, VARCHAR(127), VARCHAR(127),
										VARCHAR(31), VARCHAR(31), VARCHAR(7), GEOGRAPHY(POINT,4326),
                                        VARCHAR(63), VARCHAR(15), VARCHAR(15),CHAR(60), INT,
                                        INT, INT, INT, INT)
LANGUAGE plpgsql    
AS $$
DECLARE
BEGIN
    -- common for all the institutes
  INSERT INTO Government_Institute values ($1, $2,1); 
  --INSERT INTO Institute_Location values ($1, $3, $4, $5, $6, $7, $8);
  INSERT INTO Institute_Contact_Info values ($1, $9, $10, $11);
  INSERT INTO Institute_credentials values ($1, $12);
    -- hospital specific data
  INSERT INTO Hospital values ($1, $3, $4, $5, $6, $7, $8, $13, $14, $15, $16, $17); 
END;
$$;


CREATE OR REPLACE PROCEDURE createFireStation(UUID4, INT, VARCHAR(127), VARCHAR(127),
										VARCHAR(31), VARCHAR(31), VARCHAR(7), GEOGRAPHY(POINT,4326),
                                        VARCHAR(63), VARCHAR(15), VARCHAR(15),CHAR(60), INT,
                                        INT)
LANGUAGE plpgsql    
AS $$
DECLARE
BEGIN
    -- common for all the institutes
  INSERT INTO Government_Institute values ($1, $2,1); 
  --INSERT INTO Institute_Location values ($1, $3, $4, $5, $6, $7, $8);
  INSERT INTO Institute_Contact_Info values ($1, $9, $10, $11);
  INSERT INTO Institute_credentials values ($1, $12);
    -- firestation specific data
  INSERT INTO FireStation values ($1, $3, $4, $5, $6, $7, $8, $13, $14); 
END;
$$;




CREATE OR REPLACE FUNCTION getHospital(lng NUMERIC,lat NUMERIC) 
	RETURNS TABLE(
	institute_id UUID4,
	city varchar(31),
	hospital_type varchar(63)
	) AS $$ 
DECLARE
   given_point GEOGRAPHY := ST_SetSRID(ST_MakePoint($1,$2),4326);
   initial_radius INT := 30000;
   result UUID4 := null;
   data RECORD := null;
BEGIN	
	LOOP 
		EXIT WHEN result is not null;  
		result := (SELECT hospital.institute_id
    			FROM hospital,government_institute   
    			WHERE ST_DWithin(hospital.location,given_point,initial_radius) AND
				  hospital.institute_id = government_institute.institute_id AND
				  government_institute.institute_status = 2
    			ORDER BY ST_Distance(hospital.location,given_point) 
    			LIMIT 1);
		initial_radius := initial_radius + 10000 ;
	END LOOP ; 
	
	RETURN QUERY SELECT 
		hospital.institute_id,
		hospital.city,
		hospital_category.hospital_category
	FROM 
		hospital,
		hospital_category
	WHERE 
		hospital.institute_id = result and
		hospital.hospital_category = hospital_category.hospital_category_code
	;
END ; 
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION getPoliceStation(lng NUMERIC,lat NUMERIC) 
	RETURNS TABLE(
	institute_id UUID4,
	city varchar(31)
	) AS $$ 
DECLARE
   given_point GEOGRAPHY := ST_SetSRID(ST_MakePoint($1,$2),4326);
   initial_radius INT := 20000;
   result UUID4 := null;
   data RECORD := null;
BEGIN	
	LOOP 
		EXIT WHEN result is not null;  
		result := (SELECT police.institute_id
    			FROM police, government_institute
    			WHERE ST_DWithin(police.location,given_point,initial_radius) AND
          government_institute.institute_id = police.institute_id AND
          government_institute.institute_status = 2
    			ORDER BY ST_Distance(police.location,given_point) 
    			LIMIT 1);
		initial_radius := initial_radius + 10000 ;
	END LOOP ; 
	
	RETURN QUERY SELECT 
		police.institute_id,
		police.city
	FROM 
		police
	WHERE 
		police.institute_id = result
	;
END ; 
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION getFireStation(lng NUMERIC,lat NUMERIC) 
	RETURNS TABLE(
	institute_id UUID4,
	city varchar(31)
	) AS $$ 
DECLARE
   given_point GEOGRAPHY := ST_SetSRID(ST_MakePoint($1,$2),4326);
   initial_radius INT := 40000;
   result UUID4 := null;
   data RECORD := null;
BEGIN	
	LOOP 
		EXIT WHEN result is not null;  
		result := (SELECT firestation.institute_id
    			FROM firestation,government_institute   
    			WHERE ST_DWithin(firestation.location,given_point,initial_radius) AND
				firestation.institute_id = government_institute.institute_id AND
				government_institute.institute_status = 2
    			ORDER BY ST_Distance(firestation.location,given_point) 
    			LIMIT 1);
		initial_radius := initial_radius + 10000 ;
	END LOOP ; 
	
	RETURN QUERY SELECT 
		firestation.institute_id,
		firestation.city
	FROM 
		firestation
	WHERE 
		firestation.institute_id = result
	;
END ; 
$$ LANGUAGE plpgsql;



create or replace procedure saveReport(int[],varchar[],UUID4,varchar(255),text,varchar(7)) 
LANGUAGE plpgsql    
AS $$
DECLARE
	categories ALIAS for $1;
	tokens ALIAS for $2;
	report_id ALIAS for $3;
	title ALIAS for $4;
	description ALIAS for $5;
	province ALIAS for $6;
BEGIN
	INSERT into report values (report_id, title, description, NOW(), province);
	FOR I IN array_lower(categories, 1)..array_upper(categories, 1)
	LOOP
		INSERT INTO report_category VALUES(report_id,categories[I]);		
	END LOOP;
	FOR I IN array_lower(tokens, 1)..array_upper(tokens, 1)
	LOOP
		INSERT INTO report_token VALUES(report_id,tokens[I]);		
	END LOOP;
	
END;
$$;