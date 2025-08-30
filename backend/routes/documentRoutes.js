const express = require("express");
const  {createDoc, fetchDoc, updateDoc, deleteDoc} =require("../controllers/documentController")
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.post("/create",authorize,  createDoc);
router.get("/fetch", authorize, fetchDoc);
router.put("/update/:id",authorize,  updateDoc);
router.delete("/delete/:id", authorize, deleteDoc);

module.exports = router;