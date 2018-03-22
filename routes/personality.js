const personalityRouter = require('express').Router()
const {getTweets} = require('../controllers')

//personalityRouter.get('/:twitterHandle', getTweets)

personalityRouter.get('/', getTweets)

module.exports = personalityRouter