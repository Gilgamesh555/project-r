// routes/api/logs
const express = require('express')
const router = express.Router()

// Load Log Model
const Log = require('../../models/Log')
const { json } = require('body-parser')

// @route GET api/activos/
// @description get all activos
router.get('/', (req, res) => {
    Log.aggregatePaginate({}, {})
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/
// @description get all activos
router.get('/getByDate', (req, res) => {
    const { startDate, endDate } = req.body;
    Log.find({'created_on': {'$gte': startDate, '$lt': endDate}})
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/
// @description get all activos
router.get('/getByActivo/:id', (req, res) => {
    Log.aggregatePaginate({
        'activoId': req.params.id
    } ,{
        limit: 5,
        page: req.query.pageNumber ?? 0
    })
    .then(activos => res.json(activos))
    .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route POST api/grupos
// @description add/save a grupo
router.post('/', async (req, res) => {
    // Hashing the passwords

    const { userId, description, date, activoId } = req.body;

    // Conditions
    if (!userId || typeof userId !== 'string') {
        return res.json({ status: 'error', error: 'userId No Valido o Nulo' })
    }
    if (!description || typeof description !== 'string') {
        return res.json({ status: 'error', error: 'description No Valido o Nulo' })
    }
    if (!activoId || typeof activoId !== 'string') {
        return res.json({ status: 'error', error: 'activoId No Valido o Nulo' })
    }
    if (!date || typeof date !== 'string') {
        return res.json({ status: 'error', error: 'date No Valido o Nulo' })
    }

    var today = new Date();

    Log.create({ userId, description, today, activoId })
        .then(user => res.json({ msg: 'Log added Successfully' }))
        .catch(err => res.json({ error: err.code, errmsg: err.message }))
})

// @route GET api/activos/:id
// @description get single activo by id
router.get('/:id', (req, res) => {
    Log.findById(req.params.id)
        .then(activo => res.json(activo))
        .catch(err => res.status(404).json({ noactivosfound: 'Log no encontrado' }))
})



module.exports = router

