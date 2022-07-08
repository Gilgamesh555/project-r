// routes/api/users
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load Auxiliar Model
const Auxiliar = require('../../models/Auxiliar')
const Grupo = require('../../models/Grupo')
const { json } = require('body-parser')

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'


// // @route GET api/auxiliares/
// // @description get all auxiliares
// router.get('/getGrupos', (req, res) => {
//     Auxiliar.countDocuments({grupoId: ['61673109ca29bcda2247', '61673109ca29bcda2247']})
//         .then(users => res.json(users))
//         .catch(err => res.status(404).json({ nousersfound: 'Auxiliares no encontrados'}))    
// })

// @route GET api/auxiliares/
// @description get all auxiliares
router.get('/', (req, res) => {
    Auxiliar.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousersfound: 'Auxiliares no encontrados'}))    
})

// @route GET api/activos/
// @description get all activos
router.get('/search', (req, res) => {
    const { searchInput } = req.query;

    const query = Auxiliar
        .aggregate([
            {$project: {
                'grupoId': {'$toObjectId': '$grupoId'}, 
                document: "$$ROOT",
            }},
            {
                $lookup: {
                    from: 'grupos',
                    localField: 'grupoId',
                    foreignField: '_id',
                    as: "grupos"
                }
            },
            {$match: {
                $or: [
                {'document.nombre': {$regex: searchInput, $options: 'i'}},
                {'document.codigo': {$regex: searchInput, $options: 'i'}},
                {'grupos.nombre': {$regex: searchInput, $options: 'i'}},
            ]}},
        ])

        Auxiliar.aggregatePaginate(query, {
            limit: 5,
            page: req.query.pageNumber ?? 1
        })
        .then(activos => {
            activos.docs = activos.docs.map(item => item.document)
            return res.json(activos)
        })
        .catch(err => res.status(404).json({ noactivosfound: 'Auxiliares no encontrados' }))
})

// @route GET api/auxiliares/
// @description get all auxiliares
router.get('/all', (req, res) => {
    Auxiliar.aggregatePaginate({}, {
        limit: 5,
        page: req.query.pageNumber ?? 0
    })
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousersfound: 'Auxiliares no encontrados'}))    
})

// @route GET api/Auxiliares/:id
// @description get single Auxiliar by id
router.get('/:id', (req, res) => {
    Auxiliar.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json({ nousersfound: 'Auxiliar no encontrado'}))    
})

// @route POST api/Auxiliares
// @description add/save a Auxiliar
router.post('/', async (req, res) => {
    // Hashing the passwords
    
    const {nombre, estado, grupoId} = req.body

    var codigo = await Auxiliar.findOne({grupoId: grupoId}, {}, { sort: { 'codigo': -1}})
    .then(auxiliar => {
        if(auxiliar === null){
            return 100
        }else{
            return parseInt(auxiliar.codigo) + 1
        }
    })

    if(codigo === 100) {
        codigo = await Grupo.findById(grupoId)
        .then(grupo => {
            return parseInt(grupo.codigo) + 1
        })
    }

    // Conditions
    if(!nombre || typeof nombre !== 'string'){
        return res.json({status: 'error', error: 'Nombre No Valido o Nulo'})
    }
    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Nulo'})
    }
    if(!grupoId || typeof grupoId !== 'string'){
        return res.json({status: 'error', error: 'Grupo Escogido No Valido o Nula'})
    }

    Auxiliar.create({nombre, codigo, estado, grupoId})
    .then(user => res.json({msg: 'User added Successfully'}))
    .catch(err => res.json({error: err.code, errmsg: err.message}))
        // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/auxiliares/:id
// @description update a Auxiliar by id
router.put('/:id', async(req, res) => {
    // Hashing the passwords
    
    const {nombre, estado, grupoId, _id} = req.body

    var codigo = await Auxiliar.findOne({grupoId: grupoId, _id: _id}, {})
    .then(auxiliar => {
        if(auxiliar === null){
            return -1
        }else{
            return req.body.codigo
        }
    })

    if(codigo === -1) {
        codigo = await Auxiliar.findOne({grupoId: grupoId}, {}, { sort: { 'codigo': -1}})
        .then(auxiliar => {
            if(auxiliar === null){
                return 100
            }else{
                return parseInt(auxiliar.codigo) + 1
            }
        })

        if(codigo === 100) {
            codigo = await Grupo.findById(grupoId)
            .then(grupo => {
                return parseInt(grupo.codigo) + 1
            })
        }
    }

    // Conditions
    if(!nombre || typeof nombre !== 'string'){
        return res.json({status: 'error', error: 'Nombre No Valido o Nulo'})
    }
    // if(!codigo || typeof codigo !== 'string'){
    //     return res.json({status: 'error', error: 'Codigo No Valido o Nulo'})
    // }
    if(!grupoId || typeof grupoId !== 'string'){
        return res.json({status: 'error', error: 'Grupo No Valido o Nulo'})
    }
    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Nulo'})
    }

    Auxiliar.findByIdAndUpdate(req.params.id, {nombre, codigo, estado, grupoId})
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos'}))    
})

// @route PUT api/auxiliares/:id/estado
// @description update a Auxiliar by id only a estado
router.put('/:id/estado', async(req, res) => {
    // Hashing the passwords
    Auxiliar.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: err.message}))    
})



// @route DELETE api/auxiliares/:id
// @description delete a Auxiliar by id
router.delete('/:id', (req, res) => {
    Auxiliar.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({msg: 'Auxiliar entry deleted successfully'}))
    .catch(err => res.status(404).json({ error: 'El Usuario no Existe'}))    
})

module.exports = router

