const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const moment = require("moment");

const prisma = new PrismaClient();

router.get("/:empId", async (req, res) => {
  const requestedEmployee = req.params.empId;
  const currentDate = new Date();

  try {
    // Get leave amount left
    const employedDate = await prisma.employee.findUnique({
      where: {
        id: parseInt(requestedEmployee),
      },
      select: {
        date_employed: true,
      },
    });

    var serviceYear = moment().diff(employedDate.date_employed, "years");

    const allLeave = await prisma.approval_doc.aggregate({
      _count: {
        id: true,
      },
      where: {
        emp_id: parseInt(requestedEmployee),
        OR: [{ status: "pending" }, { status: "approved" }],
      },
    });

    const allLeaveType = await prisma.leave_type.findMany({
      include: {
        type_quantity: true,
      },
    });

    const allYearQnty = new Array();
    allLeaveType.map((item) => {
      item.type_quantity.map((item) => {
        allYearQnty.push(item.year);
      });
    });
    const maxYear = Math.max(...allYearQnty);

    const leaveQnty = new Array();
    const allLeaveQnty = new Object();

    allLeaveType.map(async (type) => {
      const leaveCount = await prisma.approval_doc.aggregate({
        _count: {
          id: true,
        },
        where: {
          emp_id: parseInt(requestedEmployee),
          type_id: type.id,
        },
      });

      if (type.type === "fixed") {
        leaveQnty.push(type.fixed_quota);

        allLeaveQnty[type.type_name] = type.fixed_quota - leaveCount._count.id;
      }
      if (type.type === "serviceYears") {
        type.type_quantity.map((syType) => {
          if (syType.year === serviceYear) {
            leaveQnty.push(syType.quantity);

            allLeaveQnty[type.type_name] =
              syType.quantity - leaveCount._count.id;
          } else if (serviceYear > maxYear) {
            if (syType.year === maxYear) {
              leaveQnty.push(syType.quantity);

              allLeaveQnty[type.type_name] =
                syType.quantity - leaveCount._count.id;
            }
          }
        });
      }
    });

    allLeaveType.map((type) => {
      if (type.type === "fixed") {
        leaveQnty.push(type.fixed_quota);
      }
      if (type.type === "serviceYears") {
        type.type_quantity.map((syType) => {
          if (syType.year === serviceYear) {
            leaveQnty.push(syType.quantity);
          } else if (serviceYear > maxYear) {
            if (syType.year === maxYear) {
              leaveQnty.push(syType.quantity);
            }
          }
        });
      }
    });

    const leaveQntyAmount = leaveQnty.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const leaveAvailableAmount = leaveQntyAmount - allLeave._count.id;

    // Get count of pending day off
    const pendingLeave = await prisma.approval_doc.aggregate({
      _count: {
        id: true,
      },
      where: {
        AND: {
          emp_id: parseInt(requestedEmployee),
          end_date: {
            gt: currentDate, // if the end date and time is greater than current date and time
          },
          status: "pending",
        },
      },
    });

    const pendingLeaveAmount = pendingLeave._count.id;

    // Get count of approved day off
    const approvedLeave = await prisma.approval_doc.aggregate({
      _count: {
        id: true,
      },
      where: {
        AND: {
          emp_id: parseInt(requestedEmployee),
          end_date: {
            gt: currentDate, // if the end date and time is greater than current date and time
          },
          status: "approved",
        },
      },
    });

    const approvedLeaveAmount = approvedLeave._count.id;

    // Get count of rejected day off
    const rejectedLeave = await prisma.approval_doc.aggregate({
      _count: {
        id: true,
      },
      where: {
        AND: {
          emp_id: parseInt(requestedEmployee),
          end_date: {
            gt: currentDate, // if the end date and time is greater than current date and time
          },
          status: "rejected",
        },
      },
    });

    const rejectedLeaveAmount = rejectedLeave._count.id;

    res.status(200).json({
      leaveAvailableAmount,
      allLeaveQnty,
      pendingLeaveAmount,
      approvedLeaveAmount,
      rejectedLeaveAmount,
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

module.exports = router;
