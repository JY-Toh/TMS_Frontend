import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
//MUI Imports
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

import Checkgroup from "./CheckGroup"

function Header() {
  const navigate = useNavigate()
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      if (token && (await Checkgroup("admin"))) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [token])

  async function logout(e) {
    e.preventDefault()
    try {
      const response = await Axios.get("http://localhost:8000/_logout", config)
      if (response) {
        navigate("/")
      }
      Cookies.remove("jwtToken")
    } catch (e) {
      console.log(e)
    }
  }

  const goHome = async () => {
    navigate("/userprofile")
  }

  const manageUsers = async () => {
    navigate("/manageusers")
  }

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Button
            variant="Contained"
            onClick={() => {
              navigate("/Home")
            }}
          >
            <Typography variant="h3" color="inherit" noWrap>
              TMS
            </Typography>
          </Button>
          <Button
            variant="Contained"
            onClick={() => {
              navigate("/manageplans")
            }}
          >
            Go to Plans
          </Button>
          <Box sx={{ position: "absolute", right: "10%" }}>
            {isAdmin && (
              <Button color="inherit" onClick={manageUsers}>
                Account Management
              </Button>
            )}
            <Button color="inherit" onClick={goHome}>
              My Account
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
