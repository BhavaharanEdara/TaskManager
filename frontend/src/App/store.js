import { configureStore} from "@reduxjs/toolkit"
import taskReducer from '../Features/task/TaskSlice'
export const store = configureStore({
    reducer :{
        task:taskReducer
    },
})