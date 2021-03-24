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

  UPDATE students 
  SET val_responsibility = 
  '[
    { 
      "img_key": "456/responsibility/0.jpg", 
      "text": "Look this person is so responsible watering plants"
    }, 
    {
      "img_key": "456/responsibility/1.jpg", 
      "text": "We are saving the earth!!"
    },
    {
      "img_key": "456/responsibility/2.jpg", 
      "text": "Everybody cleaning up yay"
    }
  ]' WHERE user_id = '456';

EOF

printf '===Seeded Data: Users===\n\n'

echo '===End of script==='