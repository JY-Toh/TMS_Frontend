import Axios from "axios"
import Cookies from "js-cookie"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

function EditPlan(props) {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const { plan, setRefreshPlan } = props
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [inputs, setInputs] = useState({})

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const edit = () => {
    setInputs(values => ({ ...values, Plan_app_Acronym: plan.Plan_app_Acronym, Plan_MVP_name: plan.Plan_MVP_name }))
    setEditing(true)
  }

  const save = async () => {
    try {
      const response = await Axios.post("http://localhost:8000/updatePlan", inputs, config)
      if (response) {
        setInputs({})
        setRefreshPlan(true)
        toast.success(response.data.message, {
          autoclose: 1000
        })
      }
    } catch (e) {
      try {
        if (e.response.data.status === 403) {
          navigate("/Home")
        }
        toast.error(e.response.data.message, {
          autoclose: 2000
        })
      } catch (e) {
        toast.error(e, {
          autoclose: 2000
        })
      }
    }
    setEditing(false)
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
        <TextField name="Plan_MVP_name" value={plan.Plan_MVP_name} sx={{ py: 1, px: 1, width: "30%" }} inputProps={{ readOnly: true }} />
        <Box noValidate autoComplete="off">
          <Box sx={{ py: 1 }}>{editing ? <TextField name="Plan_startDate" variant="outlined" onChange={handleChange} /> : <TextField name="Plan_startDate" value={plan.Plan_startDate} variant="outlined" inputProps={{ readOnly: true }} />}</Box>
          <Box sx={{ py: 1 }}>{editing ? <TextField name="Plan_endDate" variant="outlined" onChange={handleChange} /> : <TextField name="Plan_endDate" value={plan.Plan_endDate} variant="outlined" inputProps={{ readOnly: true }} />}</Box>
        </Box>
        <Box sx={{ mx: 2, my: 2, width: "30%", height: 30, backgroundColor: plan.Plan_color }} />
        <Box sx={{ px: 5 }}>
          {editing ? (
            <Button variant="contained" size="large" onClick={save}>
              Save
            </Button>
          ) : (
            <Button variant="contained" size="large" onClick={edit}>
              Edit
            </Button>
          )}
        </Box>
      </Box>
    </>
  )
}

export default EditPlan
