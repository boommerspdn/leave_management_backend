const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


// Create day off
router.post('/', async (req, res) => {
    const { serviceYear, dayAmount } = req.body;

    try {
        const createDayOff = await prisma.day_off.create({
            data: {
                service_year: parseInt(serviceYear),
                day_amount: parseInt(dayAmount)
            },
        })

        res.status(201).json({ status: 201, message: 'Record has been created', createDayOff })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all day offs
router.get('/', async (req, res) => {
    const allDayOff = await prisma.day_off.findMany({
    });

    res.status(200).json(allDayOff);
});

// Read single day off
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleDayOff = await prisma.day_off.findUnique({
            where: {
                id: id
            },
        });

        if (singleDayOff == null) return res.status(404).json({ status: 404, msg: `no record with id of ${id}` })
        res.status(200).json(singleDayOff)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Update day off info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { serviceYear, dayAmount } = req.body;

    try {
        const editDayOff = await prisma.day_off.update({
            where: {
                id: id
            },
            data: {
                service_year: serviceYear ? parseInt(serviceYear) : undefined,
                day_amount: dayAmount ? parseInt(dayAmount) : undefined,
            },
        })

        res.status(200).json({ status: 200, message: `Record id ${id} successfully updated`, editDayOff })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete day off info
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const deleteSingleDayOff = await prisma.day_off.delete({
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