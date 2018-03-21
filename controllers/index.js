const PersonalityInsights = require("watson-developer-cloud/personality-insights/v3");
const { personalityConfig, twitterKeys } = require("../config");
const username = personalityConfig.username;
const password = personalityConfig.password;
const Twit = require("twit");

const pi = new PersonalityInsights({
  username,
  password,
  version_date: "2017-12-12"
});

const T = new Twit({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  app_only_auth: true
});

function getTweets(req, res, next) {
  const twitterId = req.params.twitterHandle;
  T.get(
    "statuses/user_timeline",
    { screen_name: `${twitterId}`, count: 100 },
    (err, tweets) => {
      return tweets.data;
    }
  )
    .then(tweetData => {
      const tweetsObject = {};
      tweetsObject.content = "";
      tweetData.data.forEach((tweet, i) => {
        tweetsObject.content += tweet.text;
      });
      return tweetsObject;
    })
    .then(tweetText => {
      analyseTweets(tweetText, req, res, next);
    });
}

function analyseTweets(tweets, res, res, next) {
  const { content } = tweets;
  pi.profile(
    {
      content,
      content_type: "text/plain"
    },
    (err, insight) => {
      let lawAlignment;
      let goodAlignment;
      const lawfulTraits = insight.personality[1].children;
      const goodTraits = insight.personality[3].children;
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
      if (goodRating <= 30) goodAlignment = "evil";
      if (goodRating < 60 && goodRating > 30) goodAlignment = "neutral";
      if (goodRating >= 60) goodAlignment = "good";

      //res.send(lawAlignment);

      res.send(`${lawAlignment} ${goodAlignment}`);
    }
  );
}

module.exports = { getTweets };
