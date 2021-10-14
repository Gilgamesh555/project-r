// routes/api/users
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load Auxiliar Model
const Auxiliar = require('../../models/Auxiliar')
const { json } = require('body-parser')

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'


// @route GET api/auxiliares/
// @description get all auxiliares
router.get('/', (req, res) => {
    Auxiliar.find()
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
    
    const {nombre, codigo, estado, descripcion, grupoId} = req.body

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
    if(!descripcion || typeof descripcion !== 'string'){
        return res.json({status: 'error', error: 'Descripcion No Valida o Nula'})
    }
    if(!grupoId || typeof grupoId !== 'string'){
        return res.json({status: 'error', error: 'Grupo Escogido No Valido o Nula'})
    }

    Auxiliar.create({nombre, codigo, estado, descripcion, grupoId})
    .then(user => res.json({msg: 'User added Successfully'}))
    .catch(err => res.json({error: err.code, errmsg: err.message}))
        // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/auxiliares/:id
// @description update a Auxiliar by id
router.put('/:id', async(req, res) => {
    // Hashing the passwords
    
    const {nombre, codigo, estado} = req.body

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

    Auxiliar.findByIdAndUpdate(req.params.id, {nombre, codigo, estado})
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

