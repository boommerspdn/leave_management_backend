const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const moment = require('moment')

const prisma = new PrismaClient()

router.get('/:empId', async (req, res) => {
    const requestedEmployee = req.params.empId
    const currentDate = new Date()

    try {

        // Get day off left
        const employedDate = await prisma.employee.findUnique({
            where: {
                id: parseInt(requestedEmployee),
            },
            select: {
                date_employed: true
            }
        })

        var serviceYear = moment().diff(employedDate.date_employed, 'years');

        const dayOffs = await prisma.day_off.findMany()

        const allDayOff = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    emp_id: parseInt(requestedEmployee),
                    status: 'approved'
                }
            }
        })

        const dayOffAmount = dayOffs.filter((dayOff) => {
            return dayOff.service_year == serviceYear
        }).map((item) => {
            return item.day_amount
        })

        const dayOffLeft = parseInt(dayOffAmount) - allDayOff._count.id

        // Get count of pending day off

        const pendingDayOff = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    emp_id: parseInt(requestedEmployee),
                    end_date: {
                        gt: currentDate // if the end date and time is greater than current date and time
                    },
                    status: 'pending'
                }
            },
        })

        const approvedDayOff = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    emp_id: parseInt(requestedEmployee),
                    end_date: {
                        gt: currentDate // if the end date and time is greater than current date and time
                    },
                    status: 'approved'
                }
            },
        })

        const rejectedDayOff = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    emp_id: parseInt(requestedEmployee),
                    end_date: {
                        gt: currentDate // if the end date and time is greater than current date and time
                    },
                    status: 'rejected'
                }
            },
        })


        res.status(200).json({ status: 200, dayOffLeft: dayOffLeft, pendingDayOff, approvedDayOff, rejectedDayOff })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});



module.exports = router;