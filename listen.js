const app = require('./app')
if (!process.env.PORT) PORT = 9090;
else PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
})
