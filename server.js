// server.js
const express = require('express')

const connectDB = require('./config/db')

const cors = require('cors')

const bodyParser = require('body-parser')

//routes
const users =  require('./routes/api/users')
const oficinas = require('./routes/api/oficinas')
const grupos = require('./routes/api/grupos')
const auxiliares = require('./routes/api/auxiliares')
const activos = require('./routes/api/activos')
const ufv = require('./routes/api/ufv')
const roles = require('./routes/api/roles');
const views = require('./routes/api/views');
const roleViews = require('./routes/api/roleviews');
const cargos =  require('./routes/api/cargos');
const logs = require('./routes/api/logs');
const activoBaja = require('./routes/api/activoBaja');

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
app.use('/api/grupos', grupos)
app.use('/api/auxiliares', auxiliares)
app.use('/api/activos', activos)
app.use('/api/ufv', ufv)
app.use('/uploadActivos', express.static('uploadActivos'))
app.use('/uploadActivosBajaReports', express.static('uploadActivosBajaReports'))
app.use('/api/roles', roles);
app.use('/api/views', views);
app.use('/api/roleviews', roleViews);
app.use('/api/cargos', cargos);
app.use('/api/logs', logs);
app.use('/api/activoBaja', activoBaja);

const port = process.env.PORT || 8002

app.listen(port, () => console.log(`Server Running on port ${port}`))