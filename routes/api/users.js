// routes/api/users
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load User Model
const User = require('../../models/User')
const { json } = require('body-parser')

// JWTSECRET
const JWTSECRET = 'vjkb@!#!#!$%%^fdjbiweqwe1235@bbiwebdfgfgdfbdfbnttnt'

// @route GET api/users/verify
// @description verify if a session is still in use
router.post('/verify', async (req, res) => {
    const {token} = req.body

    try{
        const user = jwt.verify(token, JWTSECRET)
    }catch(err) {
        res.json({status: 'error', error: 'session expired'})
    }
    // console.log('az')
    res.json({status: 'ok'})
})

// @route GET api/users/login
// @description login a user in the system
router.post('/login', async (req, res) => {
    const {username, password} = req.body  
    
    const user = await User.findOne({username}).lean()

    // Fixed User Inactive
    if(!user) {
        return res.json({status: 'error', error: 'Nombre de Usuario o Contraseña Incorrectos'})
    }

    if (user.estado === "inactivo" )
    {
        return res.json({status: 'error', error: 'El Usuario Se Encuentra Inactivo'})
    }

    if(await bcrypt.compare(password, user.password)) {
        //the username, password combination is successful

        const token = jwt.sign(
            {
                id: user._id, 
                username: user.username,
                nombre: user.nombre,
                apPaterno: user.apMaterno,
                apMaterno: user.apMaterno,
                role: user.role
            }, 
            JWTSECRET,
            {expiresIn: '3h'}
        )

        return res.json({status: 'ok', data: token})
    }

    return res.json({status: 'error', error: 'Usuario o Contraseña invalido'})
})

// @route GET api/users/
// @description get all user
router.get('/', async(req, res) => {

    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousersfound: 'Usuarios no encontrados'}))    
})

// @route GET api/activos/
// @description get all activos
router.get('/search', (req, res) => {
    const { searchInput } = req.query;

    const query = User
        .aggregate([
            {$project: {
                'oficinaId': {'$toObjectId': '$oficinaId'}, 
                'cargo': {'$toObjectId': '$cargo'}, 
                document: "$$ROOT",
            }},
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
                    from: 'stands',
                    localField: 'cargo',
                    foreignField: '_id',
                    as: "cargos"
                }
            },
            {$match: {
                $or: [
                {'document.nombre': {$regex: searchInput, $options: 'i'}},
                {'document.apPaterno': {$regex: searchInput, $options: 'i'}},
                {'document.apMaterno': {$regex: searchInput, $options: 'i'}},
                {'document.ci': {$regex: searchInput, $options: 'i'}},
                {'cargos.name': {$regex: searchInput, $options: 'i'}},
                {'document.celular': {$regex: searchInput, $options: 'i'}},
                {'document.estado': {$regex: searchInput, $options: 'i'}},
                {'oficinas.nombre': {$regex: searchInput, $options: 'i'}},
            ]}},
        ])

        User.aggregatePaginate(query, {
            limit: 5,
            page: req.query.pageNumber ?? 1
        })
        .then(activos => {
            activos.docs = activos.docs.map(item => item.document)
            return res.json(activos)
        })
        .catch(err => res.status(404).json({ noactivosfound: 'Usuarios no encontrados' }))
})

// @route GET api/users/
// @description get all user
router.get('/all', async(req, res) => {
    User.aggregatePaginate({}, {
        limit: 5,
        page: req.query.pageNumber ?? 0
    })
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nousersfound: 'Usuarios no encontrados'}))    
})


// @route GET api/users/:id
// @description get single user by id
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json({ nousersfound: 'Usuario no encontrado'}))    
})

// @route POST api/users
// @description add/save a user
router.post('/', async (req, res) => {
    // Hashing the passwords
    
    const {username, password: plainTxtPassword, role, nombre, apPaterno, apMaterno, ci, cargo, email, celular, estado, oficinaId} = req.body

    // Conditions

    if(!nombre || typeof nombre !== 'string'){
        return res.json({status: 'error', error: 'Ingrese su Nombre'})
    }

    if(!apMaterno || typeof apMaterno !== 'string'){
        return res.json({status: 'error', error: 'Ingrese su Apellido Materno'})
    }

    if(!ci || typeof ci !== 'string'){
        return res.json({status: 'error', error: 'Ingrese su Ci'})
    }

    if(!oficinaId || typeof oficinaId !== 'string'){
        return res.json({status: 'error', error: 'Seleccione un Departamento por favor'})
    }

    if(!cargo || typeof cargo !== 'string'){
        return res.json({status: 'error', error: 'Seleccione su Cargo por favor'})
    }

    if(!role || typeof role !== 'string'){
        return res.json({status: 'error', error: 'Seleccione un rol por favor'})
    }

    if(!email || typeof email !== 'string'){
        return res.json({status: 'error', error: 'Ingrese su Email por favor'})
    }

    if(!celular || typeof celular !== 'string'){
        return res.json({status: 'error', error: 'Ingrese su nro de Celular por favor'})
    }

    if(!username || typeof username !== 'string'){
        return res.json({status: 'error', error: 'Ingrese su Nombre de Usuario por favor'})
    }

    if(!username.match(/^[a-z][^\W_]{3,14}$/i)){
        return res.json({status: 'error', error: 'Nombre de Usuario no Valido'})
    }

    if(!plainTxtPassword || typeof plainTxtPassword !== 'string'){
        return res.json({status: 'error', error: `Password no valido`})
    }
    
    if(!plainTxtPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
        return res.json({status: 'error', error: 'Contraseña Invalida, Debe tener al menos 8 caracteres, al menos una letra y al menos un numero'})
    }


    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Invalido o Nulo'})
    }

    /*if(!apPaterno || typeof apPaterno !== 'string'){
        return res.json({status: 'error', error: 'Apellido Paterno invalido o nulo'})
    }*/

    

    
    
    const password = await bcrypt.hash(plainTxtPassword, 10)

    User.create({username, password, role, nombre, apPaterno, apMaterno, ci, cargo, email, celular, estado, oficinaId})
        .then(user => res.json({msg: 'User added Successfully'}))
        .catch(err => res.json({error: err.code, errmsg: err.message}))
        // .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id', async(req, res) => {
    // Hashing the passwords
    
    const {username, password: plainTxtPassword, role, nombre, apPaterno, apMaterno, ci, cargo, email, celular, estado, oficinaId} = req.body

    // Conditions
    // if(!username || typeof username !== 'string'){
    //     return res.json({status: 'error', error: 'Nombre de Usuario No Valido o Nulo'})
    // }

    if(!nombre || typeof nombre !== 'string'){
        return res.json({status: 'error', error: 'Nombre Invalido o Nulo'})
    }

    /*if(!apPaterno || typeof apPaterno !== 'string'){
        return res.json({status: 'error', error: 'Apellido Paterno invalido o nulo'})
    }*/

    if(!apMaterno || typeof apMaterno !== 'string'){
        return res.json({status: 'error', error: 'Apellido Materno invalido o nulo'})
    }

    if(!ci || typeof ci !== 'string'){
        return res.json({status: 'error', error: 'Ci invalido o nulo'})
    }

    if(!oficinaId || typeof oficinaId !== 'string'){
        return res.json({status: 'error', error: 'Escoga una oficina por favor'})
    }

    if(!cargo || typeof cargo !== 'string'){
        return res.json({status: 'error', error: 'cargo invalido o nulo'})
    }

    if(!role || typeof role !== 'string'){
        return res.json({status: 'error', error: 'Escoja un rol por favor'})
    }

    if(!email || typeof email !== 'string'){
        return res.json({status: 'error', error: 'Email Invalido o Nulo'})
    }

    if(!celular || typeof celular !== 'string'){
        return res.json({status: 'error', error: 'Celular Invalido o Nulo'})
    }

    if(!plainTxtPassword || typeof plainTxtPassword !== 'string'){
        return res.json({status: 'error', error: `Contraseña Invalida, Debe tener al menos 8 caracteres, al menos una letra minuscula y al menos un numero ${plainTxtPassword}`})
    }
    
    if(!plainTxtPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
            return res.json({status: 'error', error: 'Contraseña Invalida, Debe tener al menos 8 caracteres, al menos una letra y al menos un numero'})
        }
    

    if(!estado || typeof estado !== 'string'){
        return res.json({status: 'error', error: 'Estado Invalido o Nulo'})
    }

    // if(!username.match(/^[a-z][^\W_]{3,14}$/i)){
    //     return res.json({status: 'error', error: 'Nombre de Usuario no Valido'})
    // }
    

    const password = await bcrypt.hash(plainTxtPassword, 10)

    User.findByIdAndUpdate(req.params.id, {username, password, role, nombre, apPaterno, apMaterno, ci, cargo, email, celular, estado, oficinaId})
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos'}))    
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id/estado', async(req, res) => {
    // Hashing the passwords
    User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: err.message}))    
})



// @route DELETE api/users/:id
// @description delete a book by id
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({msg: 'User entry deleted successfully'}))
    .catch(err => res.status(404).json({ error: 'El Usuario no Existe'}))    
})

module.exports = router

