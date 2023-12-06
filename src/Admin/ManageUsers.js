import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
//Imports from MUI
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import Header from "../Components/Header"
import AddGroup from "./AddGroup"
import AddUser from "./AddUser"
import EditUserProfile from "./EditUser"

function ManageUsers() {
  const token = Cookies.get("jwtToken")
  const [userProfileArray, setUserProfileArray] = useState([])
  const [refreshUserProfile, setRefreshUserProfile] = useState(false)
  const [refreshGrouplist, setRefreshGrouplist] = useState(false)

  useEffect(() => {
    async function userInfo() {
      try {
        const config = { headers: { Authorization: "Bearer " + token } }
        let response = await Axios.get("http://localhost:8000/viewUsers", config)
        if (response.data) {
          setUserProfileArray(response.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    userInfo()
    setRefreshUserProfile(false)
    setRefreshGrouplist(false)
  }, [refreshUserProfile, refreshGrouplist])

  const userRows = userProfileArray.map(user => {
    return <EditUserProfile user={user} key={user.username} setRefreshUserProfile={setRefreshUserProfile} refreshGrouplist={refreshGrouplist} />
  })

  return (
    <>
      <Header />
      <Container>
        <Box component="div" sx={{ p: 1, m: 5 }}>
          <AddGroup setRefreshGrouplist={setRefreshGrouplist} />
        </Box>
        <Box component="div" sx={{ display: "inline", p: 1, ml: 5 }}>
          Username*
        </Box>
        <Box component="div" sx={{ display: "inline", p: 1, m: 10 }}>
          Email
        </Box>
        <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
          Password*
        </Box>
        <Box component="div" sx={{ display: "inline", p: 1, m: 10 }}>
          Group
        </Box>
        <Box component="div" sx={{ display: "inline", p: 1, m: 20 }}>
          Status
        </Box>

        <AddUser setRefreshUserProfile={setRefreshUserProfile} refreshGrouplist={refreshGrouplist} setRefreshGrouplist={setRefreshGrouplist} />

        {userRows}
      </Container>
    </>
  )
}

export default ManageUsers
