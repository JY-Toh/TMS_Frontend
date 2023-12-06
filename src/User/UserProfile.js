import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"

import { Typography } from "@mui/material"
import Header from "../Components/Header"

function UserProfile() {
  const [profile, setProfile] = useState({})
  const token = Cookies.get("jwtToken")
  const [stillediting, setEditing] = useState(false)
  const [inputs, setInputs] = useState({})

  useEffect(() => {
    async function profileInfo() {
      try {
        const config = { headers: { Authorization: "Bearer " + token } }
        let response = await Axios.get("http://localhost:8000/profile", config)
        setProfile(response.data.data[0])
      } catch (e) {
        console.log(e)
      }
    }
    profileInfo()
  }, [stillediting])

  const handleSave = async e => {
    e.preventDefault()
    try {
      const config = { headers: { Authorization: "Bearer " + token } }
      const response = await Axios.post("http://localhost:8000/profile/update", inputs, config)
      if (response) {
        setEditing(false)
        setInputs({})
        toast.success(response.data.message, {
          autoclose: 1000
        })
      }
    } catch (e) {
      toast.error(e.response.data.message, {
        autoclose: 2000
      })
    }
  }

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    if (name === "email" && value === "") {
      setInputs(values => ({ ...values, [name]: "" }))
    }
    setInputs(values => ({ ...values, [name]: value }))
  }

  const editing = () => {
    setInputs(values => ({ ...values, email: profile.email }))
    setEditing(true)
  }

  return (
    <>
      <Header profile={profile} />
      <Container display="flex" align="center">
        <Typography variant="h4">My Account</Typography>
        <div style={{ width: "100%" }}>
          <div style={{ width: "20%", display: "inline-block" }}>
            <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
              <List>
                <ListItem>
                  <ListItemText primary="Username" secondary={profile.username} />
                </ListItem>
                {stillediting ? (
                  <ListItem>
                    <TextField variant="filled" onChange={handleChange} name="email" autoComplete="email" label={profile.email} autoFocus />
                  </ListItem>
                ) : (
                  <ListItem>
                    <ListItemText primary="Email" secondary={profile.email} />
                  </ListItem>
                )}
                {stillediting ? (
                  <ListItem>
                    <TextField variant="filled" onChange={handleChange} type="password" name="password" label="Password" autoFocus />
                  </ListItem>
                ) : (
                  <ListItem>
                    <ListItemText primary="Password" secondary="********" />
                  </ListItem>
                )}
              </List>
            </Box>
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
              <List>
                <ListItem>
                  <ListItemText primary="Group" secondary={profile.grouplist} />
                </ListItem>
                <ListItem>
                  {stillediting ? (
                    <Button variant="contained" onClick={handleSave}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={editing}>
                      Edit
                    </Button>
                  )}
                </ListItem>
              </List>
            </Box>
          </div>
        </div>
      </Container>
    </>
  )
}

export default UserProfile
