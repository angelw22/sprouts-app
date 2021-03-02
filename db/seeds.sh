#!/bin/sh

# verbose
# set -x

printf '===Seeding Data: Users===\n'

psql -U sprouts_admin -d sproutsdb << EOF
  INSERT INTO users (user_id, user_name, user_role) 
    VALUES 
      ('123', 'john doe', 'teacher'),
      ('321', 'sarah lee', 'parent'),
      ('456', 'ryan tan', 'student'),
      ('789', 'valerie lim', 'student');
EOF

printf '===Seeded Data: Users===\n\n'

echo '===End of script==='