FROM mdillon/postgis
COPY 1_create-multiple-postgresql-databases.sh /docker-entrypoint-initdb.d/
COPY 2_schema.sql /docker-entrypoint-initdb.d/
COPY 3_enum.sql /docker-entrypoint-initdb.d/