const express = require("express")
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const postRoute = require('./posts')

dotenv.config()

//import routes

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
const con = mongoose.connection

con.on('open', () => {
    console.log('connected to db')
})
const authRoute = require('./routes/auth')
app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

const PORT = 4000;
app.listen(PORT, () => {
console.log(`Server is up and runnign http://localhost:${PORT}`)
})