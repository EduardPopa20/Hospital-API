const express = require("express");
const router = express.Router();
const treatment = require("../controllers/treatment");
const authMiddleware = require("../middlewares/auth");
const checkAccess = require("../middlewares/checkAccess");

router
  .route("/treatment/apply")
  .patch(authMiddleware, checkAccess("applyTreatment"), treatment.applyTreatment);
router
  .route("/treatments/applied/:id")
  .get(authMiddleware, checkAccess("getAppliedTreatments"), treatment.getAppliedTreatments);

router
  .route("/treatment")
  .post(authMiddleware, checkAccess("createTreatment"), treatment.createTreatment);
router
  .route("/treatment/:id")
  .delete(authMiddleware, checkAccess("deleteTreatment"), treatment.deleteTreatment);
router
  .route("/treatments")
  .get(authMiddleware, checkAccess("getAllTreatments"), treatment.getAllTreatments);
router
  .route("/treatments/:id")
  .get(authMiddleware, checkAccess("getPrescribedTreatments"), treatment.getPrescribedTreatments);
module.exports = router;
