import Axios from "axios"
import Cookies from "js-cookie"
import React, { useState } from "react"
import { toast } from "react-toastify"
//MUI Imports
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { useNavigate } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8000/login", { username, password })
      if (response.data) {
        Cookies.set("jwtToken", response.data.token, { expires: 7 })
        navigate("/Home")
      } else {
        response.status(200).json({
          success: "false",
          message: "Invalid username or password"
        })
      }
    } catch (e) {
      // console.log(e.message)
      toast.error(e.response.data.message, {
        autoclose: 2000
      })
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        />
        <Typography component="h1" variant="h5" align="center">
          TMS
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography>Username</Typography>
          <TextField onChange={e => setUsername(e.target.value)} margin="normal" required fullWidth id="username" name="username" autoComplete="username" autoFocus />
          <Typography>Password</Typography>
          <TextField onChange={e => setPassword(e.target.value)} margin="normal" required fullWidth name="password" type="password" id="password" />
          {/* </Box> */}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default Login
