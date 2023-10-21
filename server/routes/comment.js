const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const { addComment } = require("../controllers/comment");

router.post("/addComment/:id", authentication, addComment);
module.exports = router;
