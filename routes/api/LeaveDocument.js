const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Create approval doc
router.post('/', async (req, res) => {
    const { empId, depId, typeId, startDate, endDate, reason, writtenPlace, backupContact, attachment, status } = req.body;

    try {
        const createApprovalDoc = await prisma.approval_doc.create({
            data: {
                emp_id: empId,
                dep_id: depId,
                type_id: typeId,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
                written_place: writtenPlace,
                backup_contact: backupContact,
                attachment: attachment,
                status: status
            },
        })

        res.status(201).json({ status: 200, message: 'Record has been created', createApprovalDoc })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all approval docs
router.get('/', async (req, res) => {
    const allApprovalDocs = await prisma.approval_doc.findMany({
    });

    res.status(200).json(allApprovalDocs);
});

// Read single approval doc
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleApprovalDoc = await prisma.approval_doc.findUnique({
            where: {
                id: id
            },
        });

        if (singleApprovalDoc == null) return res.status(404).json({ status: 404, msg: `no record with id of ${id}` })
        res.status(200).json(singleApprovalDoc)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Update approval doc info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { empId, depId, typeId, startDate, endDate, reason, writtenPlace, backupContact, attachment, status } = req.body;

    try {
        const editApprovalDoc = await prisma.approval_doc.update({
            where: {
                id: id
            },
            data: {
                emp_id: empId || undefined,
                dep_id: depId || undefined,
                type_id: typeId || undefined,
                start_date: new Date(startDate) || undefined,
                end_date: new Date(endDate),
                reason: reason || undefined,
                written_place: writtenPlace || undefined,
                backup_contact: backupContact || undefined,
                attachment: attachment || undefined,
                status: status || undefined
            },
        })

        res.status(200).json({ status: 200, message: `Record id ${id} successfully updated`, editApprovalDoc })
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete approval doc info
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const deleteSingleApprovalDoc = await prisma.approval_doc.delete({
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