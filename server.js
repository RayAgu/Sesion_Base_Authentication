const express = require("express")
const session = require("express-session")
require("./config/db")
const authRoutes = require("./routes/userRouter");
const recordRoutes = require("./routes/recordRouter");
const PORT = (process.env.PORT)

const app = express()
app.use( express.json() )

app.use(
    session({
        secret: process.env.SECRETE,
        resave: false,
        saveUninitialized: false,
        cookie: {
             maxAge: 60 * 60 * 1000,  //1 hour
        },
    })
);

app.use("/api", authRoutes)
app.use("/api", recordRoutes)

app.listen(PORT, () => {
    console.log(`server is listening to port: ${PORT}`)
})
