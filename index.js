const express = require('express')
const helmet = require('helmet')
const cookieParser =require("cookie-parser")
const { connectDB } = require('./util/connect')
const userRoute = require('./router/user.route')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())

app.use('/api',userRoute);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    connectDB()
})