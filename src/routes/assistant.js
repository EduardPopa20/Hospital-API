const express = require("express");
const router = express.Router();
const assistant = require("../controllers/assistant");
const authMiddleware = require("../middlewares/auth");
const checkAccess = require("../middlewares/checkAccess");

router
  .route("/assistant")
  .post(authMiddleware, checkAccess("createAssistant"), assistant.createAssistant);
router
  .route("/assistants")
  .get(authMiddleware, checkAccess("getAssistants"), assistant.getAllAssistants);
router
  .route("/assistant/:id")
  .get(authMiddleware, checkAccess("getAssistant"), assistant.getAssistantById)
  .patch(authMiddleware, checkAccess("updateAssistant"), assistant.updateAssistantById)
  .delete(authMiddleware, checkAccess("deleteAssistant"), assistant.deleteAssistantById);

module.exports = router;
