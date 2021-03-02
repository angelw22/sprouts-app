#!/bin/sh

# verbose
# set -x

printf '===Reset DB===\n'

psql -U sprouts_admin -d sproutsdb -W << EOF
  DROP TRIGGER add_user_data ON users;
  DROP FUNCTION add_to_table();
  DROP TABLE users;
  DROP TABLE students;
  DROP TABLE adults;
EOF

printf '===DB Reset===\n'
