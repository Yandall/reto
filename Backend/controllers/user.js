const pg = require('../services/pg')

async function getAllUsers(req, res) {
    let connection = new pg()
    let sql = `SELECT name, lastname, email, role, type_id, id, phone FROM users`
    await connection.sql(sql)
    .then(bd_res => {
        res.status(200).send({ok: true, data: bd_res.rows})
    }).catch(err => {
        res.status(500).send({ok: false, message: "There was an error fetching users"})
        console.log(err)
    })
}

module.exports = {getAllUsers}