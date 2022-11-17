const db = require('../db/connection');

exports.checkUserExists = (user) => {
return db.query(
    `SELECT * FROM users WHERE username = $1;`,[user]

).then((res) => {
    if (res.rows.length === 0){
        return Promise.reject({status: 404, msg: 'Author does not exist'})
    }
})
};

