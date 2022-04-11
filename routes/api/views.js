// routes/api/oficinas
const express = require('express')
const router = express.Router()

// Load Oficina model
const View = require('../../models/View');

// @route GET api/views/
// @description get all views
router.get('/', (req, res) => {
    View.find()
        .then(views => res.json(views))
        .catch(err => res.status(404).json({ norolesfound: 'Views no encontrados' }));
})

// @route GET api/views/:id
// @description get single view by id
router.get('/:id', (req, res) => {
    View.findById(req.params.id)
        .then(view => res.json(view))
        .catch(err => res.status(404).json({ nousersfound: 'View no encontrado' }))
})

// @route POST api/roles/
// @description add/save a View
router.post('/', async (req, res) => {
    const { name, isProtected } = req.body

    View.create({ name, isProtected })
        .then(view => res.json({ msg: 'View added Successfully' }))
        .catch(err => res.json({ error: err.code === 11000 ? 'View name already in use' : err.message }))
})

// @route PUT api/roles/:id
// @description update a oficina by id
router.put('/:id', (req, res) => {

    View.findByIdAndUpdate(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'Updated Succesfully' }))
        .catch(err => res.json({ error: 'No se pudo actualizar la base de datos' }))
})

// @route DELETE api/oficinas/:id
// @description delete a oficina by id
router.delete('/:id', (req, res) => {
    View.findByIdAndRemove(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'oficina entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router