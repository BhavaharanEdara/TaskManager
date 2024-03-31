import axios from "axios";

const url = 'http://localhost:4000/api'
const getAllTasks = async(query)=>{
    const response = await axios.get(`${url}/task/allTasks`, query);
    return response.data;
}

const deleteTask = async(id)=>{
    const response = await axios.delete(`${url}/task/SingleTask/${id}`);
    return response.data;
}
const TaskService = {getAllTasks,deleteTask}
export default TaskService