import Cookies from "js-cookie"
import React from "react"
//MUI Imports
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import Header from "../Components/Header"

function home() {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }} />
        <Box noValidate sx={{ mt: 1 }}>
          <Typography variant="h3" sx={{ width: "100%" }}>
            Display list of Apps...
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default home
