const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { start_time, end_time } = req.body;

  try {
    const upsertWorkHour = await prisma.work_hour.upsert({
      where: {
        id: 1,
      },
      update: {
        start_time: start_time,
        end_time: end_time,
      },
      create: {
        id: 1,
        start_time: start_time,
        end_time: end_time,
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