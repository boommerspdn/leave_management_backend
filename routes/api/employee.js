const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create employee
router.post('/', async (req, res) => {
    const { firstName, lastName, department, birthDate, email, phone, gender, address, username, password, auth } = req.body;

    try {
        const createEmployee = await prisma.employee.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                dep_id: parseInt(department),
                birth_date: birthDate && new Date(birthDate),
                email: email,
                phone: phone,
                gender: gender,
                address: address,
                username: username,
                password: password,
                auth: auth ? parseInt(auth) : 0
            },
        })

        res.status(201).json(createEmployee)
    } catch (e) {
        checkingValidationError(e, req, res)
    }
});

// Read all employees
router.get('/', async (req, res) => {
    const allEmployee = await prisma.employee.findMany({
        include: {
            dep: true
        }
    });

    res.status(200).json(allEmployee);
});

// Read single employee
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const singleEmployee = await prisma.employee.findUnique({
            where: {
                id: id
            },
            include: {
                dep: true
            }
        });
        
        res.status(200).json(singleEmployee)
    } catch (e) {
        checkingValidationError(e, req, res)
    }

});

// Update employee info
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { firstName, lastName, department, birthDate, email, phone, gender, address, username, password, auth } = req.body;

    try {
        const editEmployee = await prisma.employee.update({
            where: {
                id: id
            },
            data: {
                first_name: firstName || undefined, 
                last_name: lastName || undefined,
                dep_id: department ? parseInt(department) : undefined,
                birth_date: birthDate ? new Date(birthDate) : undefined,
                email: email || undefined,
                phone: phone || undefined,
                gender: gender || undefined,
                address: address || undefined,
                username: username || undefined,
                password: password || undefined,
                auth: auth ? parseInt(auth) : undefined
            }
        })

        res.status(200).json({status: 200, message: `Record id ${id} successfully updated`})
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Delete employee info
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const deleteSingleEmployee = await prisma.employee.delete({
            where: {
                id: id
            },
        });

        res.status(200).json({status: 200, message: `Record id ${id} successfully deleted`})
    } catch (e) {
        checkingValidationError(e, req, res)
    }
})

// Edit employee info
module.exports = router;