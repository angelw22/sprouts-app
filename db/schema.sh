#!/bin/sh

# verbose
# set -x

printf '===Loading Schema===\n'

psql -U sprouts_admin -d sproutsdb -W << EOF
  CREATE TABLE users (
    username VARCHAR (240) PRIMARY KEY,
    name VARCHAR (240) NOT NULL,
    role TEXT CHECK (role IN ('student', 'teacher', 'parent')),
    created_at TIMESTAMP default current_timestamp NOT NULL,
    last_login TIMESTAMP
  );

  CREATE TABLE students (
    username VARCHAR (240) PRIMARY KEY, 
    val_responsibility JSONB
  );

  CREATE TABLE adults (
    username VARCHAR (240) PRIMARY KEY,
    dependents JSONB
  );

  CREATE OR REPLACE FUNCTION add_to_table() RETURNS trigger AS \$\$
    BEGIN 
      IF (TG_OP = 'INSERT') THEN 
        IF (NEW.role = 'student') THEN
          INSERT INTO students (username)
          VALUES (NEW.username);
        ELSIF (NEW.role = 'parent' OR NEW.role ='teacher') THEN
          INSERT INTO adults (username)
          VALUES (NEW.username);
        END IF;
      ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.role = 'student') THEN
          DELETE FROM students WHERE username = OLD.username;
        ELSIF (NEW.role = 'parent' OR NEW.role ='teacher') THEN
          DELETE FROM adults WHERE username = OLD.username;
        END IF;
      END IF;
      RETURN NULL;
    END;
  \$\$ LANGUAGE 'plpgsql';


  CREATE TRIGGER add_data 
    AFTER INSERT OR DELETE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE add_to_table(); 


EOF

printf '===Schema Loaded===\n\n'

echo '===End of script===\n'