const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const moment = require('moment')

const prisma = new PrismaClient()

// Function to calculate total hours for clock in and out
const calculateTotalHours = async (clockIn, clockOut, id) => {
    if (clockIn && clockOut) {
        var startTime = new moment(new Date(clockIn))
        var endTime = new moment(new Date(clockOut))
        var duration = moment.duration(endTime.diff(startTime))

        // console.log('do first function')
        return totalHours = duration.asHours()
    } else if (clockIn || clockOut) {
        var getClockInOutValue = await prisma.time_record.findUnique({
            where: {
                id: id
            },
            select: {
                clock_in: true,
                clock_out: true
            }
        })

        if (clockIn) {
            var clockOut = getClockInOutValue.clock_out
        } else {
            var clockIn = getClockInOutValue.clock_in
        }

        var startTime = new moment(new Date(clockIn))
        var endTime = new moment(new Date(clockOut))
        var duration = moment.duration(endTime.diff(startTime))

        // console.log('do second function')
        return totalHours = duration.asHours()
    } else {
        return undefined
    }
}

// Create clock in and out
router.post('/', async (req, res) => {
    const { empId, date, clockIn, clockOut } = req.body;

    try {
        const createTimeRecord = await prisma.time_record.create({
            data: {
                emp_id: parseInt(empId),
                date: new Date(date),
                clock_in: clockIn ? new Date(clockIn) : undefined,
                clock_out: clockOut ? new Date(clockOut) : undefined,
                total_hours: clockIn && clockOut ? await calculateTotalHours(clockIn, clockOut) : undefined
            },
        })

        res.status(201).json({ status: 201, message: 'Record has been created', createTimeRecord })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all clock in and out
router.get('/', async (req, res) => {
    const allTimeRecords = await prisma.time_record.findMany({
    });

    res.status(200).json(allTimeRecords);
});

// Read single clock in and out
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleTimeRecord = await prisma.time_record.findUnique({
            where: {
                id: id
            },
        });

        if (singleTimeRecord == null) return res.status(404).json({ status: 404, msg: `no record with id of ${id}` })
        res.status(200).json(singleTimeRecord)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Update clock in and out info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { empId, date, clockIn, clockOut } = req.body;

    try {
        const editTimeRecord = await prisma.time_record.update({
            where: {
                id: id
            },
            data: {
                emp_id: parseInt(empId) || undefined,
                date: date ? new Date(date) : undefined,
                clock_in: clockIn ? new Date(clockIn) : undefined,
                clock_out: clockOut ? new Date(clockOut) : undefined,
                total_hours: await calculateTotalHours(clockIn, clockOut, id) || undefined
            },
        })

        res.status(200).json({ status: 200, message: `Record id ${id} successfully updated`, editTimeRecord })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete clock in and out info
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const deleteSingleTimeRecord = await prisma.time_record.delete({
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