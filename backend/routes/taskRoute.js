const express = require('express');
const router = express.Router();

// Importing controller functions for task operations
const { getAllTasks, getATask, updateATask, deleteATask, createTask } = require('../controllers/taskController');

// Defining routes for different task operations
router.route('/allTasks').get(getAllTasks);
router.route('/CreateTask').post(createTask)
router.route('/SingleTask/:id').get(getATask).put(updateATask).delete(deleteATask);


// Exporting the router for use in the application
module.exports = router;