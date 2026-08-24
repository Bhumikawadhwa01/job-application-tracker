const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

// GET all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// POST a new application
router.post("/", async (req, res) => {
  try {
    const application = await Application.create(req.body);

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create application",
      error: error.message,
    });
  }
});

// UPDATE application
router.put("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: "Failed to update application" });
  }
});

// DELETE application
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete application" });
  }
});
module.exports = router;
