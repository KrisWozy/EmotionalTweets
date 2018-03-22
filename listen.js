const app = require('./app')
if (!process.env.PORT) PORT = 9090;
else PORT = process.env.PORT

console.log(process.env.NODE_ENV)

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
})
