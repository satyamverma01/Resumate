const express = require("express");
const { singup, login, logout } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", singup);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
