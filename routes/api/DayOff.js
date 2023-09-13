const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Create day off
router.post('/', async (req, res) => {
    const { name, startDate, endDate } = req.body;

    try {
        const createDayOff = await prisma.day_off.create({
            data: {
                name: name,
                start_date: new Date(startDate),
                end_date: new Date(endDate)
            },
        })

        res.status(201).json({ status: 200, message: 'Record has been created', createDayOff })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Create day offs
// router.post('/CreateMany', async (req, res) => {
//     const data = req.body.map((obj) => ({
//         name: obj.name,
//         start_date: new Date(obj.startDate),
//         end_date: new Date(obj.endDate)
//     }))


//     try {
//         const createDayOffs = await prisma.day_off.createMany({
//             data: data,
//         })

//         res.status(201).json({ status: 200, message: 'Records has been created', createDayOffs })
//     } catch (e) {
//         checkingValidationError(e, req, res)
//     }
// });

// Read all day offs
router.get('/', async (req, res) => {
    const allDayOffs = await prisma.day_off.findMany({
    });

    res.status(200).json(allDayOffs);
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
    const { name, startDate, endDate } = req.body;

    try {
        const editDayOff = await prisma.day_off.update({
            where: {
                id: id
            },
            data: {
                name: name || undefined,
                start_date: startDate ? new Date(startDate) : undefined,
                end_date: endDate ? new Date(endDate) : undefined
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