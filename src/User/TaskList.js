import Cookies from "js-cookie"
import React from "react"
// import Select from "react-select"
//MUI Imports
import Box from "@mui/material/Box"
// import Container from "@mui/material/Container"
// import Typography from "@mui/material/Typography"
import { Button, Container, Paper, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

import Header from "../Components/Header"
// import EditApp from "./EditApp"
// import AddApp from "./AddApp"

function TaskList() {
  const navigate = useNavigate()
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const location = useLocation()
  const app = location.state

  // console.log(location.state)

  return (
    <>
      <Header />
      <Container align="center">
        <Typography variant="h4" gutterBottom>
          {location.state.App_Acronym}
        </Typography>
      </Container>
      <Box sx={{ py: 1, px: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/manageplans", { state: app })
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
    </>
  )
}

export default TaskList
