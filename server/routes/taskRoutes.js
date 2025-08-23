const {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { authMiddleware } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/create-task", authMiddleware, createTask);
router.delete("/delete-task/:id", authMiddleware, deleteTask);
router.get("/get-tasks", authMiddleware, getAllTask);
router.put("/update-task/:id", authMiddleware, updateTask);

module.exports = router;
