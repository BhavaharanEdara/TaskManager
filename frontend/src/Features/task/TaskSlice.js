import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TaskService from "./TaskService";

const initialState = {
    tasks : [],
    updateTask:null,
    isError : false,
    isLoading : false,
    isSucess : false,
    message :""
}

export const getAllTasks = createAsyncThunk("/api/allTasks", async(query,thunkAPI)=>{
    try{
        return await TaskService.getAllTasks(query)
    }
    catch(error){
        return thunkAPI.rejectWithValue(error); 
    }
});

export const deleteTask = createAsyncThunk("/api/SingleTask/delete", async(id,thunkAPI)=>{
    try{
        return await TaskService.deleteTask(id)
    }
    catch(error){
        return thunkAPI.rejectWithValue(error); 
    }
});

export const taskSlice = createSlice({
    name : "task",
    initialState : initialState,
    reducers:{
        setUpdateTask : (state,action)=>{
            state.updateTask = action.payload;
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(getAllTasks.pending, (state,action)=>{
            state.isLoading=true;
        }).addCase(getAllTasks.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSucess = true;
            state.tasks = action.payload;
        }).addCase(getAllTasks.rejected, (state, action)=>{
            state.isLoading=false;
            state.isError = true;
            state.isSucess = false;
            state.tasks = [];
        }).addCase(deleteTask.pending, (state,action)=>{
            state.isLoading=true;
        }).addCase(deleteTask.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSucess = true;
        }).addCase(deleteTask.rejected, (state, action)=>{
            state.isLoading=false;
            state.isError = true;
            state.isSucess = false;
        })
    }
})
export const { setUpdateTask} = taskSlice.actions;

export default taskSlice.reducer;
