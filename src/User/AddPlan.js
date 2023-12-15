import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

function AddPlan(props) {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const { app, refreshPlan, setRefreshPlan } = props
  const [inputs, setInputs] = useState({})

  useEffect(() => {
    async function getColor() {
      try {
        let color = "#"
        const letters = "0123456789ABCDEF"
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        setInputs({ Plan_color: color })
        setInputs(values => ({ ...values, Plan_app_Acronym: app.App_Acronym }))
      } catch (e) {
        console.log(e)
      }
    }
    getColor()
  }, [refreshPlan])

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const create = async () => {
    try {
      let response = await Axios.post("http://localhost:8000/createPlan", inputs, config)
      if (response) {
        setRefreshPlan(true)
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

  return (
    <>
      <Box
        component="div"
        display="flex"
        sx={{
          px: "32%",
          py: 2,
          "& button": { m: 1 },
          "& .MuiInputBase-input": {
            height: "25%"
          }
        }}
      >
        <TextField value={inputs.Plan_MVP_name || ""} name="Plan_MVP_name" label="name" sx={{ py: 1, px: 1, width: "30%" }} onChange={handleChange} />
        <Box noValidate autoComplete="off">
          <Box sx={{ py: 1 }}>
            <TextField value={inputs.Plan_startDate || ""} name="Plan_startDate" label="startdate" variant="outlined" onChange={handleChange} />
          </Box>
          <Box sx={{ py: 1 }}>
            <TextField value={inputs.Plan_endDate || ""} name="Plan_endDate" label="enddate" variant="outlined" onChange={handleChange} />
          </Box>
        </Box>
        <Box sx={{ mx: 2, my: 2, width: "30%", height: 30, backgroundColor: inputs.Plan_color }} />

        <Box sx={{ py: 1, px: 2 }}>
          <Button variant="contained" size="large" onClick={create}>
            Create
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default AddPlan
