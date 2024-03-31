const mongoose = require('mongoose');

// Getting the database URL from environment variables
const dbURL = process.env.dbURL;

// Function to establish connection with the MongoDB database
const dbConnect = ()=>{
    try{
        const connect = mongoose.connect(dbURL);
        console.log("Database connected sucessfully");
    }
    catch(error){
        console.log("error in db");
        throw new Error(error);
        
    }
}
module.exports = dbConnect;
