// routes/api/users
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load User Model
const Grupo = require('../../models/Grupo')
const Auxiliar = require('../../models/Auxiliar')
const { json } = require('body-parser')

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'

// // @route GET api/grupos/
// // @description get all grupos
// router.get('/', (req, res) => {
//     Grupo.find()
//         .then(users => {
//             const ids = users.map((index) => (
//                 Auxiliar.countDocuments({'grupoId': { '$in': index._id }})
//                 .then(auxiliares => {
//                     var aux = {
//                         id: 1,
//                     }
//                     index['count'] = auxiliares
//                     console.log(indezx)
//                 })
//             ))
//         })
//         .catch(err => res.status(404).json({ nousersfound: 'Grupos no encontrados'}))    
// })

// @route GET api/grupos/
// @description get all grupos
router.get('/', (req, res) => {
    Grupo.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousersfound: 'Grupos no encontrados'}))    
})

// @route GET api/grupos/
// @description get all grupos
router.get('/all', (req, res) => {
    Grupo.paginate({}, {
        limit: 5,
        page: req.query.pageNumber ?? 0
    })
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nousersfound: 'Grupos no encontrados'}))    
})

// @route GET api/grupos/:id
// @description get single grupo by id
router.get('/:id', (req, res) => {
    Grupo.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json({ nousersfound: 'Grupo no encontrado'}))    
})

// @route POST api/grupos
// @description add/save a grupo
router.post('/', async (req, res) => {
    // Hashing the passwords
    
    const {nombre, estado, vida, coe} = req.body

    var codigo = await Grupo.findOne({}, {}, { sort: { 'codigo': -1}})
    .then(grupo => {
        if(grupo  === null){
            return 1000
        }else{
            return parseInt(grupo.codigo) + 1000
        }
    })

    // Conditions
    if(!nombre || typeof nombre !== 'string'){
        return res.json({status: 'error', error: 'Nombre No Valido o Nulo'})
    }
    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Nulo'})
    }
    if(!vida || typeof vida !== 'string'){
        return res.json({status: 'error', error: 'Valor de vida Nulo'})
    }
    if(!coe || typeof coe !== 'string'){
        return res.json({status: 'error', error: 'Valor de Coe Nulo'})
    }

    Grupo.create({nombre, codigo, estado, vida, coe})
    .then(user => res.json({msg: 'User added Successfully'}))
    .catch(err => res.json({error: err.code, errmsg: err.message}))
        // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/grupos/:id
// @description update a grupo by id
router.put('/:id', async(req, res) => {
    // Hashing the passwords
    
    const {nombre, estado, codigo, vida, coe} = req.body

    // Conditions
    if(!nombre || typeof nombre !== 'string'){
        return res.json({status: 'error', error: 'Nombre No Valido o Nulo'})
    }
    if(!codigo || typeof codigo !== 'string'){
        return res.json({status: 'error', error: 'Codigo No Valido o Nulo'})
    }
    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Nulo'})
    }
    if(!vida || typeof vida !== 'string'){
        return res.json({status: 'error', error: 'Valor de vida Nulo'})
    }
    if(!coe || typeof coe !== 'string'){
        return res.json({status: 'error', error: 'Valor de Coe Nulo'})
    }

    Grupo.findByIdAndUpdate(req.params.id, {nombre, codigo, estado, vida, coe})
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos'}))    
})

// @route PUT api/grupos/:id/estado
// @description update a grupo by id only a estado
router.put('/:id/estado', async(req, res) => {
    // Hashing the passwords
    Grupo.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: err.message}))    
})



// @route DELETE api/grupos/:id
// @description delete a grupo by id
router.delete('/:id', (req, res) => {
    Grupo.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({msg: 'Grupo entry deleted successfully'}))
    .catch(err => res.status(404).json({ error: 'El Usuario no Existe'}))    
})

module.exports = router

