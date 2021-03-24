var { pgClient } = require('../db/index.js');

const userData = app => {
  //retrieve user name from id
  app.post('/api/user', (req, response) => {

    let text = `SELECT user_name, user_role FROM users WHERE user_id = '${parseInt(req.body.user_id)}';`
    pgClient.query(text)
    .then(dbResponse => {
      response.status(200).json(JSON.stringify(dbResponse.rows[0]))
    })
    .catch(e => {
      response.status(200).send({ ok: false });
      console.error(e.stack)
    })
    // response.json(req.body.user_id)
  })

}

exports.userData = userData;