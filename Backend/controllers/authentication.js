const jwt = require('jsonwebtoken')
const pg = require('../services/pg')
require('dotenv').config()

async function login(req, res) {
    let email = req.headers['email']
    let password = req.headers['password']
    let user = {email, password}
    if (!checkLoginValidations(user)) {
        res.status(401).send({ok: false, message: "Please enter all required fields"})
        return
    }
    await getUser(user)
    .then(bd_res => {
        let userExist = bd_res.rowCount > 0
        if (!userExist) {
            res.status(401).send({ok: false, message: "There is not an existing user with that combination of email and password"})
            return
        }
        let token = generateAccessToken(bd_res.rows[0])
        res.status(200).send({ok: true, message: "Login succesfully", token})
    }).catch(err => {
        console.log(err)
        res.status(500).send({ok: false, message: "There was an error while getting the user"})
    })
}

async function registerUser(req, res) {
    let newUser = req.body
    if(!checkRegisterValidation(newUser)) {
        res.status(400).send({ok: false, message: "Please enter all required fields"}) 
        return
    }
    let connection = new pg()
    let params = [newUser.type_id, newUser.id, newUser.name, newUser.lastname, newUser.email, newUser.role, newUser.phone, newUser.password]
    let sql = `INSERT INTO users (type_id, id, name, lastname, email, role, phone, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
    await connection.sql(sql, params)
    .then(bd_res => {
        res.status(200).send({ok: true, message: "New user registered succesfully"})
    }). catch(err => {
        console.log(err)
        res.status(500).send({ok: false, message: "There was an error while trying to register new user"})
    })
}

async function getUser(user) {
    let connection = new pg()
    let params = [user.email, user.password]
    let sql = `SELECT * FROM users WHERE email = $1 AND password = $2`
    return await connection.sql(sql, params)
}


function generateAccessToken(user) {
    delete user.password
    return jwt.sign(user, process.env.SECRET_TOKEN, {expiresIn: "1800s"})
}

function authenticateToken(req, res, next) {
    const token = req.headers['token']

    if(!token) return res.status(401).send({ok: false, message: "Please login first"})
    
    jwt.verify(token, process.env.SECRET_TOKEN, (err, res) => {
        if (err) {
            console.log(err)
            res.status(401).send({
                ok: false,
                message: "Please login first"
            })
        }

        req.user = res
        next()
    })
}

function checkLoginValidations(user) {
    if (!user.email) return false
    if (!user.password) return false
    return true
}

function checkRegisterValidation(user) {
    if (!user.email) return false
    if (!user.password) return false
    if (!user.type_id) return false
    if (!user.id) return false
    if (!user.name) return false
    if (!user.lastname) return false
    if (!user.role) return false
    if (!user.phone) return false
    return true
}

module.exports = {login, registerUser, authenticateToken}