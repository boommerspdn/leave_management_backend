const express = require('express')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

const app = express()


app.get('/api/employee', async (req, res) => {
    const allEmployee = await prisma.employee.findMany({
        include: {
            dep: true,
            time_record: true,
            approval_docs: true
        }
    });

    res.json(allEmployee)
    console.log(allEmployee)
});

app.get('/api/approval', async (req, res) => {
    const allApproval = await prisma.approval_doc.findMany({
        select: {
            reason: true,
            type: {
              select: {
                type_name: true,
              },
            },
          },
    });

    res.json(allApproval)
    console.log(allApproval)
});




const server = app.listen(3000)