const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        username: username,
      },
    });

    bcrypt.compare(password, employee.password, function (err, result) {
      if (result == true) {
        const json = {
          emp_id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          dep_id: employee.dep_id,
          role: employee.role,
        };

        res.status(200).json(json);
        return;
      }

      res.status(400).json({ message: "Invalid username or password" });
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

module.exports = router;
