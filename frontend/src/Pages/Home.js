import { Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import * as Yup from 'yup';
import { FaUser } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import TaskCard from "../Components/TaskCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks, setUpdateTask } from "../Features/task/TaskSlice";
import TaskMobileCard from "../Components/TaskMobileCard";

// Define validation schema using Yup for formik show error when invalid values are submitted
let schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  assignee: Yup.string().required("Assginee is required"),
  priority: Yup.string().required("Priority is required"),
});

// Home component
function Home() {
  // Define options for Select components
  const sortOptions = [{ lable: 'Priority', value: 'Priority' }, { lable: 'Date', value: 'Date' }]
  const layoutOptions = [{ lable: 'General', value: 'General' }, { lable: 'Status: Column', value: 'Status: Column' }, { lable: 'Status: Row', value: 'Status: Row' }]
  const mobileLayoutOptions = [{ lable: 'General', value: 'General' }, { lable: 'Status: Row', value: 'Status: Row' }]
  const priorityOptions = [{ lable: 'P0', value: 'P0' }, { lable: 'P1', value: 'P1' }, { lable: 'P2', value: 'P2' }]
  const statusOptions = [{ lable: 'Pending', value: 'Pending' }, { lable: 'In Progress', value: 'In Progress' }, { lable: 'Completed', value: 'Completed' }, { lable: 'Deployed', value: 'Deployed' }, { lable: 'Deffered', value: 'Deffered' }]
  const displayStatusOptions = [{ lable: 'All', value: 'All' }, { lable: 'Pending', value: 'Pending' }, { lable: 'Completed', value: 'Completed' }, { lable: 'In Progress', value: 'In Progress' }, { lable: 'Deployed', value: 'Deployed' }, { lable: 'Deffered', value: 'Deffered' }]
  // State variables
  const [generalStatus, setGeneralStatus] = useState('All');
  const [showCreateWindow, setShowCreateWindow] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [sortBy, setSortBy] = useState("Date");
  const [layout, setLayout] = useState('General');

  // Redux hooks
  const dispatch = useDispatch();
  const updateTask = useSelector((state) => { return state.task.updateTask; })
  const tasks = useSelector((state) => { return state.task.tasks; })

  // Formik hook for create task form
  const createFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      assignee: "",
      priority: "",
      status: "Pending",
      startDate: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      values.startDate = new Date();
      const response = await axios.post('http://localhost:4000/api/task/CreateTask', values);
      createFormik.resetForm();
      setShowCreateWindow(false);
      handleFilter();

    }
  })
  // Formik hook for update task form
  const updateFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      assignee: "",
      priority: "",
      status: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (values.status === 'Completed' && !values.endDate) {
        values.endDate = Date.now();
      }
      const response = await axios.put(`http://localhost:4000/api/task/SingleTask/${updateTask._id}`, values);
      handleFilter()
      dispatch(setUpdateTask(null));
    }
  })

  // Function to handle task filtering
  const handleFilter = () => {
    const query = {
      assignee: filterAssignee,
      priority: filterPriority,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      sort: sortBy
    }
    if (query.assignee === '') {
      query.assignee = undefined;
      if (query.sort === 'Priority') {
        query.sort = 'priority';
      }
      else {
        query.sort = 'startDate';
      }
    }
    dispatch(getAllTasks({ params: query }));
  }

  const handleResetFiter = () => {
    setFilterAssignee("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterPriority(null);
  }
  /*** Effect hook to handle filter changes the sortBy in dependency array tracks the sort element
   *  and the tasks.length is used to apply filters on tasks on deleting a task */
  useEffect(() => {
    handleFilter();
  }, [sortBy, tasks.length])

  // Effect hook to update formik values when updateTask changes
  useEffect(() => {
    updateFormik.setValues({
      title: updateTask?.title || "",
      description: updateTask?.description || "",
      assignee: updateTask?.assignee || "",
      priority: updateTask?.priority || "",
      status: updateTask?.status || "",
      startDate: updateTask?.startDate || "",
      endDate: updateTask?.endDate,
    });
  }, [updateTask]);

  // Effect hook to fetch all tasks initially
  useEffect(() => {
    dispatch(getAllTasks());
  }, [])
  return (
    <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300  min-h-screen pb-5 relative">

      {/**Create task window */}
      <div className={`${showCreateWindow ? 'fixed' : 'hidden'} bg-black bg-opacity-50 w-screen h-screen flex justify-center items-center z-50`}>
        <form className="rounded-md bg-white min-w-72 w-[40%] bg-gradient-to-r from-[#bdbdba] to-[#82827b]" onSubmit={createFormik.handleSubmit}>
          <div className='px-2 sm:px-4 py-2 flex items-center justify-between w-full bg-white rounded-md'>
            <h1 className="text-xl font-semibold ">CREATE TASK</h1>
            <RxCrossCircled className="text-xl hover:cursor-pointer" onClick={() => setShowCreateWindow(false)} />
          </div>
          <div className="px-2 sm:px-4 flex justify-between pt-3 pb-1">
            <p>Title :</p>
            <input className="px-2 py-[3px] border-2 rounded-lg border-gray-400 w-2/3 outline-none" value={createFormik.values.title} onChange={createFormik.handleChange('title')} />
          </div>
          {<div className="text-red-600  text-sm mb-2 text-center">{createFormik.touched.title && createFormik.errors.title}</div>}
          <div className="px-2 sm:px-4 flex justify-between pb-1">
            <p>Description :</p>
            <textarea className="px-2 py-1 border-2 rounded-lg border-gray-400 w-2/3 outline-none" value={createFormik.values.description} onChange={createFormik.handleChange('description')} />
          </div>
          {<div className="text-red-600  text-sm mb-2 text-center">{createFormik.touched.description && createFormik.errors.description}</div>}

          <div className="px-2 sm:px-4 flex justify-between pb-1">
            <p>Assignee :</p>
            <input className="px-2 py-[3px] border-2 rounded-lg border-gray-400 w-2/3 outline-none" value={createFormik.values.assignee} onChange={createFormik.handleChange('assignee')} />
          </div>
          {<div className="text-red-600  text-sm mb-2 text-center">{createFormik.touched.assignee && createFormik.errors.assignee}</div>}

          <div className="px-2 sm:px-4 flex justify-between pb-1">
            <p>Priority :</p>
            <Select
              className="w-[66%]"
              value={createFormik.values.priority}
              onChange={(e) => { createFormik.setFieldValue('priority', e) }}
              options={priorityOptions}
            />
          </div>
          {<div className="text-red-600  text-sm mb-2 text-center">{createFormik.touched.priority && createFormik.errors.priority}</div>}
          <div className="px-2 sm:px-4 flex justify-end py-3 ">
            <input className="w-24 bg-sky-500 text-white font-semibold rounded-md" value='CREATE' type="submit" onClick={createFormik.handleSubmit} />
          </div>
        </form>
      </div>

      {/**Update Task window */}
      {updateTask && <div className={`fixed bg-black bg-opacity-50 w-screen h-screen z-50 flex justify-center items-center`}>
        <form className="rounded-md min-w-72 w-[40%] bg-gradient-to-r from-[#bdbdba] to-[#82827b] " onSubmit={updateFormik.handleSubmit}>
          <div className='px-2 sm:px-4 py-2 flex items-center justify-between w-full bg-white rounded-md'>
            <h1 className="text-xl font-semibold ">UPDATE TASK</h1>
            <RxCrossCircled className="text-xl hover:cursor-pointer" onClick={() => dispatch(setUpdateTask(null))} />
          </div>
          <div className="px-2 sm:px-4 flex justify-between pb-3 pt-3 ">
            <p>Title :</p>
            <input className="px-2 py-[3px] border-2 rounded-lg border-gray-400 w-[50%] outline-none" value={updateFormik.values.title} onChange={updateFormik.handleChange('title')} />
          </div>
          <div className="px-2 sm:px-4 flex justify-between py-3">
            <p>Description :</p>
            <textarea className="px-2 py-2 border-2 rounded-lg border-gray-400 w-[50%] outline-none " value={updateFormik.values.description} onChange={updateFormik.handleChange('description')} />
          </div>
          <div className="px-2 sm:px-4 flex justify-between py-3">
            <p>Status :</p>
            <Select
              className="w-[50%]"
              placeholder='Status'
              value={updateFormik.values.status}
              onChange={(e) => { updateFormik.setFieldValue('status', e) }}
              options={statusOptions}
            />
          </div>
          <div className="px-2 sm:px-4 flex justify-between py-3">
            <p>Assignee :</p>
            <input className="px-2 py-[3px] border-2 rounded-lg border-gray-400 w-[50%] outline-none" value={updateFormik.values.assignee} onChange={updateFormik.handleChange('assignee')} />
          </div>
          <div className="px-2 sm:px-4 flex justify-between py-3">
            <p>Priority :</p>
            <Select
              className="w-[50%]"
              placeholder='Priority'
              options={priorityOptions}
              value={updateFormik.values.priority}
              onChange={(e) => { updateFormik.setFieldValue('priority', e) }}
            />
          </div>
          <div className="px-2 sm:px-4  flex justify-end py-3 ">
            <input className="w-24 bg-sky-500 text-white font-semibold rounded-md" value='Update' type="submit" />
          </div>
        </form>
      </div>}

      {/**Title or header */}
      <div className="hidden lg:block">
        <div className="flex px-24 justify-between items-center pt-10">
          <h1 className='text-3xl font-semibold'>Task Board</h1>
          <FaUser className="text-6xl p-3 text-gray-800 bg-white rounded-full" />
        </div>
        {/**Filter Box */}
        <div className="border-white border-2 rounded-md mx-10 mt-5">
          <div className="flex gap-2 px-5 xl:px-10 mt-5 items-center">
            <p >Filter :</p>
            <input className="w-32 xl:w-44 ml-4 py-[3px] px-2 rounded-md" placeholder="Assignee" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} />
            <Select
              className="w-32 xl:w-44 "
              placeholder='Priority'
              value={filterPriority}
              onChange={(e) => setFilterPriority(e)}
              options={priorityOptions}
            />
            <input className="w-36 xl:w-44 py-[3px] px-2 rounded-md" type="date" onChange={(e) => { setFilterDateFrom(e.target.value) }} value={filterDateFrom} />
            <input className="w-36 xl:w-44 py-[3px] px-2 rounded-md" type="date" onChange={(e) => { setFilterDateTo(e.target.value) }} value={filterDateTo} />
            <button className='bg-blue-500 text-white text-sm font-semibold w-fit py-[5px] px-4 rounded-md' onClick={() => { handleFilter() }}>Apply</button>
            <button className='bg-blue-500 text-white text-sm font-semibold w-fit py-[5px] px-4 rounded-md' onClick={() => { handleResetFiter() }}>Reset</button>
          </div>
          <div className="flex gap-2 px-5 xl:px-10 mt-5 items-center mb-5">
            <p>Sort By :</p>
            <Select
              className="w-32 xl:w-44 "
              placeholder='Priority'
              value={sortBy}
              onChange={(e) => { setSortBy(e); }}
              options={sortOptions}
            />
          </div>
          <div className="hover:cursor-pointer absolute top-36 right-20 " onClick={() => { setShowCreateWindow(true) }}>
            <FaPlus className="text-6xl p-3 bg-white text-gray-700 rounded-full " />
          </div>
        </div>

        {/**Task Container a total of 3 layouts*/}
        <div className="mx-10 border-2 border-white rounded-md mt-2 min-h-92 relative">
          {/**layout selection box */}
          <div className=" absolute flex justify-end  w-32 right-10 top-5">
            <Select
              className="w-full "
              value={layout}
              options={layoutOptions}
              onChange={(e) => { setLayout(e) }}
            />
          </div>

          {/**general layout*/}
          {layout === 'General' ? <>
            <div className="pt-5 px-10 pb-5 flex gap-2">
              <p className={`text-lg hover:cursor-pointer ${generalStatus === 'All' ? 'text-black border-black' : "text-gray-500 border-gray-500"} py-[4px] border-2 w-fit px-4 rounded-full `} onClick={() => setGeneralStatus('All')}>All</p>
              <p className={`text-lg hover:cursor-pointer ${generalStatus === 'Pending' ? 'text-gray-700 border-gray-700' : "text-gray-500 border-gray-500"} py-[4px] border-2 w-fit px-4 rounded-full `} onClick={() => setGeneralStatus('Pending')}>Pending</p>
              <p className={`text-lg hover:cursor-pointer ${generalStatus === 'In Progress' ? 'text-orange-500 border-orange-500' : "text-gray-500 border-gray-500"} py-[4px] border-2 w-fit px-4 rounded-full `} onClick={() => setGeneralStatus('In Progress')}>In Progress</p>
              <p className={`text-lg hover:cursor-pointer ${generalStatus === 'Completed' ? 'text-green-500 border-green-500' : "text-gray-500 border-gray-500"} py-[4px] border-2 w-fit px-4 rounded-full `} onClick={() => setGeneralStatus('Completed')}>Completed</p>
              <p className={`text-lg hover:cursor-pointer ${generalStatus === 'Deployed' ? 'text-indigo-600 border-indigo-600' : "text-gray-500 border-gray-500"} py-[4px] border-2 w-fit px-4 rounded-full `} onClick={() => setGeneralStatus('Deployed')}>Deployed</p>
              <p className={`text-lg hover:cursor-pointer ${generalStatus === 'Deffered' ? 'text-rose-600 border-rose-600' : "text-gray-500 border-gray-500"} py-[4px] border-2 w-fit px-4 rounded-full `} onClick={() => setGeneralStatus('Deffered')}>Deffered</p>
            </div>
            <div className="px-10 lg:px-5 xl:px-10 flex flex-wrap pb-5 gap-4">
              {generalStatus === 'All' && tasks.map((task) => {
                return <TaskCard key={task?._id} {...task} />
              })}
              {generalStatus !== 'All' && tasks.filter((task) => task.status === generalStatus).map((task) => {
                return <TaskCard key={task?._id} {...task} />
              })}
              <div className=' hover:cursor-pointer lg:w-[23.5%] xl:w-[23.8%] 2xl:w-[18.9%] h-52 rounded-md bg-white flex flex-col text-gray-600 font-semibold text-lg justify-center items-center border-dotted border-gray-700 border-2' onClick={() => setShowCreateWindow(true)}>
                <FaPlus />
                <p className="text-base">Add new Task</p>
              </div>
            </div></> : <></>}
          {/**Status : Column layout */}
          {layout === 'Status: Column' ?
            <>
              <div className="px-5 xl:px-10 mt-16 flex gap-4 h-auto pb-4 rounded-md">
                <div className="bg-white w-[19%] rounded-md ">
                  <div>
                    <h1 className=" p-1 text-lg font-semibold text-white bg-gray-500 text-center rounded-t-md">Pending</h1>

                  </div>
                  <div className="bg-white min-h-52 rounded-b-md">
                    {tasks.filter((task) => { return task.status === 'Pending' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} column='1' />
                    })}
                    {tasks.filter((task) => task.status === 'Pending').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="bg-white w-[19%] rounded-md">
                  <h1 className=" p-1 text-lg font-semibold text-white bg-orange-500 text-center rounded-t-md">In Progress</h1>
                  <div className="bg-white rounded-b-md">
                    {tasks.filter((task) => { return task.status === 'In Progress' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} column='1' />
                    })}
                    {tasks.filter((task) => task.status === 'In Progress').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="bg-white w-[19%] rounded-md">
                  <h1 className="  p-1 text-lg font-semibold text-white bg-green-500 text-center rounded-t-md">Completed</h1>
                  <div className="bg-white rounded-b-md">
                    {tasks.filter((task) => { return task.status === 'Completed' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} column='1' />
                    })}
                    {tasks.filter((task) => task.status === 'Completed').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="bg-white w-[19%] rounded-md">
                  <h1 className=" p-1 text-lg font-semibold text-white bg-blue-500 text-center rounded-t-md">Deployed</h1>
                  <div className="bg-white rounded-b-md">
                    {tasks.filter((task) => { return task.status === 'Deployed' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} column='1' />
                    })}
                    {tasks.filter((task) => task.status === 'Deployed').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="bg-white w-[19%] rounded-md">
                  <h1 className=" p-1 text-lg font-semibold text-white bg-rose-400 text-center rounded-t-md">Deffered</h1>
                  <div className="bg-white rounded-b-md">
                    {tasks.filter((task) => { return task.status === 'Deffered' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} column='1' />
                    })}
                    {tasks.filter((task) => task.status === 'Deffered').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
              </div>
            </>
            : <></>}
          {/**Status : Row layout*/}
          {layout === 'Status: Row' ?
            <>
              <div className="mt-16 mb-5">
                <div className="px-10">
                  <div className="relative">
                    <h1 className="pending text-center p-1 text-white text-lg font-semibold bg-gray-500 rounded-t-md">Pending</h1>
                    <div className="absolute flex top-1.5 right-3 gap-2">
                      <IoIosArrowBack className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("pending").scrollBy({ left: -240, behavior: 'smooth' })} />
                      <IoIosArrowForward className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("pending").scrollBy({ left: 240, behavior: 'smooth' })} />
                    </div>
                  </div>
                  <div id="pending" className="flex gap-4 overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {tasks.filter((task) => { return task.status === 'Pending' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} />
                    })}
                    {tasks.filter((task) => task.status === 'Pending').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="px-10 mt-4">
                  <div className="relative">
                    <h1 className="pending text-center p-1 text-white text-lg font-semibold bg-orange-500 rounded-t-md">In Progress</h1>
                    <div className="absolute flex top-1.5 right-3 gap-2">
                      <IoIosArrowBack className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("in progress").scrollBy({ left: -240, behavior: 'smooth' })} />
                      <IoIosArrowForward className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("in progress").scrollBy({ left: 240, behavior: 'smooth' })} />
                    </div>
                  </div>
                  <div id="in progress" className="flex gap-4 no overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {tasks.filter((task) => { return task.status === 'In Progress' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} />
                    })}
                    {tasks.filter((task) => task.status === 'In Progress').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="px-10 mt-4">
                  <div className="relative">
                    <h1 className="pending text-center p-1 text-white text-lg font-semibold bg-green-500 rounded-t-md">Completed</h1>
                    <div className="absolute flex top-1.5 right-3 gap-2">
                      <IoIosArrowBack className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("completed").scrollBy({ left: -240, behavior: 'smooth' })} />
                      <IoIosArrowForward className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("completed").scrollBy({ left: 240, behavior: 'smooth' })} />
                    </div>
                  </div>
                  <div id="completed" className="flex gap-4 no overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {tasks.filter((task) => { return task.status === 'Completed' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} />
                    })}
                    {tasks.filter((task) => task.status === 'Completed').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="px-10 mt-4">
                  <div className="relative">
                    <h1 className="pending text-center p-1 text-white text-lg font-semibold bg-indigo-600 rounded-t-md">Deployed</h1>
                    <div className="absolute flex top-1.5 right-3 gap-2">
                      <IoIosArrowBack className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("deployed").scrollBy({ left: -240, behavior: 'smooth' })} />
                      <IoIosArrowForward className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("deployed").scrollBy({ left: 240, behavior: 'smooth' })} />
                    </div>
                  </div>
                  <div id="deployed" className="flex gap-4 no overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {tasks.filter((task) => { return task.status === 'Deployed' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} />
                    })}
                    {tasks.filter((task) => task.status === 'Deployed').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
                <div className="px-10 mt-4">
                  <div className="relative">
                    <h1 className="pending text-center p-1 text-white text-lg font-semibold bg-rose-600 rounded-t-md">Deffered</h1>
                    <div className="absolute flex top-1.5 right-3 gap-2">
                      <IoIosArrowBack className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("deffered").scrollBy({ left: -240, behavior: 'smooth' })} />
                      <IoIosArrowForward className="text-2xl bg-white p-1 rounded-md" onClick={() => document.getElementById("deffered").scrollBy({ left: 240, behavior: 'smooth' })} />
                    </div>
                  </div>
                  <div id="deffered" className="flex gap-4 no overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {tasks.filter((task) => { return task.status === 'Deffered' }).map((task) => {
                      return <TaskCard key={task?._id} {...task} />
                    })}
                    {tasks.filter((task) => task.status === 'Deffered').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                  </div>
                </div>
              </div>
            </>
            : <></>}
        </div>
      </div>
      {/**Responsive for Mobile and tablet view*/}
      <div className="lg:hidden">
        {/**mobie view title or header */}
        <div className="flex px-5 sm:px-10 justify-between items-center pt-5 sm:pt-10">
          <h1 className='text-3xl font-semibold'>Task Board</h1>
          <FaUser className="text-6xl p-3 text-gray-800 bg-white rounded-full" />
        </div>
        <div className="border-white border-2 rounded-md mx-3 sm:mx-5 mt-3 sm:mt-5  items-start justify-between">
          <div className="max-[860px]:hidden flex gap-2 px-3 sm:px-5 mt-3 sm:mt-5 items-center">
            <p >Filter :</p>
            <input className="w-32 xl:w-44 ml-4 py-[3px] px-2 rounded-md" placeholder="Assignee" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} />
            <Select
              className="w-32 xl:w-44 "
              placeholder='Priority'
              value={filterPriority}
              onChange={(e) => setFilterPriority(e)}
              options={priorityOptions}
            />
            <input className="w-36 xl:w-44 py-[3px] px-2 rounded-md" type="date" onChange={(e) => { setFilterDateFrom(e.target.value) }} value={filterDateFrom} />
            <input className="w-36 xl:w-44 py-[3px] px-2 rounded-md" type="date" onChange={(e) => { setFilterDateTo(e.target.value) }} value={filterDateTo} />
            <button className='bg-blue-500 text-white text-sm font-semibold w-fit py-[5px] px-4 rounded-md' onClick={() => { handleFilter() }}>Apply</button>
            <button className='bg-blue-500 text-white text-sm font-semibold w-fit py-[5px] px-4 rounded-md' >Reset</button>
          </div>
          <div className="sm:flex justify-between">
            <div className=" min-[859px]:hidden px-3 mt-3 sm:px-5 sm:mt-5 w-80 mb-2">
              <div className=" flex items-center  px-2 py-1 rounded-md text-white font-semibold justify-between  bg-blue-500">
                <h1 className="">Filter</h1>
                {isFilterVisible ? <IoIosArrowUp className="hover:cursor-pointer" onClick={() => { setIsFilterVisible(false) }} /> : <IoIosArrowDown className="hover:cursor-pointer" onClick={() => { setIsFilterVisible(true) }} />}
              </div>
              {isFilterVisible && <div className={``}>
                <div className="flex items-center justify-center gap-4 pt-5">
                  <input className="w-36 py-[3px] px-2 rounded-md" placeholder="Assignee" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} />
                  <Select
                    className="w-36 "
                    placeholder='Priority'
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e)}
                    options={priorityOptions}
                  />
                </div>
                <div className="flex items-center justify-center gap-4 pt-5">
                  <input className="w-36 xl:w-44 py-[3px] px-2 rounded-md" type="date" onChange={(e) => { setFilterDateFrom(e.target.value) }} value={filterDateFrom} />
                  <input className="w-36 xl:w-44 py-[3px] px-2 rounded-md" type="date" onChange={(e) => { setFilterDateTo(e.target.value) }} value={filterDateTo} />
                </div>
                <div className="flex gap-4 justify-end pt-5">
                  <button className='bg-blue-500 text-white text-sm font-semibold w-fit py-[5px] px-4 rounded-md' onClick={() => { handleFilter() }}>Apply</button>
                  <button className='bg-blue-500 text-white text-sm font-semibold w-fit py-[5px] px-4 rounded-md' onClick={() => { handleResetFiter() }}>Reset</button>
                </div>
              </div>}
            </div>
            <div className="flex gap-2 px-3 sm:px-5 xl:px-10 mt-3 sm:mt-5 items-center mb-3 sm:mb-5">
              <p>Sort By :</p>
              <Select
                className="w-32 xl:w-44 "
                placeholder='Priority'
                value={sortBy}
                onChange={(e) => { setSortBy(e); }}
                options={sortOptions}
              />
            </div>
          </div>
        </div>
        {/**Add Task Button for mobile view */}
        <div className="py-1 mt-2 mx-5 sm:mx-8 bg-blue-500 text-white font-semibold rounded-md text-center" onClick={() => setShowCreateWindow(true)}>+ Add New Task</div>
        
        {/**Task container for mobile view */}
        <div className="relative border-white border-2 rounded-md mt-2 mx-3 px-3 sm:mx-5 sm:px-5">
          <div className=" absolute flex justify-end  w-32 right-3 sm:right-5 top-5">
            <Select
              className="w-full "
              value={layout}
              options={mobileLayoutOptions}
              onChange={(e) => { setLayout(e) }}
            />
          </div>

          {/**General Mobile layout */}

          {layout === 'General' && <div className="pt-14 sm:pt-3 pb-2">
            <div className="pt-2 pb-2 gap-2 hidden sm:flex">
              <p className={`text-md hover:cursor-pointer ${generalStatus === 'All' ? 'text-black border-black' : "text-gray-500 border-gray-500"} py-[1px] border-2 w-fit px-2 rounded-full `} onClick={() => setGeneralStatus('All')}>All</p>
              <p className={`text-md hover:cursor-pointer ${generalStatus === 'Pending' ? 'text-gray-700 border-gray-700' : "text-gray-500 border-gray-500"} py-[1px] border-2 w-fit px-2 rounded-full `} onClick={() => setGeneralStatus('Pending')}>Pending</p>
              <p className={`text-md hover:cursor-pointer ${generalStatus === 'In Progress' ? 'text-orange-500 border-orange-500' : "text-gray-500 border-gray-500"} py-[1px] border-2 w-fit px-2 rounded-full `} onClick={() => setGeneralStatus('In Progress')}>In Progress</p>
              <p className={`text-md hover:cursor-pointer ${generalStatus === 'Completed' ? 'text-green-500 border-green-500' : "text-gray-500 border-gray-500"} py-[1px] border-2 w-fit px-2 rounded-full `} onClick={() => setGeneralStatus('Completed')}>Completed</p>
              <p className={`text-md hover:cursor-pointer ${generalStatus === 'Deployed' ? 'text-indigo-600 border-indigo-600' : "text-gray-500 border-gray-500"} py-[1px] border-2 w-fit px-2 rounded-full `} onClick={() => setGeneralStatus('Deployed')}>Deployed</p>
              <p className={`text-md hover:cursor-pointer ${generalStatus === 'Deffered' ? 'text-rose-600 border-rose-600' : "text-gray-500 border-gray-500"} py-[1px] border-2 w-fit px-2 rounded-full `} onClick={() => setGeneralStatus('Deffered')}>Deffered</p>
            </div>
            <div className=" absolute flex sm:hidden justify-end  w-24 left-3 sm:left-5 top-5">
              <Select
                className="w-full "
                value={generalStatus}
                options={displayStatusOptions}
                onChange={(e) => { setGeneralStatus(e) }}
              />
            </div>
            {generalStatus === "All" ? tasks.map((ele) => { return <TaskMobileCard key={ele?._id} {...ele} /> }) : tasks.filter(ele => ele.status === generalStatus).map((ele) => { return <TaskMobileCard {...ele} /> })}

          </div>}
          
          {/**Status Row Mobile layout */}

          {layout === 'Status: Row' &&
            <div className="pt-14">
              <div className=" mt-4">
                <h1 className="text-center p-1 text-white text-lg font-semibold bg-gray-500 rounded-t-md">Pending</h1>
                <div className=" overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                  {tasks.filter((task) => { return task.status === 'Pending' }).map((task) => {
                    return <TaskMobileCard key={task?._id} {...task} />
                  })}
                  {tasks.filter((task) => task.status === 'Pending').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                </div>
              </div>
              <div className=" mt-4">
                <h1 className="text-center p-1 text-white text-lg font-semibold bg-orange-500 rounded-t-md">In Progress</h1>
                <div className=" overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                  {tasks.filter((task) => { return task.status === 'In Progress' }).map((task) => {
                    return <TaskMobileCard key={task?._id} {...task} />
                  })}
                  {tasks.filter((task) => task.status === 'In Progress').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                </div>
              </div>
              <div className=" mt-4">
                <h1 className="text-center p-1 text-white text-lg font-semibold bg-green-500 rounded-t-md">Completed</h1>
                <div className="overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                  {tasks.filter((task) => { return task.status === 'Completed' }).map((task) => {
                    return <TaskMobileCard key={task?._id} {...task} />
                  })}
                  {tasks.filter((task) => task.status === 'Completed').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                </div>
              </div>
              <div className=" mt-4">
                <h1 className="text-center p-1 text-white text-lg font-semibold bg-indigo-600 rounded-t-md">Deployed</h1>
                <div className="flex gap-4 no overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                  {tasks.filter((task) => { return task.status === 'Deployed' }).map((task) => {
                    return <TaskMobileCard key={task?._id} {...task} />
                  })}
                  {tasks.filter((task) => task.status === 'Deployed').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                </div>
              </div>
              <div className=" mt-4">
                <h1 className="text-center p-1 text-white text-lg font-semibold bg-rose-600 rounded-t-md">Deffered</h1>
                <div className="flex gap-4 no overflow-scroll h-56" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                  {tasks.filter((task) => { return task.status === 'Deffered' }).map((task) => {
                    return <TaskMobileCard key={task?._id} {...task} />
                  })}
                  {tasks.filter((task) => task.status === 'Deffered').length === 0 && <div className="w-full h-full flex items-center justify-center pt-10">Empty</div>}
                </div>
              </div>

            </div>}

        </div>
      </div>
    </div>
  );
}

export default Home;


