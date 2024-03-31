const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['Pending', 'Completed', 'In Progress', 'Deployed', 'Deffered'],
    },
    priority:{
        type:String,
        required:true,
    },
    assignee:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date
    }

});

//Export the model
module.exports = mongoose.model('Task', taskSchema);