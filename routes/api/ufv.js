// routes/api/users
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load User Model
const Ufv = require('../../models/Ufv')
const { json } = require('body-parser')

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'

// @route GET api/ufvs/
// @description get all ufvs
router.post('/date', (req, res) => {
    Ufv.findOne({fecha: req.body.fecha})
        .then(users => res.json(users))
        .catch(err => res.json({ noUfvFound: 'Ufvs no encontrados'}))    
})

// @route GET api/ufvs/
// @description get all ufvs
router.get('/', (req, res) => {
    Ufv.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousersfound: 'Ufvs no encontrados'}))    
})

// @route GET api/ufvs/
// @description get all ufvs
router.get('/all', (req, res) => {
    Ufv.paginate({}, {
        limit: 5,
        page: req.query.pageNumber ?? 0
    })
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousersfound: 'Ufvs no encontrados'}))    
})

// @route GET api/ufvs/:id
// @description get single ufv by id
router.get('/:id', (req, res) => {
    Ufv.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json({ nousersfound: 'Ufv no encontrado'}))    
})

// @route POST api/ufvs
// @description add/save a ufv
router.post('/', async (req, res) => {
    // Hashing the passwords
    
    const {fecha, valor, estado} = req.body

    // Conditions
    if(!fecha || typeof fecha !== 'string'){
        return res.json({status: 'error', error: 'Fecha No Valida o Nulo'})
    }
    if(!valor || typeof valor !== 'string'){
        return res.json({status: 'error', error: 'Valor No Valido o Nulo'})
    }
    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Nulo'})
    }

    Ufv.create({fecha, valor, estado})
    .then(user => res.json({msg: 'User added Successfully'}))
    .catch(err => res.json({error: err.code, errmsg: err.message}))
        // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/ufvs/:id
// @description update a ufv by id
router.put('/:id', async(req, res) => {
    // Hashing the passwords
    
    const {fecha, valor, estado} = req.body

    // Conditions
    if(!fecha || typeof fecha !== 'string'){
        return res.json({status: 'error', error: 'Fecha No Valida o Nulo'})
    }
    if(!valor || typeof valor !== 'string'){
        return res.json({status: 'error', error: 'Valor No Valido o Nulo'})
    }
    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Nulo'})
    }

    Ufv.findByIdAndUpdate(req.params.id, {fecha, valor, estado})
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos'}))    
})

// @route PUT api/ufvs/:id/estado
// @description update a ufv by id only a estado
router.put('/:id/estado', async(req, res) => {
    // Hashing the passwords
    Ufv.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: err.message}))    
})



// @route DELETE api/ufvs/:id
// @description delete a ufv by id
router.delete('/:id', (req, res) => {
    Ufv.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({msg: 'Ufv entry deleted successfully'}))
    .catch(err => res.status(404).json({ error: 'El Usuario no Existe'}))    
})

module.exports = router

