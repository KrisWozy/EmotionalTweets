const Twit = require("twit");
const PersonalityInsights = require("watson-developer-cloud/personality-insights/v3");

if (process.env.NODE_ENV === 'production') watsonUsername = process.env.watsonUsername;
else watsonUsername = require('../config').personalityConfig.username;
if (process.env.NODE_ENV === 'production') watsonPassword = process.env.watsonPassword;
else watsonPassword = require('../config').personalityConfig.password;
if (process.env.NODE_ENV === 'production') twitKey = process.env.twitKey;
else twitKey = require('../config').twitterKeys.consumer_key;
if (process.env.NODE_ENV === 'production') twitSecretKey = process.env.twitSecretKey;
else twitSecretKey = require('../config').twitterKeys.consumer_secret;

const pi = new PersonalityInsights({
  username: watsonUsername,
  password: watsonPassword,
  version_date: "2017-12-12"
});

const T = new Twit({
  consumer_key: twitKey,
  consumer_secret: twitSecretKey,
  app_only_auth: true
});

function getTweets(req, res, next) {
    const twitterId = '@' + req.query.handle;
  T.get("statuses/user_timeline", { screen_name: `${twitterId}`, count: 1000 })
    .then(tweetData => {
      const tweetsObject = {};
      tweetsObject.content = "";
      tweetData.data.forEach((tweet, i) => {
        tweetsObject.content += tweet.text.replace(/http\S+/g, "") + " ";
      });
      return tweetsObject;
    })
    .then(tweetText => {
      analyseTweets(tweetText, req, res, next);
    })
    .catch(err => next(err));
}

function analyseTweets(tweets, res, res, next) {
    let finalAlignment;
    let finalImage;
  const { content } = tweets;
  pi.profile(
    {
      content,
      content_type: "text/plain"
    },
    (err, insight) => {
        if (err) {
            console.log(err);
            return next(err)
        }
      let lawAlignment;
      let goodAlignment;
      const lawfulTraits = insight.personality[1].children;
      const goodTraits = insight.personality[3].children;
      const needsTraits = insight.needs;
      // Get average score of Lawful
      const averageLawTrait = lawfulTraits.reduce((acc, cv) => {
        if (
          cv.name === "Cautiousness" ||
          cv.name === "Dutifulness" ||
          cv.name === "Orderliness" ||
          cv.name === "Self-discipline"
        ) {
          acc += Number(cv.percentile);
        }
        return acc;
      }, 0);
      const lawRating = (averageLawTrait / 4 * 100).toFixed(2);
      if (lawRating <= 30) lawAlignment = "Chaotic";
      if (lawRating < 60 && lawRating > 30) lawAlignment = "Neutral";
      if (lawRating >= 60) lawAlignment = "Lawful";

      // Get average score of Good/Evil
      const averageGoodTrait = goodTraits.reduce((acc, cv) => {
        if (
          cv.name === "Altruism" ||
          cv.name === "Cooperation" ||
          cv.name === "Modesty" ||
          cv.name === "Sympathy" ||
          cv.name === "Trust"
        ) {
          acc += Number(cv.percentile);
        }
        return acc;
      }, 0);

      const goodRating = (averageGoodTrait / 5 * 100).toFixed(2);

      //Get average score of Needs
      const averageNeedsTrait = needsTraits.reduce((acc, cv) => {
        if (cv.name === "Harmony" || cv.name === "Love") {
          acc += Number(cv.percentile);
        }
        return acc;
      }, 0);

      const needsRating = (averageNeedsTrait / 2 * 100).toFixed(2);

      const finalGood = (Number(goodRating) + Number(needsRating)) / 2;

      if (finalGood <= 36) goodAlignment = "evil";
      if (finalGood < 55 && finalGood > 36) goodAlignment = "neutral";
      if (finalGood >= 55) goodAlignment = "good";

      if (lawAlignment === "Neutral" && goodAlignment === "neutral") {
        finalAlignment = "True neutral";
      } else {
        finalAlignment = `${lawAlignment} ${goodAlignment}`
        
      }
      if (finalAlignment === 'Lawful good') finalImage = 'LG.gif'
      if (finalAlignment === 'Neutral good') finalImage = 'NG.gif'
      if (finalAlignment === 'Chaotic good') finalImage = 'CG.gif'
      if (finalAlignment === 'Lawful neutral') finalImage = 'LN.gif'
      if (finalAlignment === 'True neutral') finalImage = 'TN.gif'
      if (finalAlignment === 'Chaotic neutral') finalImage = 'CN.gif'
      if (finalAlignment === 'Lawful evil') finalImage = 'LE.gif'
      if (finalAlignment === 'Neutral evil') finalImage = 'NE.gif'
      if (finalAlignment === 'Chaotic evil') finalImage = 'CE.gif'
      
      res.render('alignment.ejs', {finalAlignment, finalImage})
    }
  );
}

module.exports = { getTweets };
