
\c gov_auth;

# INSTITUTE_TYPES

INSERT INTO Institute_type values ('Police Station',1);
INSERT INTO Institute_type values ('Hospital',2);
INSERT INTO Institute_type values ('Weather Center',3);
INSERT INTO Institute_type values ('Fire Station',4);
INSERT INTO Institute_type values ('Provincial Council',5);
INSERT INTO Institute_type values ('Social Service Office',6);
INSERT INTO Institute_type values ('Police HQ',7);
INSERT INTO Institute_type values ('Hospital HQ',8);
INSERT INTO Institute_type values ('Firestation HQ',9);

# PROVINCES

INSERT INTO Province values ('Western Province','WP');
INSERT INTO Province values ('North Central Province','NC');
INSERT INTO Province values ('North Western Province','NW');
INSERT INTO Province values ('Central Province','CP');
INSERT INTO Province values ('Southern Province','SP');
INSERT INTO Province values ('Eastern Province','EP');
INSERT INTO Province values ('Nothern Province','NP');
INSERT INTO Province values ('Uwa Province','UP');
INSERT INTO Province values ('Sabaragamuwa Province','SG');

# INSTITUTE_STATUS

insert into institute_status values ('Unverified',1);
insert into institute_status values ('Verified',2);

# HOSPITAL_CATEGORY

insert into hospital_category values ('Provincial General Hospital',1);
insert into hospital_category values ('District General Hospital',2);
insert into hospital_category values ('Base Hospital',3);
insert into hospital_category values ('Teaching Hospital',4);
insert into hospital_category values ('Special Category',5);

# POLICE STATION CATEGORY

insert into Police_station_category values ('District Level','A');
insert into Police_station_category values ('City Level','B');
insert into Police_station_category values ('Sub-urb Level','C');

# ADMIN ACCOUNTS

CALL createGovInstitute('b13b39b0-ef43-4df8-932f-6a1a79e1109d',7,'Police Headquarters','Colombo 07','Colombo','Colombo','WP',ST_SetSRID(ST_MakePoint(79.857203,6.933276),4326),'policehq@gov.lk','0112 694 999','0112 694 999','$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q');
CALL createGovInstitute('ade39ee6-ed99-4002-a655-35308d460f97',8,'Hospital Headquarters','Colombo 07','Colombo','Colombo','WP',ST_SetSRID(ST_MakePoint(79.865105,6.920291),4326),'hospitalhq@gov.lk','0112 456 999','0112 456 999','$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q');
CALL createGovInstitute('2db8c542-18c8-465a-8d74-46e8338f4e43',9,'Firestation Headquarters','Colombo 07','Colombo','Colombo','WP',ST_SetSRID(ST_MakePoint(79.857405,6.933222),4326),'firehq@gov.lk','0112 674 999','0112 674 999','$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q');

# SOCIAL SERVICE AND WEATHER CENTER

CALL createGovInstitute('f274bdd4-8213-4b23-8fcb-994af0cd094d',3,'Meteorology Department,Baudhdhaloka mawatha ','Colombo 07','Colombo','Colombo','WP',ST_SetSRID(ST_MakePoint(79.872603,6.905347),4326),'meteorology@gov.lk','0112 694 846','0112 694 846','$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q');
CALL createGovInstitute('b17db592-6c65-4ec7-b5bc-e1b2483eeacf',6,'Social service department','Colombo 07','Colombo','Colombo','WP',ST_SetSRID(ST_MakePoint(79.874783,6.903048),4326),'social@gov.lk','0112 694 999','0112 694 999','$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q');

#UPDATING STATUS OF HQs , SOCIAL SERVICE AND WEATHER

# UNCOMMENT AFTER ADMIN CREATION

/* UPDATE government_institute SET institute_status = 2 where institute_id = 'b13b39b0-ef43-4df8-932f-6a1a79e1109d';
UPDATE government_institute SET institute_status = 2 where institute_id = 'ade39ee6-ed99-4002-a655-35308d460f97';
UPDATE government_institute SET institute_status = 2 where institute_id = '2db8c542-18c8-465a-8d74-46e8338f4e43';
UPDATE government_institute SET institute_status = 2 where institute_id = 'f274bdd4-8213-4b23-8fcb-994af0cd094d';
UPDATE government_institute SET institute_status = 2 where institute_id = 'b17db592-6c65-4ec7-b5bc-e1b2483eeacf'; */