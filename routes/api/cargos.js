// routes/api/oficinas
const express = require('express')
const router = express.Router()

// Load Oficina model
const Cargo = require('../../models/Cargo');

// @route GET api/roles/
// @description get all user
router.get('/', (req, res) => {
    Cargo.find()
        .then(cargos => res.json(cargos))
        .catch(err => res.status(404).json({ noCargosFound: 'Cargos no encontrados' }));
})

// @route GET api/roles/
// @description get all user
router.get('/all', (req, res) => {
    Cargo.paginate({}, {
        limit: 5,
        page: req.query.pageNumber ?? 0
    })
    .then(cargos => res.json(cargos))
    .catch(err => res.status(404).json({ noCargosFound: 'Cargos no encontrados' }));
})

// @route GET api/roles/:id
// @description get single oficina by id
router.get('/:id', (req, res) => {
    Cargo.findById(req.params.id)
        .then(oficina => res.json(oficina))
        .catch(err => res.status(404).json({ noCargoFound: 'Cargo no encontrado' }))
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

    var number = await Cargo.findOne({}, {}, { sort: { '_id': -1 } })
        .then(oficina => {
            if (oficina === null) {
                return 1000;
            } else {
                return parseInt(oficina.code.split('-')[1]) + 1;
            }
        })

    code = code + "-" + number;


    Cargo.create({ name, code, status, number })
        .then(role => res.json({ msg: 'Role added Successfully', role: role  }))
        .catch(err => res.json({ error: err.code === 11000 ? 'Nombre de Usuario ya esta en uso' : err.message }))
})

// @route PUT api/roles/:id
// @description update a oficina by id
router.put('/:id', (req, res) => {
    Cargo.findByIdAndUpdate(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'Updated Succesfully' }))
        .catch(err => res.json({ error: 'No se pudo actualizar la base de datos' }))
})

// @route DELETE api/oficinas/:id
// @description delete a oficina by id
router.delete('/:id', (req, res) => {
    Cargo.findByIdAndRemove(req.params.id, req.body)
        .then(oficina => res.json({ msg: 'oficina entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'El Usuario no Existe' }))
})

module.exports = router