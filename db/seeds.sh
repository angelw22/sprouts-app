#!/bin/sh

# verbose
# set -x

printf '===Seeding Data: Users===\n'

psql -U sprouts_admin -d sproutsdb << EOF
  INSERT INTO users (username, name, role) 
    VALUES 
      ('john_doe', 'john doe', 'teacher'),
      ('sarah_lee', 'sarah lee', 'parent'),
      ('ryan_tan', 'ryan tan', 'student'),
      ('valerie_lim', 'valerie lim', 'student');

  UPDATE students 
  SET val_responsibility = 
  '[
    { 
      "img_key": "ryan_tan/responsibility/0.jpg", 
      "text": "Look this person is so responsible watering plants"
    }, 
    {
      "img_key": "ryan_tan/responsibility/1.jpg", 
      "text": "We are saving the earth!!"
    },
    {
      "img_key": "ryan_tan/responsibility/2.jpg", 
      "text": "Everybody cleaning up yay"
    }
  ]' WHERE username = 'ryan_tan';

EOF

printf '===Seeded Data: Users===\n\n'

echo '===End of script==='