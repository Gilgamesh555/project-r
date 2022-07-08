// routes/api/activos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load Activo Model
const Activo = require('../../models/Activo')
const { json } = require('body-parser')
const Grupo = require('../../models/Grupo')
const Auxiliar = require('../../models/Auxiliar')
const Log = require('../../models/Log')
const User = require('../../models/User')


const multer = require('multer')
const path = require('path')

//storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploadActivos')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Please upload a image'))
        }
        cb(undefined, true)
    }
})

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'

// @route GET api/activos/
// @description get all activos
router.get('/', (req, res) => {
    Activo.find()
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/
// @description get all activos
router.get('/search', (req, res) => {
    const { searchInput } = req.query;

    const query = Activo
        .aggregate([
            {$project: {
                'oficinaId': {'$toObjectId': '$oficinaId'}, 
                'auxiliarId': {'$toObjectId': '$auxiliarId'},
                'oficinaId': {'$toObjectId': '$oficinaId'},
                'usuarioId': {'$toObjectId': '$usuarioId'},
                document: "$$ROOT",
            }},
            {
                $lookup: {
                    from: 'users',
                    localField: 'usuarioId',
                    foreignField: '_id',
                    as: "users"
                }
            },
            {
                $lookup: {
                    from: 'oficinas',
                    localField: 'oficinaId',
                    foreignField: '_id',
                    as: "oficinas"
                }
            },
            {
                $lookup: {
                    from: 'auxiliars',
                    localField: 'auxiliarId',
                    foreignField: '_id',
                    as: "auxiliares"
                }
            },
            {
                $lookup: {
                    from: 'oficinas',
                    localField: 'oficinaId',
                    foreignField: '_id',
                    as: "oficinas"
                }
            },
            {$match: {
                $or: [
                {'document.codigo': {$regex: searchInput, $options: 'i'}},
                {'oficinas.nombre': {$regex: searchInput, $options: 'i'}},
                {'auxiliares.nombre': {$regex: searchInput, $options: 'i'}},
                {'users.username': {$regex: searchInput, $options: 'i'}},
                {'users.nombre': {$regex: searchInput, $options: 'i'}},
                {'users.apPaterno': {$regex: searchInput, $options: 'i'}},
                {'users.apMaterno': {$regex: searchInput, $options: 'i'}},
                {'document.costoInicial': {$regex: searchInput, $options: 'i'}},
                {'document.estado': {$regex: searchInput, $options: 'i'}},
            ]}},
        ])

        Activo.aggregatePaginate(query, {
            limit: 5,
            page: req.query.pageNumber ?? 1
        })
        .then(activos => {
            activos.docs = activos.docs.map(item => item.document)
            return res.json(activos)
        })
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/
// @description get all activos
router.get('/all', (req, res) => {
    Activo.aggregatePaginate({}, {
        limit: 5,
        page: req.query.pageNumber ?? 1
    })
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/activos/:id
// @description get single activo by id
router.get('/:id', (req, res) => {
    Activo.findById(req.params.id)
        .then(activo => res.json(activo))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuario no encontrado' }))
})

// @route GET api/activos/:id
// @description get single activo by id
router.get('/userId/:userId', (req, res) => {
    Activo.find({
        'usuarioId': req.params.userId
    })
        .then(activo => res.json(activo))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuario no encontrado' }))
})

// @route GET api/activos/:id
// @description get single activo by id
router.get('/oficina/:oficinaId', (req, res) => {
    Activo.find({
        'oficinaId': req.params.oficinaId
    })
        .then(activo => res.json(activo))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuario no encontrado' }))
})

// @route POST api/activos
// @description add/save a activo
router.post('/', upload.single('imagePath'), async (req, res) => {
    // Hashing the passwords

    const { fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion } = req.body

    const imagePath = req.file.path

    var codigoL = await Grupo.findOne({ _id: grupoId })
        .then(grupo => {
            return grupo.nombre.toLowerCase().substr(0, 2)
        })

    var codigoN = await Auxiliar.findOne({ _id: auxiliarId })
        .then(auxiliar => {
            return auxiliar.codigo
        })

    var codigo = await Activo.findOne({ grupoId: grupoId, auxiliarId: auxiliarId }, {}, { sort: { 'codigo': -1 } })
        .then(activo => {
            if (activo === null) {
                return 1001
            } else {
                return parseInt(activo.codigo.split('-')[1]) + 1
            }
        })


    codigo = codigoL + codigoN + '-' + codigo

    // Conditions
    // if(!vida || typeof vida !== 'string'){
    //     return res.json({status: 'error', error: 'Valor de Vida No Valido o Nulo'})
    // }

    // if(!coe || typeof coe !== 'string'){
    //     return res.json({status: 'error', error: 'Valor de coe No Valido o Nulo'})
    // }

    if (!imagePath) {
        return res.json({ status: 'error', error: 'Imagen no Valida o Nula' })
    }

    if (!descripcion || typeof descripcion !== 'string') {
        return res.json({ status: 'error', error: 'Descripcion No Valido o Nulo' })
    }

    if (!estado || typeof estado !== 'string') {
        return res.json({ status: 'error', error: 'Estado No Valido o Nulo' })
    }

    if (!observaciones || typeof observaciones !== 'string') {
        return res.json({ status: 'error', error: 'Inserte una Observacion' })
    }

    if (!costoInicial || typeof costoInicial !== 'string') {
        return res.json({ status: 'error', error: 'Costo Inicial no Valido o Nulo' })
    }

    if (!estadoActivo || typeof estadoActivo !== 'string') {
        return res.json({ status: 'error', error: 'Estado no seleccionado o nulo' })
    }

    if (!usuarioId || typeof usuarioId !== 'string') {
        return res.json({ status: 'error', error: 'Responsable no Seleccionado o Nulo' })
    }

    if (!auxiliarId || typeof auxiliarId !== 'string') {
        return res.json({ status: 'error', error: 'Auxiliar no Seleccionado o Nulo' })
    }

    if (!grupoId || typeof grupoId !== 'string') {
        return res.json({ status: 'error', error: 'Grupo No Valido o Nulo' })
    }

    if (!ufvId || typeof ufvId !== 'string') {
        return res.json({ status: 'error', error: 'UFV No Valido o Nulo' })
    }

    if (!fechaRegistro || typeof fechaRegistro !== 'string') {
        return res.json({ status: 'error', error: 'Fecha de Registro No Valido o Nulo' })
    }

    if (!fechaIncorporacion || typeof fechaIncorporacion !== 'string') {
        return res.json({ status: 'error', error: 'Fecha de Incorporacion No Valida o Nula' })
    }

    // if(!codigo || typeof codigo !== 'string'){
    //     return res.json({status: 'error', error: 'Codigo No Valido o Nulo'})
    // }


    await Activo.create({ codigo, fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, imagePath })
        .then(activo => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            // today = yyyy + '-' + mm + '-' + dd;

            Log.create({
                userId: usuarioId,
                activoId: activo._id,
                description: `creo el activo con un costo inicial de ${activo.costoInicial}.\n
                            Con un estado ${activo.estadoActivo}.\n
                            Observaciones: ${activo.observaciones}.\n
                            Descripcion: ${activo.descripcion}`,
                date: today
            })

            return res.json({ msg: 'User added Successfully' })
        })
        .catch(err => res.json({ error: err.code, errmsg: err.message }))

    // const newActivo = await Activo.find({}, {}, { sort: { 'date': -1 } })
    // console.log(newActivo);
    // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/modify', async (req, res) => {
    // Hashing the passwords
    const { actives } = req.body;

    const { usuarioId, firstUserId, secondUserId } = req.body;

    actives.map(active => {
        if (active) {
            Activo.findByIdAndUpdate(active._id, { usuarioId: req.body.secondUserId })
                .then(async active => {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    // today = yyyy + '-' + mm + '-' + dd;

                    const oldUser = await User.findById(firstUserId);
                    const newUser = await User.findById(secondUserId);

                    const oldUserName = `${oldUser.nombre} ${oldUser.apPaterno} ${oldUser.apMaterno}`;
                    const newUserName = `${newUser.nombre} ${newUser.apPaterno} ${newUser.apMaterno}`;

                    Log.create({
                        userId: usuarioId,
                        activoId: active._id,
                        description: `cambio al encargado del activo con Nombre: ${oldUserName}.\n
                                Por el nuevo encargado con Nombre: ${newUserName}`,
                        date: today
                    })
                    return res.json({ msg: 'User added Successfully' })
                })
                .catch(err => res.status(404).json({ error: err.message }))
        }
    })
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id', upload.single('imagePath'), async (req, res) => {
    // Hashing the passwords

    const { fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, _id } = req.body

    var imagePath

    if (req.file) {
        imagePath = req.file.path
    } else {
        imagePath = await Activo.findOne({ _id: _id })
            .then(activo => {
                return activo.imagePath
            })
    }

    var codigoL = await Grupo.findOne({ _id: grupoId })
        .then(grupo => {
            return grupo.nombre.toLowerCase().substr(0, 2)
        })

    var codigoN = await Auxiliar.findOne({ _id: auxiliarId })
        .then(auxiliar => {
            return auxiliar.codigo
        })

    var codigo = await Activo.findOne({ _id: _id, grupoId: grupoId, auxiliarId: auxiliarId })
        .then(activo => {
            if (activo === null) {
                return -1
            } else {
                return activo.codigo.split('-')[1]
            }
        })

    if (codigo === -1) {
        codigo = await Activo.findOne({ grupoId: grupoId, auxiliarId: auxiliarId })
            .then(activo => {
                if (activo === null) {
                    return 1001
                } else {
                    return parseInt(activo.codigo.split('-')[1]) + 1
                }
            })
    }

    codigo = codigoL + codigoN + '-' + codigo

    // Conditions
    if (!descripcion || typeof descripcion !== 'string') {
        return res.json({ status: 'error', error: 'Descripcion No Valido o Nulo' })
    }

    if (!estado || typeof estado !== 'string') {
        return res.json({ status: 'error', error: 'Estado No Valido o Nulo' })
    }

    if (!observaciones || typeof observaciones !== 'string') {
        return res.json({ status: 'error', error: 'Inserte una Observacion' })
    }

    if (!costoInicial || typeof costoInicial !== 'string') {
        return res.json({ status: 'error', error: 'Costo Inicial no Valido o Nulo' })
    }

    if (!estadoActivo || typeof estadoActivo !== 'string') {
        return res.json({ status: 'error', error: 'Estado no seleccionado o nulo' })
    }

    if (!usuarioId || typeof usuarioId !== 'string') {
        return res.json({ status: 'error', error: 'Usuario no Seleccionado o Nulo' })
    }

    if (!auxiliarId || typeof auxiliarId !== 'string') {
        return res.json({ status: 'error', error: 'Auxiliar no Seleccionado o Nulo' })
    }

    if (!grupoId || typeof grupoId !== 'string') {
        return res.json({ status: 'error', error: 'Grupo No Valido o Nulo' })
    }

    if (!ufvId || typeof ufvId !== 'string') {
        return res.json({ status: 'error', error: 'UFV No Valido o Nulo' })
    }

    if (!fechaRegistro || typeof fechaRegistro !== 'string') {
        return res.json({ status: 'error', error: 'Fecha de Registro No Valido o Nulo' })
    }

    if (!fechaIncorporacion || typeof fechaIncorporacion !== 'string') {
        return res.json({ status: 'error', error: 'Fecha de Incorporacion No Valida o Nula' })
    }

    if (!codigo || typeof codigo !== 'string') {
        return res.json({ status: 'error', error: 'Codigo No Valido o Nulo' })
    }

    Activo.findByIdAndUpdate(req.params.id, { codigo, fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, imagePath })
        .then(user => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            // today = yyyy + '-' + mm + '-' + dd;

            Log.create({
                userId: usuarioId,
                activoId: user._id,
                description: `modifico el activo.\nCosto Inicial: ${costoInicial}.\nEstado Activo: ${estadoActivo}.\nEstado: ${estado}.\nObservaciones: ${observaciones}.\nDescripcion: ${descripcion}.`,
                date: today
            })
            return res.json({ msg: 'Updated Succesfully' })
        })
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos' }))
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id/estado', async (req, res) => {
    const { usuarioId } = req.body

    // Hashing the passwords
    Activo.findByIdAndUpdate(req.params.id, req.body)
        .then(activo => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            // today = yyyy + '-' + mm + '-' + dd;

            const estado = activo.estado === 'activo' ? 'inactivo' : 'activo';

            Log.create({
                userId: usuarioId,
                activoId: activo._id,
                description: `modifico el estado del activo a ${estado}`,
                date: today
            })

            return res.json({ msg: 'Updated Succesfully' })
        })
        .catch(err => res.status(404).json({ error: err.message }))
})

// @route DELETE api/users/:id
// @description delete a book by id
router.delete('/:id', (req, res) => {
    Activo.findByIdAndRemove(req.params.id, req.body)
        .then(activo => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            // today = yyyy + '-' + mm + '-' + dd;

            Log.create({
                userId: usuarioId,
                activoId: activo._id,
                description: `elimino el activo`,
                date: today
            })
            return res.json({ msg: 'User entry deleted successfully' })
        })
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router

