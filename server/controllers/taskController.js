const Task = require("../models/Task");

const createTask = async (req, res) => {
    console.log("in the create task controller")
  try {
    const { title, priority, status } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(404).json({ message: "user not found" });
    }

    const newTask = await Task.create({
      userId: req.user.id,
      title,
      priority,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "task created successfully",
      data: newTask,
    });
  } catch (err) {
    console.log("error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const task = await Task.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Hard delete
    await task.deleteOne();

    // ✅ Alternatively, for "soft delete", just update:
    // task.isDeleted = true;
    // await task.save();
    return res.status(200).json({
      success: true,
      message: "task deleted successfully",
    });
  } catch (err) {
    console.log("error:", error.message);
    res.status(500).json({
      success: false,
      message: "server error while deleting task",
      error: err.message,
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the task for this user
    let task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Update allowed fields
    const allowedUpdates = ["title", "priority", "status"];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    task.updatedAt = Date.now();
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating task",
      error: error.message,
    });
  }
};

const getAllTask = async (req, res) => {
  try {
    if (!req.user.id || !req.user) {
      return res.status(400).json({ messge: "user not found" });
    }

    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    if (!tasks) {
      return res.status(400).json({ message: "no task found" });
    }

    return res.status(200).json({
      success: true,
      message: "fetched all tasks successfully",
      data: tasks,
    });
  } catch (err) {
    console.error("Error getting all tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all tasks",
      error: error.message,
    });
  }
};

module.exports = { createTask, deleteTask, updateTask, getAllTask };
