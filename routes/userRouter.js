const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/signout", authController.signOut);
router.get("/all", authController.allUsers)



module.exports = router;