const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


// Create department
router.post('/', async (req, res) => {
    const { departmentName, headDep } = req.body;

    try {
        const createDepartment = await prisma.department.create({
            data: {
                dep_name: departmentName,
                head_dep: parseInt(headDep)
            },
        })

        res.status(201).json({ status: 201, message: 'Record has been created', createDepartment })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all departments
router.get('/', async (req, res) => {
    const allDepartment = await prisma.department.findMany({
    });

    res.status(200).json(allDepartment);
});

// Read single department
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleDepartment = await prisma.department.findUnique({
            where: {
                id: id
            },
        });

        if (singleDepartment == null) return res.status(404).json({ status: 404, msg: `no record with id of ${id}` })
        res.status(200).json(singleDepartment)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Update department info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { departmentName, headDep } = req.body;

    try {
        const editDepartment = await prisma.department.update({
            where: {
                id: id
            },
            data: {
                dep_name: departmentName,
                head_dep: parseInt(headDep)
            }
        })

        res.status(200).json({ status: 200, message: `Record id ${id} successfully updated`, editDepartment })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete department info
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const deleteSingleDepartment = await prisma.department.delete({
            where: {
                id: id
            },
        });

        res.status(200).json({ status: 200, message: `Record id ${id} successfully deleted` })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

module.exports = router;