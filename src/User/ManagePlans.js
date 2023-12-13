import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
// MUI Imports
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import Header from "../Components/Header"
import AddPlan from "./AddPlan"
import EditPlan from "./EditPlan"

function ManagePlans() {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const [planArray, setPlanArray] = useState([])
  const [refreshPlan, setRefreshPlan] = useState([false])
  const app = useLocation().state
  const navigate = useNavigate()

  useEffect(() => {
    async function planInfo() {
      const App_Acronym = app.App_Acronym
      try {
        let response = await Axios.get(`http://localhost:8000/getPlanApp/${App_Acronym}`, config)
        if (response.data) {
          setPlanArray(response.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    planInfo()
    setRefreshPlan(false)
  }, [refreshPlan])

  const planRows = planArray.map(plan => {
    return <EditPlan plan={plan} setRefreshPlan={setRefreshPlan} />
  })

  return (
    <>
      <Header />
      <Container component="main" maxWidth="false">
        <Box align="center" sx={{ py: 5 }}>
          <Typography variant="h3">Manage Plans for {app.App_Acronym}</Typography>
        </Box>
        <Box sx={{ py: 1, px: 2 }}>
          <Button variant="contained" size="large" onClick={() => navigate("/tasklist", { state: app })}>
            Back
          </Button>
        </Box>
        <Container maxWidth="false" height="100" align="center">
          <Box component="div" sx={{ display: "inline", py: 1, px: 5 }}>
            Plan Name*
          </Box>
          <Box component="div" sx={{ display: "inline", py: 1, px: 15 }}>
            Date
          </Box>
          <Box component="div" sx={{ display: "inline", py: 1, px: 10 }}>
            Color
          </Box>
          <Box component="div" sx={{ display: "inline", py: 1, px: 5 }}>
            Actions
          </Box>

          <AddPlan app={app} refreshPlan={refreshPlan} setRefreshPlan={setRefreshPlan} />
          {planRows}
        </Container>
      </Container>
    </>
  )
}

export default ManagePlans
