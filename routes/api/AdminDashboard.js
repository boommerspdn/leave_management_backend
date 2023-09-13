const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.get('/', async (req, res) => {
    const currentDateWithoutTime = new Date()
    currentDateWithoutTime.setHours(24, 0, 0, 0);

    try {
        const adminDashboard = await prisma.employee.aggregate({
            _count: {
                id: true
            },
            where: {
                status: 'active'
            }
        })

        const employeeApprovedDayOffAmount = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    end_date: {
                        gte: new Date()
                    },
                    status: {
                        contains: 'approved'
                    }
                }
            },
        })

        console.log(currentDateWithoutTime)
        res.status(200).json({ emp_count: adminDashboard, approved_dayoff: employeeApprovedDayOffAmount })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});


module.exports = router;