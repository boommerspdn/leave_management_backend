const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = require("../../client");

router.post("/", async (req, res) => {
  const { start_time, end_time } = req.body;

  const startTime = new Date(0);
  const endTime = new Date(0);

  const startHour = parseInt(start_time.slice(0, 2));
  const startMinute = parseInt(start_time.slice(3, 4));

  const endHour = parseInt(end_time.slice(0, 2));
  const endMinute = parseInt(end_time.slice(3, 4));

  console.log(start_time);
  console.log(end_time);

  console.log(startHour);
  console.log(startMinute);
  console.log(endHour);
  console.log(endMinute);

  startTime.setHours(startHour, startMinute);
  endTime.setHours(endHour, endMinute);

  try {
    const upsertWorkHour = await prisma.work_hour.upsert({
      where: {
        id: 1,
      },
      update: {
        start_time: startTime,
        end_time: endTime,
      },
      create: {
        id: 1,
        start_time: startTime,
        end_time: endTime,
      },
    });

    res.status(200).json(upsertWorkHour);
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const workHour = await prisma.work_hour.findUnique({
      where: {
        id: 1,
      },
    });

    res.status(200).json(workHour);
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

module.exports = router;
