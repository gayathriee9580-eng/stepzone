const express = require("express");
const router = express.Router();

const { testAPI } = require("../controllers/testController");

// GET route
router.get("/test", testAPI);

// POST route
router.post("/test", testAPI);

module.exports = router;
