const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const calculateDayAmount = async (_startDate, _endDate, id) => {
  if (_startDate && _endDate) {
    const startDate = new Date(_startDate);
    const endDate = new Date(_endDate);

    return (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24 + 1;
  } else {
    const dates = await prisma.approval_doc.findUnique({
      where: {
        id: id,
      },
      select: {
        start_date: true,
        end_date: true,
      },
    });

    if (_startDate) {
      const startDate = new Date(_startDate);
      const endDate = new Date(dates.end_date);

      return (
        (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24 + 1
      );
    } else {
      const startDate = new Date(dates.start_date);
      const endDate = new Date(_endDate);

      return (
        (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24 + 1
      );
    }
  }
};

async function updateStatus(id) {
  try {
    const getApprovalDoc = await prisma.approval_doc.findUnique({
      where: { id: id },
    });

    var status = "pending";
    const status_first_appr = getApprovalDoc.status_first_appr;
    const status_second_appr = getApprovalDoc.status_second_appr;

    if (!status_first_appr && !status_second_appr) {
      status = "approved";
    } else if (status_second_appr == null) {
      status = status_first_appr;
    } else {
      if (status_first_appr == "approved" && status_second_appr == "approved") {
        status = "approved";
      } else if (
        status_first_appr == "rejected" ||
        status_second_appr == "rejected"
      ) {
        status = "rejected";
      }
    }

    const editApprovalDoc = await prisma.approval_doc.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
}

// Create approval doc
router.post("/", upload.single("attachment"), async (req, res) => {
  const {
    empId,
    depId,
    typeId,
    startDate,
    endDate,
    reason,
    writtenPlace,
    backupContact,
  } = req.body;

  const attachment = path.join(req.file.destination, req.file.filename);
  var status = "pending";

  try {
    const deparment_approver = await prisma.dep_appr.findUnique({
      where: {
        dep_id: parseInt(depId),
      },
    });

    if (!deparment_approver.first_appr && !deparment_approver.second_appr) {
      status = "approved";
    }

    const createApprovalDoc = await prisma.approval_doc.create({
      data: {
        emp_id: parseInt(empId),
        dep_id: parseInt(depId),
        type_id: parseInt(typeId),
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        amount: await calculateDayAmount(startDate, endDate),
        reason: reason,
        written_place: writtenPlace,
        backup_contact: backupContact,
        attachment: attachment,
        status: status,
        status_first_appr: deparment_approver.first_appr ? "pending" : null,
        status_second_appr: deparment_approver.second_appr ? "pending" : null,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Record has been created",
      createApprovalDoc,
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

// Read all approval docs
router.get("/", async (req, res) => {
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

    const allApprovalDocs = await prisma.approval_doc.findMany({
      include: {
        emp: true,
        dep: true,
        type: true,
      },
    });

    if (deparment_approver.first_appr == emp_id) {
      for (const approvalDoc of allApprovalDocs) {
        approvalDoc.status = approvalDoc.status_first_appr;
      }
    } else {
      for (const approvalDoc of allApprovalDocs) {
        approvalDoc.status = approvalDoc.status_second_appr;
      }
    }

    res.status(200).json(allApprovalDocs);
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

router.get("/employee/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const allApprovalDocs = await prisma.approval_doc.findMany({
      where: {
        emp_id: id,
      },
      include: {
        emp: true,
        dep: true,
        type: true,
      },
    });

    res.status(200).json(allApprovalDocs);
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

// Read single approval doc
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const singleApprovalDoc = await prisma.approval_doc.findUnique({
      where: {
        id: id,
      },
    });

    if (singleApprovalDoc == null)
      return res
        .status(404)
        .json({ status: 404, msg: `no record with id of ${id}` });
    res.status(200).json(singleApprovalDoc);
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

// Update approval doc info
router.put("/:id", upload.single("attachment"), async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    empId,
    depId,
    typeId,
    startDate,
    endDate,
    reason,
    writtenPlace,
    backupContact,
    status,
  } = req.body;

  const attachment = path.join(req.file.destination, req.file.filename);

  try {
    const editApprovalDoc = await prisma.approval_doc.update({
      where: {
        id: id,
      },
      data: {
        emp_id: empId ? parseInt(empId) : undefined,
        dep_id: depId ? parseInt(depId) : undefined,
        type_id: typeId ? parseInt(typeId) : undefined,
        start_date: startDate ? new Date(startDate) : undefined,
        end_date: endDate ? new Date(endDate) : undefined,
        amount:
          startDate || endDate
            ? await calculateDayAmount(startDate, endDate, id)
            : undefined,
        reason: reason || undefined,
        written_place: writtenPlace || undefined,
        backup_contact: backupContact || undefined,
        attachment: attachment || undefined,
        status: status || undefined,
      },
    });

    res.status(200).json({
      status: 200,
      message: `Record id ${id} successfully updated`,
      editApprovalDoc,
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

router.put("/status/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const emp_id = parseInt(req.query.emp_id);
  const dep_id = parseInt(req.query.dep_id);

  const { status } = req.body;

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

    const editApprovalDoc = await prisma.approval_doc.update({
      where: {
        id: id,
      },
      data: {
        status_first_appr: isFirstAppr ? status : undefined,
        status_second_appr: !isFirstAppr ? status : undefined,
      },
    });

    updateStatus(id);

    res.status(200).json({
      status: 200,
      message: `Record id ${id} successfully updated`,
      editApprovalDoc,
    });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

// Delete approval doc info
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const deleteSingleApprovalDoc = await prisma.approval_doc.delete({
      where: {
        id: id,
      },
    });

    res
      .status(200)
      .json({ status: 200, message: `Record id ${id} successfully deleted` });
  } catch (e) {
    checkingValidationError(e, req, res);
  }
});

module.exports = router;
