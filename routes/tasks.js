const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.post("/", authMiddleware, async (req, res) => {
    const { title, description, status, deadline } = req.body;
    try {
        const task = new Task({
            userId: req.user,
            title,
            description,
            status,
            deadline,
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.patch("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: id, userId: req.user },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Task not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Task.findOneAndDelete({ _id: id, userId: req.user });
        if (!deleted) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
