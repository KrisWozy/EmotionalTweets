const app = require("express")();
const bodyParser = require("body-parser");
const personalityRouter = require("./routes/personality");

app.use(bodyParser.json());

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
  res.status(500).send({ msg: "internal server error", err });
});

module.exports = app;
