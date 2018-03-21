const personalityRouter = require('express').Router()
const {getTweets} = require('../controllers')

personalityRouter.get('/:twitterHandle', getTweets)

module.exports = personalityRouter