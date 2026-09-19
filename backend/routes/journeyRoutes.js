const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createJourney,
  getMyJourneys,
  getSingleJourney,
  updateJourney,
  deleteJourney,
} = require("../controllers/journeyController");

// =========================================================
// CREATE JOURNEY
// =========================================================

router.post("/", authMiddleware, createJourney);

// =========================================================
// GET MY JOURNEYS
// =========================================================

router.get("/", authMiddleware, getMyJourneys);

// =========================================================
// GET SINGLE JOURNEY
// =========================================================

router.get("/:id", authMiddleware, getSingleJourney);

// =========================================================
// UPDATE JOURNEY
// =========================================================

router.put("/:id", authMiddleware, updateJourney);

// =========================================================
// DELETE JOURNEY
// =========================================================

router.delete("/:id", authMiddleware, deleteJourney);

module.exports = router;
