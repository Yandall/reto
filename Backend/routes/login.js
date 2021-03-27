const express = require("express")
const router = express.Router()
const _controller = require('../controllers/authentication')


router.post('/register', _controller.registerUser)
router.get('/', _controller.login) 

module.exports = router