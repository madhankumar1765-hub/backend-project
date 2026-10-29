const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get(
  "/getAllUsers",
  authMiddleware,
  userController.getAllUsers
);

router.put(
  "/delete/:id",
  authMiddleware,
  userController.softDeleteUser
);

router.put(
  "/activate/:id",
  authMiddleware,
  userController.activateUser
);

router.post(
  "/profile/:id",
  authMiddleware,
  userController.addUserProfile
);

router.get(
  "/profile/:id",
  authMiddleware,
  userController.getUserProfile
);

router.put(
  "/profile/:id",
  authMiddleware,
  userController.updateUserProfile
);

router.delete(
  "/profile/:id",
  authMiddleware,
  userController.deleteUserProfile
);

module.exports = router;