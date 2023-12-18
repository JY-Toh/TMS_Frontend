import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Select from "react-select"
import { toast } from "react-toastify"
//MUI Imports
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Button, Container, Grid, IconButton, Modal, Paper, TextField, Typography } from "@mui/material"
import Box from "@mui/material/Box"
//Internal Imports
import Checkgroup from "../Components/CheckGroup"
import Header from "../Components/Header"

function TaskList() {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  // const initialApp = useLocation().state //Prop passing
  const navigate = useNavigate()
  const initialTaskStates = { Open: [], ToDo: [], Doing: [], Done: [], Close: [] }
  const [tasks, setTasks] = useState(initialTaskStates)
  const [refreshTasks, setRefreshTasks] = useState(false)
  //States for modals
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false)
  const [openTaskInfoModal, setOpenTaskInfoModal] = useState(false)
  const [openTaskPDModal, setOpenTaskPDModal] = useState(false)
  //States for handling task
  const [app, setApp] = useState(useLocation().state)
  const [inputs, setInputs] = useState({})
  const [selectedTask, setSelectedTask] = useState({})
  const [updatedNotes, setUpdatedNotes] = useState("")
  const [editing, setEditing] = useState(false)
  const [demoting, setDemoting] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [plans, setPlans] = useState([])
  const [plan, setPlan] = useState("")
  //States for checkgroup
  //States for grouplist
  const [isPL, setIsPL] = useState(false)
  const [isPM, setIsPM] = useState(false)
  //States for each Task_state
  const [open, setOpen] = useState(false)
  const [toDo, setToDo] = useState(false)
  const [doing, setDoing] = useState(false)
  const [done, setDone] = useState(false)
  const [close, setClose] = useState(false)

  useEffect(() => {
    async function getApp() {
      try {
        const response = await Axios.get(`http://localhost:8000/getAppInfo/${app.App_Acronym}`, config)
        if (response) {
          setApp(response.data.data[0])
        }
      } catch (e) {
        console.log(e)
      }
    }
    getApp()
  }, [refreshTasks])

  useEffect(() => {
    async function getTaskApp() {
      try {
        const response = await Axios.get(`http://localhost:8000/getTasksApp/${app.App_Acronym}`, config).catch(() => {})
        if (response.data) {
          let newTasks = {
            Open: [],
            ToDo: [],
            Doing: [],
            Done: [],
            Close: []
          }
          response.data.data.forEach(task => {
            const state = task.Task_state
            if (newTasks[state]) {
              newTasks[state].push({ Task_id: task.Task_id, Task_name: task.Task_name, Plan_color: task.Plan_color })
            }
          })
          setTasks(newTasks)
        }
      } catch (e) {
        console.log(e)
      }
    }

    getTaskApp()
    setSelectedTask({})
    setRefreshTasks(false)
    setRejecting(false)
    setDemoting(false)
    setEditing(false)
  }, [app])

  //Checkgroup to see if the permits are given (true)
  useEffect(() => {
    const checkPermitGroup = async () => {
      try {
        setIsPL(await Checkgroup(app.App_permit_create))
        setIsPM(await Checkgroup("PM"))
        setOpen(await Checkgroup(app.App_permit_Open))
        setToDo(await Checkgroup(app.App_permit_toDoList))
        setDoing(await Checkgroup(app.App_permit_Doing))
        setDone(await Checkgroup(app.App_permit_Done))
        setClose(await Checkgroup(app.App_permit_Close))
      } catch (e) {
        console.log(e)
      }
    }

    checkPermitGroup()
  }, [token, app, openCreateTaskModal, openTaskInfoModal, openTaskPDModal])

  useEffect(() => {
    async function getPlans() {
      try {
        let response = await Axios.get(`http://localhost:8000/getPlanApp/${app.App_Acronym}`, config)
        if (response.data) {
          setPlans(response.data.data.map(plan => ({ value: plan.Plan_MVP_name, label: plan.Plan_MVP_name })))
        }
      } catch (e) {
        console.log(e)
      }
    }
    getPlans()
  }, [])

  //Check current state if user has permit
  const checkState = state => {
    switch (state) {
      case "Open":
        return open
      case "ToDo":
        return toDo
      case "Doing":
        return doing
      case "Done":
        return done
      case "Close":
        return close
      default:
        return false
    }
  }

  const createTask = async () => {
    const taskInfo = { ...inputs, Task_app_Acronym: app.App_Acronym }
    try {
      const response = await Axios.post("http://localhost:8000/createTask", taskInfo, config)
      if (response) {
        toast.success(response.data.message, {
          autoclose: 1000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenCreateTaskModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
    setInputs({})
    setEditing(false)
    setRefreshTasks(true)
    setOpenCreateTaskModal(false)
  }

  const openTaskPD = async (taskId, currentState, nextState) => {
    try {
      if (currentState === "Doing" && nextState === "ToDo") {
        const response = await Axios.get(`http://localhost:8000/getTaskInfo/${taskId}`, config)
        if (response) {
          setSelectedTask(response.data.data[0])
          setDemoting(true)
          setOpenTaskPDModal(true)
        }
      }
      if (currentState === "Done" && nextState === "Doing") {
        const response = await Axios.get(`http://localhost:8000/getTaskInfo/${taskId}`, config)
        if (response) {
          setSelectedTask(response.data.data[0])
          setRejecting(true)
          setDemoting(true)
          setOpenTaskPDModal(true)
        }
      } else {
        const response = await Axios.get(`http://localhost:8000/getTaskInfo/${taskId}`, config)
        if (response) {
          setSelectedTask(response.data.data[0])
          setOpenTaskPDModal(true)
        }
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskInfoModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const promoteTask = async taskId => {
    try {
      const update = { Task_notes: updatedNotes }
      const response = await Axios.post(`http://localhost:8000/promoteTask/${taskId}`, update, config)
      if (response) {
        setUpdatedNotes("")
        setEditing(false)
        setRefreshTasks(true)
        setOpenTaskPDModal(false)
        toast.success(response.data.message, {
          autoclose: 2000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskPDModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const moveTask = async (e, task, currentState, nextState) => {
    setSelectedTask({ ...task, nextState })
    openTaskPD(task.Task_id, currentState, nextState)
  }

  const demoteWhich = async taskId => {
    rejecting ? rejectTask(taskId) : returnTask(taskId)
  }

  const returnTask = async taskId => {
    try {
      const update = { Task_notes: updatedNotes }
      const response = await Axios.post(`http://localhost:8000/returnTask/${taskId}`, update, config)
      if (response) {
        setUpdatedNotes("")
        setPlan({})
        setEditing(false)
        setRejecting(false)
        setRefreshTasks(true)
        setOpenTaskPDModal(false)
        toast.success(response.data.message, {
          autoclose: 2000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskPDModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const rejectTask = async taskId => {
    try {
      const update = { Task_notes: updatedNotes, Task_plan: plan }
      const response = await Axios.post(`http://localhost:8000/rejectTask/${taskId}`, update, config)
      if (response) {
        setUpdatedNotes("")
        setPlan({})
        setEditing(false)
        setRejecting(false)
        setRefreshTasks(true)
        setOpenTaskPDModal(false)
        toast.success(response.data.message, {
          autoclose: 2000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskPDModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const handleTask = async taskId => {
    try {
      const response = await Axios.get(`http://localhost:8000/getTaskInfo/${taskId}`, config)
      setSelectedTask(response.data.data[0])
      setOpenTaskInfoModal(true)
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskInfoModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const saveTask = async taskId => {
    try {
      const update = { Task_notes: updatedNotes }
      const response = await Axios.post(`http://localhost:8000/updateNotes/${taskId}`, update, config)
      if (response) {
        setUpdatedNotes("")
        setPlan({})
        setEditing(false)
        setOpenTaskInfoModal(false)
        toast.success(response.data.message, {
          autoclose: 2000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskInfoModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const assignPlan = async taskId => {
    try {
      const update = { Plan_app_Acronym: app.App_Acronym, Plan_MVP_name: plan, Task_notes: updatedNotes, Task_plan: plan }
      const response = await Axios.post(`http://localhost:8000/assignTaskPlan/${taskId}`, update, config)
      if (response) {
        setUpdatedNotes("")
        setPlan({})
        setEditing(false)
        setRefreshTasks(true)
        setOpenTaskInfoModal(false)
        toast.success(response.data.message, {
          autoclose: 2000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
          setOpenTaskInfoModal(false)
          setRefreshTasks(true)
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
  }

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  return (
    <>
      <Header />
      <Container align="center">
        <Typography variant="h4" gutterBottom>
          {app.App_Acronym}
        </Typography>
      </Container>
      <Box sx={{ pb: 5, px: 2, "& button": { m: 1 } }}>
        {isPM && (
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              navigate("/manageplans", { state: app })
            }}
          >
            Manage Plans
          </Button>
        )}
        {isPL && (
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setOpenCreateTaskModal(true)
            }}
          >
            Create Task
          </Button>
        )}
      </Box>

      <Modal
        open={openCreateTaskModal}
        onClose={() => {
          setOpenCreateTaskModal(false)
        }}
      >
        <Box align="center" sx={{ margin: 2, height: "100%", backgroundColor: "white" }}>
          <Typography variant="h6" mb={2}>
            Create New Task
          </Typography>
          <Box sx={{ m: 5 }}>
            <Typography>Task Name*</Typography>
            <TextField name="Task_name" onChange={handleChange} sx={{ width: "80%" }} />
          </Box>

          <Box sx={{ m: 5, maxWidth: "100%" }}>
            <Typography>Task Description</Typography>
            <TextField name="Task_description" multiline rows={10} onChange={handleChange} sx={{ width: "80%" }} />
          </Box>
          <Box sx={{ display: "inline", mr: 250 }}>
            <Button variant="contained" size="medium" onClick={() => setOpenCreateTaskModal(false)}>
              Cancel
            </Button>
          </Box>
          <Box sx={{ display: "inline" }}>
            <Button variant="contained" size="medium" onClick={createTask}>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openTaskInfoModal} onClose={() => setOpenTaskInfoModal(false)}>
        <Box sx={{ margin: 2, height: "100%", backgroundColor: "white" }}>
          <Grid container spacing={2} sx={{ m: 2, height: "100%" }}>
            <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                App Acronym
              </Typography>
              <Typography>{app.App_Acronym}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Name
              </Typography>
              <Typography>{selectedTask.Task_name}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                ID
              </Typography>
              <Typography>{selectedTask.Task_id}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task State
              </Typography>
              <Typography>{selectedTask.Task_state}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Plan
              </Typography>
              {open ? <Select name="Task_plan" defaultValue={{ value: selectedTask.Task_plan, label: selectedTask.Task_plan || "Select.." }} options={plans} width="30%" onChange={event => setPlan(event.value)} classNamePrefix="select" /> : <Typography>{selectedTask.Task_plan}</Typography>}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Owner
              </Typography>
              <Typography>{selectedTask.Task_owner}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Creator
              </Typography>
              <Typography>{selectedTask.Task_creator}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Created
              </Typography>
              <Typography>{selectedTask.Task_createDate && selectedTask.Task_createDate.split("T", 1)}</Typography>
            </Grid>
            <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Description
              </Typography>
              <Typography sx={{ width: "90%" }}>{selectedTask.Task_description}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Notes
              </Typography>
              <TextField multiline rows={10} value={selectedTask.Task_notes} sx={{ width: "90%" }} />
              {editing && <TextField label="Notes" multiline rows={4} sx={{ width: "90%", mt: "16px" }} onChange={event => setUpdatedNotes(event.target.value)} />}
            </Grid>
            <Box sx={{ display: "inline", ml: "10%" }}>
              <Button variant="contained" size="medium" onClick={() => setOpenTaskInfoModal(false)}>
                Cancel
              </Button>
            </Box>
            <Box sx={{ display: "inline", ml: "70%" }}>
              {editing ? (
                open ? (
                  <Button variant="contained" size="medium" onClick={() => assignPlan(selectedTask.Task_id)}>
                    Save
                  </Button>
                ) : (
                  <Button variant="contained" size="medium" onClick={() => saveTask(selectedTask.Task_id)}>
                    Save
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => {
                    setEditing(true)
                    setPlan(selectedTask.Task_plan)
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openTaskPDModal} onClose={() => setOpenTaskPDModal(false)}>
        <Box sx={{ margin: 2, height: "100%", backgroundColor: "white" }}>
          <Grid container spacing={2} sx={{ m: 2, height: "100%" }}>
            <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                App Acronym
              </Typography>
              <Typography>{app.App_Acronym}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Name
              </Typography>
              <Typography>{selectedTask.Task_name}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                ID
              </Typography>
              <Typography>{selectedTask.Task_id}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task State
              </Typography>
              <Typography>{selectedTask.Task_state}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Plan
              </Typography>
              <Typography>{selectedTask.Task_plan || ""}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Owner
              </Typography>
              <Typography>{selectedTask.Task_owner}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Creator
              </Typography>
              <Typography>{selectedTask.Task_creator}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Created
              </Typography>
              <Typography>{selectedTask.Task_createDate && selectedTask.Task_createDate.split("T", 1)}</Typography>
            </Grid>
            <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Description
              </Typography>
              <Typography sx={{ width: "90%" }}>{selectedTask.Task_description}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Notes
              </Typography>
              <TextField multiline rows={10} value={selectedTask.Task_notes} sx={{ width: "90%" }} />
              <TextField label="Notes" multiline rows={4} sx={{ width: "90%", mt: "16px" }} onChange={event => setUpdatedNotes(event.target.value)} />
            </Grid>
            <Box sx={{ display: "inline", ml: "10%" }}>
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  setOpenTaskPDModal(false)
                  setDemoting(false)
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box sx={{ display: "inline", ml: "70%" }}>
              {demoting ? (
                <Button variant="contained" size="medium" onClick={() => demoteWhich(selectedTask.Task_id)}>
                  Demote
                </Button>
              ) : (
                <Button variant="contained" size="medium" onClick={() => promoteTask(selectedTask.Task_id)}>
                  Promote
                </Button>
              )}
            </Box>
          </Grid>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        {Object.keys(tasks).map((status, index, array) => (
          <Grid item key={index} xs={12 / array.length} style={{ height: "70vh", padding: "0" }}>
            <Paper elevation={3} style={{ padding: "16px", height: "100%", overflow: "auto", margin: "0px 10px", backgroundColor: "#FFFFF4" }}>
              <Typography variant="h6" gutterBottom align="center" style={{ borderBottom: "2px solid #ccc", padding: "8px", borderRadius: "4px" }}>
                {status}
              </Typography>
              {tasks[status].length > 0 &&
                tasks[status].map(task => (
                  <Paper
                    key={task.Task_id}
                    elevation={1}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      marginBottom: "8px",
                      wordWrap: "break-word",
                      borderLeft: `6px solid ${task.Plan_color}`,
                      backgroundColor: "#FAFAFA"
                    }}
                  >
                    {checkState(status) === true && (status === "Doing" || status === "Done") && (
                      <IconButton
                        onClick={event => {
                          moveTask(event, task, array[index], array[index - 1])
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    )}

                    <Box
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                      }}
                      onClick={event => {
                        handleTask(task.Task_id)
                      }}
                    >
                      <Typography variant="body1">{task.Task_name}</Typography>
                      <Typography variant="body2" style={{ fontSize: "0.8em", color: "gray" }}>
                        {task.Task_id}
                      </Typography>
                    </Box>
                    {status !== "Close" && checkState(status) === true && (
                      <IconButton
                        onClick={event => {
                          moveTask(event, task, status, array[index + 1])
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    )}
                  </Paper>
                ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default TaskList
