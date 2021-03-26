const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const login = require('./routes/login')

app.use('/login', login)

const port = process.env.PORT
app.listen(port, () => {
    console.log('listening on port:', port)
})