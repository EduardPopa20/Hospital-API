const express = require("express");
const router = express.Router();
const patient = require("../controllers/patient");
const authMiddleware = require("../middlewares/auth");
const checkAccess = require("../middlewares/checkAccess");

router
  .route("/patient/assistant/associate")
  .patch(
    authMiddleware,
    checkAccess("associatePatientToAssistant"),
    patient.associatePatientToAssistant
  );
router
  .route("/patient/assistant/disassociate")
  .patch(
    authMiddleware,
    checkAccess("disassociatePatientFromAssistant"),
    patient.disassociatePatientFromAssistant
  );
router
  .route("/patient/doctor/associate")
  .patch(authMiddleware, checkAccess("associatePatientToDoctor"), patient.associatePatientToDoctor);
router
  .route("/patient/doctor/disassociate")
  .patch(
    authMiddleware,
    checkAccess("disassociatePatientFromDoctor"),
    patient.disassociatePatientFromDoctor
  );
router.route("/patient").post(authMiddleware, checkAccess("createPatient"), patient.createPatient);
router
  .route("/patient/:id")
  .get(authMiddleware, checkAccess("getPatient"), patient.getPatientById)
  .patch(authMiddleware, checkAccess("updatePatient"), patient.updatePatientById)
  .delete(authMiddleware, checkAccess("deletePatient"), patient.deletePatientById);

router
  .route("/patients/assigned/:id?")
  .get(authMiddleware, checkAccess("getAssignedPatients"), patient.getAssignedPatients);

router.route("/patients").get(authMiddleware, checkAccess("getPatients"), patient.getAllPatients);

module.exports = router;
