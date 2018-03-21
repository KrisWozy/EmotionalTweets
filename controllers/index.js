const PersonalityInsights = require('watson-developer-cloud/personality-insights/v3')
const personalityConfig = require('../config')
const username = personalityConfig.username
const password = personalityConfig.password

const pi = new PersonalityInsights({
    username,
    password,
    version_date: '2017-12-12'
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