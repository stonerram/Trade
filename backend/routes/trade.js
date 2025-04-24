const express = require("express");
const { evaluateTrade } = require("../controllers/trade.js");

const router = express.Router();

// POST /api/trade/evaluate
router.post("/evaluate", evaluateTrade);

module.exports = router;