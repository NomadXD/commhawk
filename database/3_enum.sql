
\c gov_auth;

INSERT INTO Institute_type values ('Police Station',1);
INSERT INTO Institute_type values ('Hospital',2);
INSERT INTO Institute_type values ('Weather Center',3);
INSERT INTO Institute_type values ('Fire Station',4);
INSERT INTO Institute_type values ('Provincial Council',5);
INSERT INTO Institute_type values ('Social Service Office',6);
INSERT INTO Institute_type values ('Police HQ',7);
INSERT INTO Institute_type values ('Hospital HQ',8);
INSERT INTO Institute_type values ('Firestation HQ',9);

INSERT INTO Province values ('Western Province','WP');
INSERT INTO Province values ('North Central Province','NC');
INSERT INTO Province values ('North Western Province','NW');
INSERT INTO Province values ('Central Province','CP');
INSERT INTO Province values ('Southern Province','SP');
INSERT INTO Province values ('Eastern Province','EP');
INSERT INTO Province values ('Nothern Province','NP');
INSERT INTO Province values ('Uwa Province','UP');
INSERT INTO Province values ('Sabaragamuwa Province','SG');

insert into institute_status values ('Unverified',1);
insert into institute_status values ('Verified',2);

insert into hospital_category values ('Provincial General Hospital',1);
insert into hospital_category values ('District General Hospital',2);
insert into hospital_category values ('Base Hospital',3);
insert into hospital_category values ('Teaching Hospital',4);
insert into hospital_category values ('Special Category',5);

insert into Police_station_category values ('District Level','A');
insert into Police_station_category values ('City Level','B');
insert into Police_station_category values ('Sub-urb Level','C');
