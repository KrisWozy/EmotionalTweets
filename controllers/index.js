const PersonalityInsights = require('watson-developer-cloud/personality-insights/v3')
const {personalityConfig, twitterKeys} = require('../config')
const username = personalityConfig.username
const password = personalityConfig.password
const Twit = require('twit')

const pi = new PersonalityInsights({
    username,
    password,
    version_date: '2017-12-12'
})

const T = new Twit({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    app_only_auth: true
})

function analysePersonality(req, res, next) {
    const { content } = req.body;
    pi.profile({
        content,
        content_type: 'text/plain'
    }, (err, insight) => {
        res.send({insight})
    })
}

module.exports = analysePersonality