import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
// MUI Imports
import Box from "@mui/material/Box"
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

  useEffect(() => {
    async function planInfo() {
      const App_Acronym = "Application_ABC"
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
          <Typography variant="h3">Manage Plans for App_Acronym</Typography>
        </Box>
        <Container maxWidth="false" height="100" align="center">
          <Box component="div" sx={{ display: "inline", py: 1, px: 5 }}>
            Plan Name*
          </Box>
          <Box component="div" sx={{ display: "inline", py: 1, px: 15 }}>
            Date
          </Box>
          <Box component="div" sx={{ display: "inline", py: 1, px: 10 }}>
            Color (Hex)
          </Box>
          <Box component="div" sx={{ display: "inline", py: 1, px: 5 }}>
            Actions
          </Box>

          <AddPlan />
          {planRows}
        </Container>
      </Container>
    </>
  )
}

export default ManagePlans
