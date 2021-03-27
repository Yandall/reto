const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

const login = require('./routes/login')
const users = require('./routes/users')

app.use('/login', login)
app.use('/users', users)

const port = process.env.PORT
app.listen(port, () => {
    console.log('listening on port:', port)
})