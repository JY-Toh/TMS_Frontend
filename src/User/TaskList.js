import Cookies from "js-cookie"
import React, { useState } from "react"
// import Select from "react-select"
//MUI Imports
import Box from "@mui/material/Box"
// import Container from "@mui/material/Container"
// import Typography from "@mui/material/Typography"
import { Button, Container, Paper, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

import Header from "../Components/Header"
// import EditApp from "./EditApp"
// import AddApp from "./AddApp"

function TaskList() {
  const navigate = useNavigate()
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
      </Container>
      <Box sx={{ py: 1, px: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/manageplans")
          }}
        >
          Manage Plans
        </Button>
      </Box>
      <Container>
        <Box display="inline" maxWidth="20px">
          <Paper>Task 1</Paper>
        </Box>
        <Box display="inline" maxWidth="20%">
          <Paper>Task 2</Paper>
        </Box>
        <Paper>Hello</Paper>
      </Container>

      {/* </Container> */}
      {/* <Button
        variant="Contained"
        sx={{ backgroundColor: "#8203FA" }}
        onClick={() => {
          navigate("/manageplans")
        }}
      >
        Go to Plans
      </Button> */}
    </>
  )
}

export default TaskList
