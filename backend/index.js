// Importing required modules
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;

// Importing middleware for parsing requests and setting up CORS
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");

// Importing database connection function and task routes
const dbConnect = require('./config/dbConnect');
const taskRoute = require('./routes/taskRoute');


// Setting up CORS middleware
app.use(cors());

// Connecting to the database
dbConnect();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// Routing for task-related APIs
app.use('/api/task', taskRoute);

// Starting the server
app.listen(PORT,()=>{
    console.log(`Server up at ${PORT}`);
});




