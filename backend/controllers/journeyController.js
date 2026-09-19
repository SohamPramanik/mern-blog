const Journey = require("../models/Journey");
const Post = require("../models/Post");

// =========================================================
// CREATE JOURNEY
// =========================================================

const createJourney = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Journey title is required.",
      });
    }

    const journey = await Journey.create({
      title: title.trim(),
      description: description?.trim() || "",
      owner: req.user,
    });

    res.status(201).json({
      message: "Journey created successfully.",
      journey,
    });
  } catch (error) {
    console.error("CREATE JOURNEY ERROR:", error);

    res.status(500).json({
      message: "Failed to create journey.",
    });
  }
};

// =========================================================
// GET MY JOURNEYS
// =========================================================

const getMyJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({
      owner: req.user,
    })
      .sort({ createdAt: -1 })
      .lean();

    const journeysWithCounts = await Promise.all(
      journeys.map(async (journey) => {
        const momentCount = await Post.countDocuments({
          journey: journey._id,
        });

        return {
          ...journey,
          momentCount,
        };
      }),
    );

    res.json(journeysWithCounts);
  } catch (error) {
    console.error("GET JOURNEYS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch journeys.",
    });
  }
};

// =========================================================
// GET SINGLE JOURNEY
// =========================================================

const getSingleJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
      .populate("owner", "username avatar bio")
      .lean();

    if (!journey) {
      return res.status(404).json({
        message: "Journey not found.",
      });
    }

    const moments = await Post.find({
      journey: journey._id,
    })
      .populate("author", "username avatar")
      .sort({ createdAt: 1 })
      .lean();

    const visibleMoments = moments.filter((moment) => {
      if (moment.privacy === "public") {
        return true;
      }

      if (
        moment.privacy === "private" &&
        String(journey.owner._id) === String(req.user)
      ) {
        return true;
      }

      return false;
    });

    res.json({
      journey,
      moments: visibleMoments,
    });
  } catch (error) {
    console.error("GET JOURNEY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch journey.",
    });
  }
};

// =========================================================
// UPDATE JOURNEY
// =========================================================

const updateJourney = async (req, res) => {
  try {
    const journey = await Journey.findOne({
      _id: req.params.id,
      owner: req.user,
    });

    if (!journey) {
      return res.status(404).json({
        message: "Journey not found or unauthorized.",
      });
    }

    if (req.body.title !== undefined) {
      journey.title = req.body.title.trim();
    }

    if (req.body.description !== undefined) {
      journey.description = req.body.description.trim();
    }

    if (req.body.isPublic !== undefined) {
      journey.isPublic = req.body.isPublic;
    }

    await journey.save();

    res.json({
      message: "Journey updated successfully.",
      journey,
    });
  } catch (error) {
    console.error("UPDATE JOURNEY ERROR:", error);

    res.status(500).json({
      message: "Failed to update journey.",
    });
  }
};

// =========================================================
// DELETE JOURNEY
// =========================================================

const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findOne({
      _id: req.params.id,
      owner: req.user,
    });

    if (!journey) {
      return res.status(404).json({
        message: "Journey not found or unauthorized.",
      });
    }

    /*
      Moments are NOT deleted automatically.
      They become standalone moments.
    */

    await Post.updateMany(
      {
        journey: journey._id,
      },
      {
        $set: {
          journey: null,
          isStandalone: true,
        },
      },
    );

    await journey.deleteOne();

    res.json({
      message: "Journey deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE JOURNEY ERROR:", error);

    res.status(500).json({
      message: "Failed to delete journey.",
    });
  }
};

module.exports = {
  createJourney,
  getMyJourneys,
  getSingleJourney,
  updateJourney,
  deleteJourney,
};
