import React, { useState } from 'react'
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RxCrossCircled } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks, setUpdateTask } from '../Features/task/TaskSlice';
import axios from 'axios';
import { IoIosArrowDown, IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io';

function TaskMobileCard(props) {
    const { title, description, status, priority, startDate, assignee } = props;
    const date = new Date(startDate);
    // State variables
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    let colour = 'gray';
    const dispatch = useDispatch();

    const handleDelete = async (id) => {
        const response = await axios.delete(`http://localhost:4000/api/task/SingleTask/${id}`);
        setConfirmDelete(false);
        dispatch(getAllTasks())
    };


    const updateTask = useSelector((state) => {
        return state.task.updateTask;
    });


    if (status === 'Completed') {
        colour = 'green';
    }
    else if (status === 'In Progress') {
        colour = 'orange';
    }
    else if (status === 'Deployed') {
        colour = 'blue';
    }
    else if (status === 'Deffered') {
        colour = 'red';
    }

    return (
        <div className={` my-2  bg-white ${!props.column ? 'lg:w-[23.5%] xl:w-[23.8%] 2xl:w-[18.9%] px-4' : 'w-full xl:px-4 px-2'} rounded-md shadow-lg`}>
            <div className={`${confirmDelete ? 'fixed' : 'hidden'} bg-black bg-opacity-20 w-screen h-screen top-0 left-0 flex justify-center items-center`}>
                <div className='min-w-72 w-[50%] rounded-md bg-white'>
                    <div className='px-5 py-2 flex items-center justify-between w-full border-b-2 border-gray-300 mb-2'>
                        <h1 className="text-lg font-semibold ">DELETE TASK</h1>
                        <RxCrossCircled className="text-xl hover:cursor-pointer" onClick={() => setConfirmDelete(false)} />
                    </div>
                    <h1 className='px-4 text-center'>Do you want to delete this task ?</h1>
                    <div className='flex gap-2 px-4 pt-4 pb-2 my-2 items-center justify-center'>
                        <h1 className='mr-4 font-semibold h-6 overflow-hidden'>{title}</h1>
                        <p className='ml-4 text-sm text-white bg-blue-500 font-semibold rounded px-2 p-1 hover:cursor-pointer' onClick={() => { handleDelete(props._id) }}>Yes</p>
                        <p className='ml-4 text-sm text-white bg-blue-500 font-semibold rounded px-2 p-1 hover:cursor-pointer' onClick={() => setConfirmDelete(false)}>No</p>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-between shadow-lg py-2'>
                <h1 className='w-20 md:text-md h-6 md:w-28 overflow-hidden font-semibold'>{title}</h1>
                <h1 className={`px-2 py-1 text-sm md:text-md bg-${colour}-500 font-semibold text-white w-24 md:w-28 text-center xl:text-sm rounded-md`}>{status}</h1>
                <div className='hidden md:flex font-semibold text-md justify-between'>
                    <p className='w-20 md:w-24  overflow-hidden font-semibold'>{date.getDate()}/{date.getMonth()}/{date.getFullYear()}</p>
                    <p className='hidden md:block w-20 md:w-28 overflow-hidden font-semibold'>@{assignee}</p>
                </div>
                <div className=' gap-2 items-center hidden md:flex'>
                    <MdEditSquare className='text-green-500 text-lg xl:text-xl hover:cursor-pointer' onClick={() => { dispatch(setUpdateTask(props)); }} />
                    <MdDelete className='text-red-500 text-lg xl:text-xl hover:cursor-pointer' onClick={() => { setConfirmDelete(true) }} />
                </div>
                <div className='flex items-center gap-2'>
                    <p className=' text-xs bg-blue-500 text-white w-fit font-semibold px-1'>{priority}</p>
                    {!isDescriptionVisible && <IoIosArrowDropdownCircle className='text-xl text-blue-500 hover:cursor-pointer font-bold' onClick={() => setIsDescriptionVisible(!isDescriptionVisible)} />}
                    {isDescriptionVisible && <IoIosArrowDropupCircle className='text-xl text-blue-500 hover:cursor-pointer font-bold' onClick={() => setIsDescriptionVisible(!isDescriptionVisible)} />}
                    
                </div>
            </div>
            {isDescriptionVisible && <div className='py-2'>
                <div className='md:hidden flex font-semibold text-md justify-between'>
                    <p className='w-24 md:w-24 overflow-hidden font-semibold'>{date.getDate()}/{date.getMonth()}/{date.getFullYear()}</p>
                    <p className=' w-24 md:w-44 overflow-hidden font-semibold'>@{assignee}</p>
                </div>
                <p className='text-sm pt-1'>{description}</p>
                <div className=' md:hidden gap-2 items-center flex justify-end'>
                    <MdEditSquare className='text-green-500 text-lg xl:text-xl hover:cursor-pointer' onClick={() => { dispatch(setUpdateTask(props)); }} />
                    <MdDelete className='text-red-500 text-lg xl:text-xl hover:cursor-pointer' onClick={() => { setConfirmDelete(true) }} />
                </div>

            </div>}


        </div>
    )
}

export default TaskMobileCard
