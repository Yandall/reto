const pg = require('../services/pg')
const jwt = require('jsonwebtoken')

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

async function updateUser(req, res) {
    let token = req.headers['token']
    let role = jwt.decode(token).role
    if (role != 'Admin') {
        res.status(401).send({ok: false, message:"You are not authorized to update"})
        return
    }
    let user = req.body
    console.log(user)
    let connection = new pg()
    let sql = `UPDATE users SET name=$1, lastname=$2, type_id=$3, id=$4, phone=$5, role=$6 WHERE email=$7`
    let params = [user.name, user.lastname, user.type_id, user.id, user.phone, user.role, user.email]
    await connection.sql(sql, params)
    .then(bd_res => {
        res.status(200).send({ok: true, message:"User updated successfully"})
    }).catch(err => {
        res.status(500).send({ok: false, message:"User could not be updated"})
        console.log(err)
    })
}

async function deleteUser(req, res) {
    let token = req.headers['token']
    let role = jwt.decode(token).role
    if (role != 'Admin') {
        res.status(401).send({ok: false, message:"You are not authorized to delete"})
        return
    }
    let connection = new pg()
    let sql = "DELETE FROM users WHERE email=$1"
    let params = [req.body.email]
    await connection.sql(sql, params)
    .then(bd_res => {
        res.status(200).send({ok: true, message:"User deleted successfully"})
    }).catch(err => {
        res.status(500).send({ok: false, message:"User could not be deleted"})
        console.log(err)
    })
}

module.exports = {getAllUsers, updateUser, deleteUser}