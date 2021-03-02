#!/bin/sh

# verbose
# set -x

printf '===Loading Schema===\n'

psql -U sprouts_admin -d sproutsdb -W << EOF
  CREATE TABLE users (
    user_id serial PRIMARY KEY,
    user_name VARCHAR (240) NOT NULL,
    user_role TEXT CHECK (user_role IN ('student', 'teacher', 'parent')),
    created_at TIMESTAMP default current_timestamp NOT NULL,
    last_login TIMESTAMP
  );

  CREATE TABLE students (
    user_id serial PRIMARY KEY, 
    val_responsibility JSONB
  );

  CREATE TABLE adults (
    user_id serial PRIMARY KEY,
    dependents JSONB
  );

  CREATE OR REPLACE FUNCTION add_to_table() RETURNS trigger AS \$\$
    BEGIN 
      IF (TG_OP = 'INSERT') THEN 
        IF (NEW.user_role = 'student') THEN
          INSERT INTO students (user_id)
          VALUES (NEW.user_id);
        ELSIF (NEW.user_role = 'parent' OR NEW.user_role ='teacher') THEN
          INSERT INTO adults (user_id)
          VALUES (NEW.user_id);
        END IF;
      ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.user_role = 'student') THEN
          DELETE FROM students WHERE user_id = OLD.user_id;
        ELSIF (NEW.user_role = 'parent' OR NEW.user_role ='teacher') THEN
          DELETE FROM adults WHERE user_id = OLD.user_id;
        END IF;
      END IF;
      RETURN NULL;
    END;
  \$\$ LANGUAGE 'plpgsql';


  CREATE TRIGGER add_user_data 
    AFTER INSERT OR DELETE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE add_to_table(); 


EOF

printf '===Schema Loaded===\n\n'

echo '===End of script===\n'