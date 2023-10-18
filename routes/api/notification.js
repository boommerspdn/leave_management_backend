const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const currentDate = new Date();
  const emp_id = parseInt(req.query.emp_id);
  const dep_id = parseInt(req.query.dep_id);

  try {
    const deparment_approver = await prisma.dep_appr.findFirst({
      where: {
        dep_id: dep_id,
        OR: [{ first_appr: emp_id }, { second_appr: emp_id }],
      },
    });

    if (!deparment_approver) {
      res.status(400).json({ message: "deparment approver not found" });
      return;
    }

    var isFirstAppr = false;
    if (deparment_approver.first_appr == emp_id) {
      isFirstAppr = true;
    }

    var pendingAmount = {};

    if (isFirstAppr) {
      pendingAmount = await prisma.approval_doc.aggregate({
        _count: {
          id: true,
        },
        where: {
          AND: {
            end_date: {
              gt: currentDate, // if the end date and time is greater than current date and time
            },
            status_first_appr: {
              contains: "pending",
            },
          },
        },
      });
    } else {
      pendingAmount = await prisma.approval_doc.aggregate({
        _count: {
          id: true,
        },
        where: {
          AND: {
            end_date: {
              gt: currentDate, // if the end date and time is greater than current date and time
            },
            status_second_appr: {
              contains: "pending",
            },
          },
        },
      });
    }

    res.status(200).json({
      pendingAmount,
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

module.exports = router;
