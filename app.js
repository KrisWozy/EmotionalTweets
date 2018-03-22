
const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require("body-parser");
const personalityRouter = require("./routes/personality");

app.use(bodyParser.json());

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'views')))

app.get('/', (req, res) => res.render('index.ejs'))

app.use("/personality", personalityRouter);

app.use("/*", (req, res, next) => next({ status: 404 }));

app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).send({
      msg: "page not found"
    });
  } else next(err);
});

app.use((err, req, res, next) => {
    console.log('hiya', err)
  res.status(500).send({ msg: "internal server error", err });
});

module.exports = app;
