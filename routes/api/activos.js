// routes/api/activos
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load Activo Model
const Activo = require('../../models/Activo')
const { json } = require('body-parser')

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'

// @route GET api/activos/
// @description get all activos
router.get('/', (req, res) => {
    Activo.find()
        .then(activos => res.json(activos))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados'}))    
})

// @route GET api/activos/:id
// @description get single activo by id
router.get('/:id', (req, res) => {
    Activo.findById(req.params.id)
        .then(activo => res.json(activo))
        .catch(err => res.status(404).json({ noactivosfound: 'Usuario no encontrado'}))    
})

// @route POST api/activos
// @description add/save a activo
router.post('/', async (req, res) => {
    // Hashing the passwords

    const {codigo, fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, vida, coe} = req.body

    // Conditions
    if(!vida || typeof vida !== 'string'){
        return res.json({status: 'error', error: 'Valor de Vida No Valido o Nulo'})
    }

    if(!coe || typeof coe !== 'string'){
        return res.json({status: 'error', error: 'Valor de coe No Valido o Nulo'})
    }

    if(!descripcion || typeof descripcion !== 'string'){
        return res.json({status: 'error', error: 'Descripcion No Valido o Nulo'})
    }

    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado No Valido o Nulo'})
    }

    if(!observaciones || typeof observaciones !== 'string'){
        return res.json({status: 'error', error: 'Inserte una Observacion'})
    }

    if(!costoInicial || typeof costoInicial !== 'string'){
        return res.json({status: 'error', error: 'Costo Inicial no Valido o Nulo'})
    }

    if(!estadoActivo || typeof estadoActivo !== 'string'){
        return res.json({status: 'error', error: 'Estado no seleccionado o nulo'})
    }

    if(!usuarioId || typeof usuarioId !== 'string'){
        return res.json({status: 'error', error: 'Responsable no Seleccionado o Nulo'})
    }

    if(!auxiliarId || typeof auxiliarId !== 'string'){
        return res.json({status: 'error', error: 'Auxiliar no Seleccionado o Nulo'})
    }

    if(!grupoId || typeof grupoId !== 'string'){
        return res.json({status: 'error', error: 'Grupo No Valido o Nulo'})
    }

    if(!ufvId || typeof ufvId !== 'string'){
        return res.json({status: 'error', error: 'UFV No Valido o Nulo'})
    }

    if(!fechaRegistro || typeof fechaRegistro !== 'string'){
        return res.json({status: 'error', error: 'Fecha de Registro No Valido o Nulo'})
    }

    if(!fechaIncorporacion || typeof fechaIncorporacion !== 'string'){
        return res.json({status: 'error', error: 'Fecha de Incorporacion No Valida o Nula'})
    }

    if(!codigo || typeof codigo !== 'string'){
        return res.json({status: 'error', error: 'Codigo No Valido o Nulo'})
    }
    

    Activo.create({codigo, fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, vida, coe})
        .then(user => res.json({msg: 'User added Successfully'}))
        .catch(err => res.json({error: err.code, errmsg: err.message}))
        // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id', async(req, res) => {
    // Hashing the passwords
    
    const {codigo, fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, vida, coe} = req.body

    // Conditions
    if(!descripcion || typeof descripcion !== 'string'){
        return res.json({status: 'error', error: 'Descripcion No Valido o Nulo'})
    }

    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado No Valido o Nulo'})
    }

    if(!observaciones || typeof observaciones !== 'string'){
        return res.json({status: 'error', error: 'Inserte una Observacion'})
    }

    if(!costoInicial || typeof costoInicial !== 'string'){
        return res.json({status: 'error', error: 'Costo Inicial no Valido o Nulo'})
    }

    if(!estadoActivo || typeof estadoActivo !== 'string'){
        return res.json({status: 'error', error: 'Estado no seleccionado o nulo'})
    }

    if(!usuarioId || typeof usuarioId !== 'string'){
        return res.json({status: 'error', error: 'Usuario no Seleccionado o Nulo'})
    }

    if(!auxiliarId || typeof auxiliarId !== 'string'){
        return res.json({status: 'error', error: 'Auxiliar no Seleccionado o Nulo'})
    }

    if(!grupoId || typeof grupoId !== 'string'){
        return res.json({status: 'error', error: 'Grupo No Valido o Nulo'})
    }

    if(!ufvId || typeof ufvId !== 'string'){
        return res.json({status: 'error', error: 'UFV No Valido o Nulo'})
    }

    if(!fechaRegistro || typeof fechaRegistro !== 'string'){
        return res.json({status: 'error', error: 'Fecha de Registro No Valido o Nulo'})
    }

    if(!fechaIncorporacion || typeof fechaIncorporacion !== 'string'){
        return res.json({status: 'error', error: 'Fecha de Incorporacion No Valida o Nula'})
    }

    if(!codigo || typeof codigo !== 'string'){
        return res.json({status: 'error', error: 'Codigo No Valido o Nulo'})
    }

    Activo.findByIdAndUpdate(req.params.id, {codigo, fechaIncorporacion, fechaRegistro, ufvId, grupoId, auxiliarId, oficinaId, usuarioId, estadoActivo, costoInicial, observaciones, estado, descripcion, vida, coe})
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos'}))    
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id/estado', async(req, res) => {
    // Hashing the passwords
    Activo.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: err.message}))    
})



// @route DELETE api/users/:id
// @description delete a book by id
router.delete('/:id', (req, res) => {
    Activo.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({msg: 'User entry deleted successfully'}))
    .catch(err => res.status(404).json({ error: 'El Usuario no Existe'}))    
})

module.exports = router

