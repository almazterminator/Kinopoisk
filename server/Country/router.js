const express = require('express')
const router = express.Router()
const writeDataCountry = require('./seed')
const {GetAllCountries} = require('./controller')
router.get('/api/country', GetAllCountries)

writeDataCountry()
module.exports = router