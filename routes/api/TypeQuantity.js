const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


// Create type quantity
router.post('/', async (req, res) => {
    const { typeId, yearId, quantity } = req.body;

    try {
        const createTypeQuantity = await prisma.type_quantity.create({
            data: {
                type_id: parseInt(typeId),
                year_id: parseInt(yearId),
                quantity: quantity ? parseInt(quantity) : 0 
            },
        })

        res.status(201).json({ status: 201, message: 'Record has been created', createTypeQuantity })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all type quantitys
router.get('/', async (req, res) => {
    const allTypeQuantity = await prisma.type_quantity.findMany({
        include: {
            year: true,
            type: true
        }
    });

    res.status(200).json(allTypeQuantity);
});

// Read single type quantity
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleTypeQuantity = await prisma.type_quantity.findUnique({
            where: {
                id: id
            },
            include: {
                year: true,
                type: true
            }
        });

        if (singleTypeQuantity == null) return res.status(404).json({ status: 404, msg: `no record with id of ${id}` })
        res.status(200).json(singleTypeQuantity)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Update type quantity info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { typeId, yearId, quantity } = req.body;

    try {
        const editTypeQuantity = await prisma.type_quantity.update({
            where: {
                id: id
            },
            data: {
                type_id: typeId ? parseInt(typeId) : undefined,
                year_id: yearId ? parseInt(yearId) : undefined,
                quantity: quantity ? parseInt(quantity) : undefined
            }
        })

        res.status(200).json({ status: 200, message: `Record id ${id} successfully updated`, editTypeQuantity })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete type quantity info
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