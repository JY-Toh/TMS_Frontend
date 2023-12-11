import Cookies from "js-cookie"
import React, { useState } from "react"
// import Select from "react-select"
//MUI Imports
import Box from "@mui/material/Box"
// import Container from "@mui/material/Container"
// import Typography from "@mui/material/Typography"
import { Container, Paper, Typography } from "@mui/material"

import Header from "../Components/Header"
// import EditApp from "./EditApp"
// import AddApp from "./AddApp"

function TaskList() {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }

  const [value, setValue] = useState(0)
  const [tasks, setTasks] = useState([
    { title: "Task 1", status: "todo" },
    { title: "Task 2", status: "doing" },
    { title: "Task 3", status: "todo" },
    { title: "Task 4", status: "doing" },
    { title: "Task 5", status: "todo" },
    { title: "Task 6", status: "doing" },
    { title: "Task 7", status: "todo" }
  ])

  return (
    <>
      <Header />
      <Container align="center">
        <Typography variant="h4" gutterBottom>
          Application Name
        </Typography>
        <Box display="inline" maxWidth="20px">
          <Paper>Task 1</Paper>
        </Box>
        <Box display="inline" maxWidth="20%">
          <Paper>Task 2</Paper>
        </Box>
        <Paper>Hello</Paper>
      </Container>
    </>
  )
}

export default TaskList
