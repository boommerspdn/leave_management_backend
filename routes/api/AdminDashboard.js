const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get amount of all employee, all [pending, approved, rejected] doc
router.get('/', async (req, res) => {
    const currentDate = new Date()

    try {
        const empCount = await prisma.employee.aggregate({
            _count: {
                id: true
            },
            where: {
                status: 'active'
            }
        })

        const pendingAmount = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    end_date: {
                        gt: currentDate // if the end date and time is greater than current date and time
                    },
                    status: {
                        contains: 'pending'
                    }
                }
            },
        })

        const approvedAmount = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    end_date: {
                        gt: currentDate // if the end date and time is greater than current date and time
                    },
                    status: {
                        contains: 'approved'
                    }
                }
            },
        })

        const rejectedAmount = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    end_date: {
                        gt: currentDate // if the end date and time is greater than current date and time
                    },
                    status: {
                        contains: 'rejected'
                    }
                }
            },
        })

        const todayAmount = await prisma.approval_doc.aggregate({
            _count: {
                id: true
            },
            where: {
                AND: {
                    start_date: {
                        lte: currentDate
                    },
                    end_date: {
                        gte: currentDate // if the end date and time is greater than current date and time ***** only count the day off that is not passed yet.
                    },
                    status: {
                        contains: 'approved'
                    }
                }
            },
        })


        res.status(200).json({ empCount, pendingAmount, approvedAmount, rejectedAmount, todayAmount })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});


module.exports = router;