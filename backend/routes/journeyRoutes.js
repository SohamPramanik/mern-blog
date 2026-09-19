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

// Create a new journey
router.post("/", authMiddleware, createJourney);

// Get my journeys
router.get("/", authMiddleware, getMyJourneys);

// Get a single journey with its moments
router.get("/:id", authMiddleware, getSingleJourney);

// Update journey
router.put("/:id", authMiddleware, updateJourney);

// Delete journey
router.delete("/:id", authMiddleware, deleteJourney);

module.exports = router;
