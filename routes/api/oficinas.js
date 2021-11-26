// routes/api/oficinas
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load Oficina model
const Oficina = require('../../models/Oficina')
const { json } = require('body-parser')

const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'

// @route GET api/oficinas/
// @description get all user
router.get('/', (req, res) => {
    Oficina.find()
        .then(oficinas => res.json(oficinas))
        .catch(err => res.status(404).json({ nousersfound: 'Usuarios no encontrados' }))
})

// @route GET api/oficinas/:id
// @description get single oficina by id
router.get('/:id', (req, res) => {
    Oficina.findById(req.params.id)
        .then(oficina => res.json(oficina))
        .catch(err => res.status(404).json({ nousersfound: 'Usuario no encontrado' }))
})

// @route POST api/oficinas/
// @description add/save a oficina
router.post('/', async (req, res) => {
    // Hashing the passwords

    const { nombre, estado } = req.body

    var codigo = nombre.toLowerCase().substr(0, 3);

    var codigoOficina = await Oficina.findOne({}, {}, { sort: { '_id' : -1 } })
        .then(oficina => {
            if (oficina === null) {
                return 1000
            } else {
                return parseInt(oficina.codigo.split('-')[1]) + 1;
            }
        })

    codigo = codigo + "-" + codigoOficina;

    Oficina.create({ nombre, codigo, estado })
        .then(oficina => res.json({ msg: 'Oficina added Successfully' }))
        .catch(err => res.json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido' }))
})

// @route PUT api/oficinas/:id
// @description update a oficina by id
router.put('/:id', (req, res) => {
    
    Oficina.findByIdAndUpdate(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'Updated Succesfully' }))
        .catch(err => res.json({ error: 'No se pudo actualizar la base de datos' }))
})

// @route DELETE api/oficinas/:id
// @description delete a oficina by id
router.delete('/:id', (req, res) => {
    Oficina.findByIdAndRemove(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'oficina entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router