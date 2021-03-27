const express = require("express")
const router = express.Router()
const _controller = require('../controllers/user')
const authentication = require('../controllers/authentication')

router.get('/', authentication.authenticateToken,_controller.getAllUsers) 

module.exports = router