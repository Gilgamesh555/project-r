// routes/api/activos
const express = require('express')
const router = express.Router()

// Load Activo Model
const ActivoBaja = require('../../models/ActivoBaja')
const Log = require('../../models/Log')

const multer = require('multer')
const path = require('path')

//storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploadActivosBajaReports')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
            return cb(new Error('Please upload a image'))
        }
        cb(undefined, true)
    }
})

// @route GET api/activos/
// @description get all activos
router.get('/', (req, res) => {
    ActivoBaja.find()
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/
// @description get all activos
router.get('/byActivoId/:id', (req, res) => {
    ActivoBaja.findOne({ activoId: req.params.id }, {}, { sort: { 'date': -1 } })
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/:id
// @description get single activo by id
router.get('/:id', (req, res) => {
    ActivoBaja.findById(req.params.id)
        .then(activo => res.json(activo))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuario no encontrado' }))
})

// @route POST api/activos
// @description add/save a activo
router.post('/', upload.fields([{name: 'imagePath', maxCount: 1}, {name: 'pdfPath', maxCount: 1}]),   async (req, res) => {
    // Hashing the passwords

    const { userId, activoId, description, date } = req.body

    const imagePath = req.files.imagePath[0].path
    const pdfPath = req.files.pdfPath[0].path

    if (!imagePath) {
        return res.json({ status: 'error', error: 'Imagen no Valida o Nula' })
    }

    if (!description || typeof description !== 'string') {
        return res.json({ status: 'error', error: 'Descripcion No Valido o Nulo' })
    }

    if (!date || typeof date !== 'string') {
        return res.json({ status: 'error', error: 'Date No Valido o Nulo' })
    }

    if (!activoId || typeof activoId !== 'string') {
        return res.json({ status: 'error', error: 'Inserte un activoId' })
    }

    if (!userId || typeof userId !== 'string') {
        return res.json({ status: 'error', error: 'userId no Valido o Nulo' })
    }

    await ActivoBaja.create({ userId, activoId, description, date, imagePath, pdfPath })
        .then(activo => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            // today = yyyy + '-' + mm + '-' + dd;

            Log.create({
                userId: usuarioId,
                activoId: activo._id,
                description: `Dio de baja el activo`,
                date: today
            })

            return res.json({ msg: 'User added Successfully' })
        })
        .catch(err => res.json({ error: err.code, errmsg: err.message }))
})

// @route DELETE api/users/:id
// @description delete a book by id
router.delete('/:id', (req, res) => {
    ActivoBaja.findByIdAndRemove(req.params.id, req.body)
        .then(activo => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            // today = yyyy + '-' + mm + '-' + dd;

            Log.create({
                userId: usuarioId,
                activoId: activo._id,
                description: `elimino el activo.`,
                date: today
            })
            return res.json({ msg: 'User entry deleted successfully' })
        })
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router

