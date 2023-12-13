import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
// import Select from "react-select"
//MUI Imports
import Box from "@mui/material/Box"
// import Container from "@mui/material/Container"
// import Typography from "@mui/material/Typography"
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"

// import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

import { Button, Container, Grid, Modal, Paper, TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

// import { Axios } from "axios"
import Header from "../Components/Header"

function TaskList() {
  const navigate = useNavigate()
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const app = useLocation().state
  // const app = location.state
  const initialTaskStates = { Open: [], ToDo: [], Doing: [], Done: [], Close: [] }
  const [tasks, setTasks] = useState(initialTaskStates)
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false)
  const [refreshTasks, setRefreshTasks] = useState(false)
  const [openTaskInfoModal, setOpenTaskInfoModal] = useState(false)
  const [inputs, setInputs] = useState({})
  const [selectedTask, setSelectedTask] = useState({})

  // const modalStyle = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: "70%", // Adjust the width as per your requirement
  //   height: "80%", // Adjust the height as needed
  //   bgcolor: "background.paper",
  //   boxShadow: 24,
  //   p: 4,
  //   outline: "none",
  //   overflowY: "auto" // Add scroll if content is too long
  // }

  useEffect(() => {
    async function getTaskApp() {
      try {
        const response = await Axios.get(`http://localhost:8000/getTasksApp/${app.App_Acronym}`, config).catch(() => {})
        if (response.data) {
          console.log(response.data)
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
            console.log("You there " + JSON.stringify(task))
          })
          setTasks(newTasks)
          console.log("Me here " + JSON.stringify(newTasks))
        }
      } catch (e) {
        console.log(e)
      }
    }
    getTaskApp()
    setRefreshTasks(false)
  }, [refreshTasks])

  //FKED UP
  const createTask = async () => {
    const taskInfo = { ...inputs, Task_app_Acronym: app.App_Acronym }
    console.log("Task_app_Acronym: " + taskInfo.Task_app_Acronym)
    try {
      console.log("Task_description: " + taskInfo.Task_description)
      try {
        const response = await Axios.post("http://localhost:8000/createTask", taskInfo, config)
      } catch (e) {
        console.log(e)
      }
      // if (response.data) {
      //   console.log("Response is ->" + response.data)
      //   setRefreshTasks(true)
      // }
    } catch (e) {
      console.log(e)
      console.log("Error showing in catch")
    }
    setInputs({})
    setOpenCreateTaskModal(false)
  }

  const handleTask = async taskId => {
    try {
      const response = await Axios.get(`http://localhost:8000/getTaskInfo/${taskId}`, config)
      setSelectedTask(response.data.data)
      setOpenTaskInfoModal(true)
    } catch (e) {
      console.log(e)
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
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/manageplans", { state: app })
          }}
        >
          Manage Plans
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setOpenCreateTaskModal(true)
          }}
        >
          Create Task
        </Button>
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
            <Typography>Task Description*</Typography>
            <TextField name="Task_description" onChange={handleChange} sx={{ width: "80%" }} />
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
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Name
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                ID
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task State
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Plan
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Owner
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Task Creator
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Created
              </Typography>
              <Typography>Actual Value here</Typography>
            </Grid>
            <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Description
              </Typography>
              <Typography>Actual Value here</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "16px" }}>
                Notes
              </Typography>
              <Typography>Actual Value here</Typography>
              <TextField label="Notes" multiline rows={4} fullWidth sx={{ mt: "16px" }} />
            </Grid>
            <Box sx={{ display: "inline", ml: 10 }}>
              <Button variant="contained" size="medium" onClick={() => setOpenTaskInfoModal(false)}>
                Cancel
              </Button>
            </Box>
            <Box sx={{ display: "inline", ml: 240 }}>
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log("You have clicked the UNDEFINED")
                }}
              >
                Undefined
              </Button>
            </Box>
          </Grid>
        </Box>
      </Modal>

      {/* <Grid container spacing={3} style={{ overflowY: "auto", width: "100%", paddingLeft: "20px" }}> */}
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
                    // onClick={() => alert(task.Task_id)}
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
                    onClick={() => {
                      handleTask(task.Task_id)
                    }}
                  >
                    <Box
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                      }}
                    >
                      <Typography variant="body1">{task.Task_name}</Typography>
                      <Typography variant="body2" style={{ fontSize: "0.8em", color: "gray" }}>
                        {task.Task_id}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* </Container> */}
    </>
  )
}

export default TaskList
