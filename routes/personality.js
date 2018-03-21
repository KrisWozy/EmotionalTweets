const personalityRouter = require('express').Router()
const analysePersonality = require('../controllers')

personalityRouter.post('/', analysePersonality)

module.exports = personalityRouter