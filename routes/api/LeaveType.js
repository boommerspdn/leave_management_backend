const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Create leave type
router.post('/', async (req, res) => {
    const { typeName, quantity } = req.body;

    try {
        const createLeaveType = await prisma.leave_type.create({
            data: {
                type_name: typeName,
                quantity: parseInt(quantity)
            },
        })

        res.status(201).json(createLeaveType)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all leave type
router.get('/', async (req, res) => {
    const allLeaveType = await prisma.leave_type.findMany({
    });

    res.status(200).json(allLeaveType);
});

// Read single leave type
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleLeaveType = await prisma.leave_type.findUnique({
            where: {
                id: id
            },
        });

        if (singleLeaveType == null) return res.status(404).json({ status: 404, msg: `no record with id of ${id}` })
        res.status(200).json(singleLeaveType)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Update leave type info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { typeName, quantity } = req.body;

    try {
        const editLeaveType = await prisma.leave_type.update({
            where: {
                id: id
            },
            data: {
                type_name: typeName || undefined,
                quantity: parseInt(quantity) || undefined
            },
        })

        res.status(200).json({ status: 200, message: `Record id ${id} successfully updated` })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete leave type info
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const deleteSingleLeaveType = await prisma.leave_type.delete({
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