// server.js
const express = require('express')

const connectDB = require('./config/db')

const cors = require('cors')

const bodyParser = require('body-parser')

//routes
const users =  require('./routes/api/users')
const oficinas = require('./routes/api/oficinas')

const app = express()

//connect database
connectDB()

//bodyParser
app.use(express.urlencoded())
app.use(express.json())

// cors
app.use(cors({origin: true, credentials: true}))

//init Middleware
app.use(express.json({extended: false}))

app.get('/', (req, res) => res.send('Hello World!'))

// use Routes
app.use('/api/users', users)
app.use('/api/oficinas', oficinas)

const port = process.env.PORT || 8002

app.listen(port, () => console.log(`Server Running on port ${port}`))