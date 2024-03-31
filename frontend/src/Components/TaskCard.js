import React, { useState } from 'react'
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RxCrossCircled } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks, setUpdateTask } from '../Features/task/TaskSlice';
import axios from 'axios';

function TaskCard(props) {
    const {title,description,status,priority,startDate,assignee} = props;
    const date = new Date(startDate);
    const [confirmDelete,setConfirmDelete] = useState(false);
    let colour = 'gray';
    const dispatch = useDispatch();
    const handleDelete=async(id)=>{
        const response = await axios.delete(`http://localhost:4000/api/task/SingleTask/${id}`);
        setConfirmDelete(false);
        dispatch(getAllTasks())
    };
    const updateTask = useSelector((state)=>{
        return state.task.updateTask;
    });
    if(status==='Completed'){
        colour = 'green';
    }
    else if(status==='In Progress'){
        colour = 'orange';
    }
    else if(status==='Deployed'){
        colour = 'blue';
    }
    else if(status==='Deffered'){
        colour = 'red';
    }
  return (
    <div className={` py-2 bg-white ${!props.column ? ' lg:min-w-[23.5%] lg:w-[23.5%] xl:w-[23.8%] 2xl:w-[18.9%] xl:min-w-[23.8%] 2xl:min-w-[18.9%] px-4' : 'w-full xl:px-4 px-2'}  h-52 rounded-md shadow-lg`}>
        
        {/**Delete Task Window*/}
        
        <div className={`${confirmDelete ?'fixed':'hidden'} bg-black bg-opacity-20 w-screen h-screen top-0 left-0 flex justify-center items-center`}>
            <div className='w-[30%] rounded-md bg-white'>
                <div className='px-2 py-2 flex items-center justify-between w-full border-b-2 border-gray-300 mb-2'>
                    <h1 className="text-lg font-semibold ">DELETE TASK</h1>
                    <RxCrossCircled className="text-xl hover:cursor-pointer" onClick={()=>setConfirmDelete(false)}/>
                </div>
                <h1 className='px-4 text-center'>Do you want to delete this task ?</h1>
                <div className='flex gap-2 px-4 pt-4 pb-2 my-2 items-center justify-center'>
                    <h1 className='mr-4 font-semibold'>{title}</h1>
                    <p className='ml-4 text-sm text-white bg-blue-500 font-semibold rounded px-2 p-1 hover:cursor-pointer' onClick={()=>{handleDelete(props._id)}}>Yes</p>
                    <p className='ml-4 text-sm text-white bg-blue-500 font-semibold rounded px-2 p-1 hover:cursor-pointer' onClick={()=>setConfirmDelete(false)}>No</p>
                </div>

            </div>
        </div>

        <div className='flex items-center justify-between pb-2 '>
            <h1 className='font-semibold overflow-hidden h-6'>{title}</h1>
            <p className=' text-xs bg-blue-500 text-white w-fit font-semibold px-1'>{priority}</p>
        </div>
        <p className='text-xs h-20 overflow-hidden'>{description}</p>
        <div className='flex font-semibold text-xs xl:text-sm justify-between pt-4'>
            <p>{date.getDate()}/{date.getMonth()}/{date.getFullYear()}</p>
            <p>@{assignee}</p>
        </div>
        <div className='flex justify-between pt-1 items-center pb-2'>
            <h1 style={{backgroundColor:colour}} className={`px-2 py-1 xl:px-4 xl:py-2 font-semibold text-white w-fill text-center text-xs xl:text-sm ${props.column==1 ? 'rounded-md' : "rounded-full"} xl:rounded-full`}>{status}</h1>
            <div className='flex gap-2 items-center'>
                <MdEditSquare className='text-green-500 text-lg xl:text-xl hover:cursor-pointer' onClick={()=>{dispatch(setUpdateTask(props));}}/>
                <MdDelete className='text-red-500 text-lg xl:text-xl hover:cursor-pointer' onClick={()=>{setConfirmDelete(true)}}/>
            </div>
        </div>
      
    </div>
  )
}

export default TaskCard
