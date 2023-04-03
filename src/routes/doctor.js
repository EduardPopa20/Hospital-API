const express = require("express");
const router = express.Router();
const doctor = require("../controllers/doctor");
const authMiddleware = require("../middlewares/auth");
const checkAccess = require("../middlewares/checkAccess");

router.route("/doctor").post(authMiddleware, checkAccess("createDoctor"), doctor.createDoctor);
router.route("/doctors").get(authMiddleware, checkAccess("getDoctors"), doctor.getAllDoctors);
router
  .route("/doctors/report")
  .get(authMiddleware, checkAccess("getDoctorsReport"), doctor.getDoctorsReport);
router
  .route("/doctor/:id")
  .get(authMiddleware, checkAccess("getDoctor"), doctor.getDoctorById)
  .patch(authMiddleware, checkAccess("updateDoctor"), doctor.updateDoctorById)
  .delete(authMiddleware, checkAccess("deleteDoctor"), doctor.deleteDoctorById);

module.exports = router;
