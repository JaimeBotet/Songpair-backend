require("dotenv").config();
const express = require("express");

const router = express.Router();

router.post("/near-people", (req, res) => {
	res.json({data: "ok", error: null})
});

module.exports = router;