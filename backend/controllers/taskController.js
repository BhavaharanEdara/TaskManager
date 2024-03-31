const Task = require('../models/taskModel');
const asyncHandler = require('express-async-handler'); 

// Handler function for creating a new task
const createTask = asyncHandler(async(req,res)=>{
    try{
        const task = await Task.create(req.body);
        res.json(task);
    }
    catch(error){
        throw new Error(error);
    }
});

// Handler function for retrieving all tasks with optional filtering and sorting
const getAllTasks = asyncHandler(async(req, res)=>{
    try{
        // Checking if the 'assignee' query parameter is provided and creating a regExp for filtering
        if(req.query.assignee){
            const regex = new RegExp(req.query.assignee, 'i');
            req.query.$or = [{assignee:regex}];
        }

        // Checking if the 'dateFrom' and 'dateTo' query parameter is provided and creating a filter for filtering over mongodb
        if(req.query.dateFrom && req.query.dateTo){
            req.query.$and = [    
                { startDate: { $gt: req.query.dateFrom } },
                { startDate: { $lt: req.query.dateTo } }
            ]
        }
        else if(req.query.dateFrom){
            req.query.startDate ={ $gt: req.query.dateFrom }
        }
        else if(req.query.dateTo){
            req.query.startDate ={ $lt: req.query.dateTo }
        }

        //removing unnecesary fields for filtering 
        const excludeFields = ["sort", "assignee", 'dateFrom','dateTo'];
        const queryObj = {...req.query};
        excludeFields.forEach((ele)=>{delete queryObj[ele]});

        //retriving tasks based on the queryOBj i.e the filtering section
        let tasks = await Task.find(queryObj);

        //sorting 
        if(req.query.sort){            
            tasks = tasks.sort((a, b) => {
                const sortKey = req.query.sort; // Determine the key to sort by from the query
                
                if (sortKey === 'priority') {
                  // Sort by priority if specified in the query
                  const priorityOrder = { P0: 0, P1: 1, P2: 2 }; // Define priority order
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                } else if (sortKey === 'startDate') {
                  // Sort by startDate if priority is not specified in the query
                  return a.startDate - b.startDate;
                } else {
                  // If sortKey is neither 'priority' nor 'startDate', maintain current order
                  return 0;
                }
              });;
        }
        res.json(tasks);

    }catch(error){
        throw new Error(error);
    }

})

// Handler function for retrieving a single task by ID
const getATask = asyncHandler(async(req, res)=>{
    try{
        const{id} = req.params;
        const getTask = await Task.findById({_id:id});
        res.json(getTask);
    }catch(error){
        throw new Error(error);
    }

})

// Handler function for deleting a task by ID
const deleteATask = asyncHandler(async(req, res)=>{

    try{
        const{id} = req.params;
        const deleteTask = await Task.findOneAndDelete({_id:id});
        res.json(deleteTask);
    }catch(error){
        throw new Error(error);
    }

})

// Handler function for updating a task by ID
const updateATask = asyncHandler(async(req, res)=>{
    try{
        const{id} = req.params;
        const updatedTask = await Task.findOneAndUpdate({_id:id},req.body,{new: true});
        res.json(updatedTask);
    }catch(error){
        throw new Error(error);
    }

})


module.exports = {
    createTask,
    getAllTasks,
    getATask,
    updateATask,
    deleteATask
}