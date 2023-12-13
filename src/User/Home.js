import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
//MUI Imports
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import Header from "../Components/Header"
import AddApp from "./AddApp"
import EditApp from "./EditApp"
import { Button } from "@mui/material"

function Home() {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const [appArray, setAppArray] = useState([])
  const [refreshApp, setRefreshApp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function appInfo() {
      try {
        let response = await Axios.get("http://localhost:8000/getApps", config)
        if (response.data) {
          setAppArray(response.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    appInfo()
    setRefreshApp(false)
  }, [refreshApp])

  const appRows = appArray.map(app => {
    return <EditApp app={app} setRefreshApp={setRefreshApp} />
  })

  return (
    <>
      <Header />
      <Container component="main" maxWidth="false">
        <Box align="center" sx={{ py: 5 }}>
          <Typography variant="h3">Application List</Typography>
          {/* <Button onClick={()=>navigate("/tasklist", { state: { application: app } })} >Go to Task List</Button> */}
        </Box>
        <Container maxWidth="false" height="100">
          <Box component="div" sx={{ display: "inline", p: 1, ml: 30, mr: 10 }}>
            App
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 10 }}>
            RNumber
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 1 }}>
            Date
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 23 }}>
            Description
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Create
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Open
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            ToDo
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Doing
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Done
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Actions
          </Box>

          <AddApp setRefreshApp={setRefreshApp} />
          {appRows}
        </Container>
      </Container>
    </>
  )
}

export default Home
