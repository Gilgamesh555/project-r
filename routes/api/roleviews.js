// routes/api/oficinas
const express = require('express')
const router = express.Router()

// Load Oficina model
const RoleView = require('../../models/RoleView');

// @route GET api/roleviews/
// @description get all views
router.get('/', (req, res) => {
    RoleView.find()
        .then(views => res.json(views))
        .catch(err => res.status(404).json({ norolesfound: 'Views no encontrados' }));
})

// @route GET api/views/find
// @description get views by roleId and viewId
router.get('/find', (req, res) => {
    RoleView.findOne({roleId: req.query.roleId, viewId: req.query.viewId})
        .then(views => res.json(views))
        .catch(err => res.status(404).json({ nousersfound: 'Views no encontrado' }))
})

// @route GET api/views/:id
// @description get single view by id
router.get('/:id', (req, res) => {
    RoleView.findById(req.params.id)
        .then(view => res.json(view))
        .catch(err => res.status(404).json({ nousersfound: 'View no encontrado' }))
})

// @route POST api/roles/
// @description add/save a View
router.post('/', async (req, res) => {
    const { 
        roleId,
        viewId,
        isVisible,
        isEditable,
        isDeletable,
        isAddble 
    } = req.body

    RoleView.create({ 
        roleId,
        viewId,
        isVisible,
        isEditable,
        isDeletable,
        isAddble 
    })
        .then(role => res.json({ msg: 'RoleView added Successfully'}))
        .catch(err => res.json({ error: err.code === 11000 ? 'RoleView code match already in use' : err.message }))
})

// @route PUT api/roleviws/:id
// @description update a roleview by id
router.put('/:id', (req, res) => {
    RoleView.findByIdAndUpdate(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'Updated Succesfully' }))
        .catch(err => res.json({ error: 'No se pudo actualizar la base de datos' }))
})

// @route DELETE api/oficinas/:id
// @description delete a oficina by id
router.delete('/:id', (req, res) => {
    RoleView.findByIdAndRemove(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'oficina entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router