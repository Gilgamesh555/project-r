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

    if(!user) {
        return res.json({status: 'error', error: 'Invalid Username or Password'})
    }

    if(await bcrypt.compare(password, user.password)) {
        //the username, password combination is successful

        const token = jwt.sign(
            {
                id: user._id, 
                username: user.username,
                role: user.role
            }, 
            JWTSECRET,
            {expiresIn: '1h'}
        )

        return res.json({status: 'ok', data: token})
    }

    return res.json({status: 'error', error: 'Invalid Username/Password'})
})

// @route GET api/users/
// @description get all user
router.get('/', (req, res) => {
    User.find()
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
    
    const {username, password: plainTxtPassword, role} = req.body

    // Conditions
    if(!username || typeof username !== 'string'){
        return res.json({status: 'error', error: 'Invalid username'})
    }
    if(!plainTxtPassword || typeof plainTxtPassword !== 'string'){
        return res.json({status: 'error', error: 'Invalid password'})
    }
    if(!role || typeof role !== 'string'){
        return res.json({status: 'error', error: 'Invalid role'})
    }
    if(!username.match(/^[a-z][^\W_]{3,14}$/i)){
        return res.json({status: 'error', error: 'Nombre de Usuario no Valido'})
    }
    if(!plainTxtPassword.match(/^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{3,20}$/)){
        return res.json({status: 'error', error: 'Contrasenia Invalida, Debe tener al menos 5 caracteres, al menos una letra minuscula y al menos un numero'})
    }

    const password = await bcrypt.hash(plainTxtPassword, 10)

    User.create({username, password, role})
        .then(user => res.json({msg: 'User added Successfully'}))
        .catch(err => res.status(404).json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : 'No se pudo crear el usuario error desconocido'}))    
})

// @route PUT api/users/:id
// @description update a book by id
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'Updated Succesfully'}))
        .catch(err => res.status(404).json({ error: 'No se pudo actualizar la base de datos'}))    
})

// @route DELETE api/users/:id
// @description delete a book by id
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({msg: 'User entry deleted successfully'}))
    .catch(err => res.status(404).json({ error: 'El Usuario no Existe'}))    
})

module.exports = router

