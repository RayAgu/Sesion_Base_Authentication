const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")

const url = (process.env.DATABASE)

mongoose.connect(url).then( () => {
    console.log("Database connected successfully.")
}).catch( (error) => {
    console.log("Error connecting to database", error.message)
})
