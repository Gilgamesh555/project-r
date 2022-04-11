// routes/api/oficinas
const express = require('express')
const router = express.Router()

// Load Oficina model
const Role = require('../../models/Role');
const RoleView = require('../../models/RoleView');
const View = require('../../models/View');

// @route GET api/roles/
// @description get all user
router.get('/', (req, res) => {
    Role.find()
        .then(roles => res.json(roles))
        .catch(err => res.status(404).json({ norolesfound: 'Roles no encontrados' }));
})

// @route GET api/roles/getWithNameViews
// @description get views by roleId and viewId
router.get('/getWithNameViews', async (req, res) => {
    const roleViews = await RoleView.find({ roleId: req.query.roleId }).lean();
    let newRoleViews = []

    for (let roleView of roleViews) {
        let viewName = await View.findOne({ _id: roleView.viewId});
        viewName = viewName.name;

        roleView.viewName = viewName;
        newRoleViews.push(roleView);
    }

    res.json(newRoleViews);
})

// @route GET api/roles/:id
// @description get single oficina by id
router.get('/:id', (req, res) => {
    Role.findById(req.params.id)
        .then(oficina => res.json(oficina))
        .catch(err => res.status(404).json({ nousersfound: 'Usuario no encontrado' }))
})

// @route POST api/roles/
// @description add/save a oficina
router.post('/', async (req, res) => {
    // Hashing the passwords

    const { name } = req.body;
    const status = 'activo';

    // Add code to Oficina
    var code = name.toLowerCase().substr(0, 3);
    var number = -1;

    var number = await Role.findOne({}, {}, { sort: { '_id': -1 } })
        .then(oficina => {
            if (oficina === null) {
                return 1000;
            } else {
                return oficina.number + 1;
            }
        })

    code = code + "-" + number;


    Role.create({ name, code, status, number })
        .then(role => res.json({ msg: 'Role added Successfully', role: role  }))
        .catch(err => res.json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : err.message }))
})

// @route PUT api/roles/:id
// @description update a oficina by id
router.put('/:id', (req, res) => {
    Role.findByIdAndUpdate(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'Updated Succesfully' }))
        .catch(err => res.json({ error: 'No se pudo actualizar la base de datos' }))
})

// @route DELETE api/oficinas/:id
// @description delete a oficina by id
router.delete('/:id', (req, res) => {
    Role.findByIdAndRemove(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'oficina entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router