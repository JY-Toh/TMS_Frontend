import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { toast } from "react-toastify"

//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

function EditApp(props) {
  const { app, setRefreshApp } = props
  const [editing, setEditing] = useState(false)
  const [groups, setGroups] = useState([])
  const [inputs, setInputs] = useState({})
  // const [refreshApp, setRefreshApp] = useState([])
  // const [selectedGroups, setSelectedGroups] = useState([])
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const navigate = useNavigate()

  useEffect(() => {
    async function getGroups() {
      try {
        let response = await Axios.get("http://localhost:8000/viewGroups", config)
        if (response.data) {
          setGroups(response.data.data.map(group => ({ value: group.group_name, label: group.group_name })))
        }
      } catch (e) {
        console.log(e)
      }
    }
    getGroups()
  }, [])

  const handleChange = event => {
    console.log("Hello its me \n Name:  " + event.target.name + "\n Value: " + event.target.value)
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const edit = () => {
    setInputs(values => ({ ...values, App_Acronym: app.App_Acronym, App_Rnumber: app.App_Rnumber }))
    setEditing(true)
  }

  const save = async () => {
    try {
      const App_Acronym = app.App_Acronym
      const response = await Axios.post(`http://localhost:8000/updateApp/${App_Acronym}`, inputs, config)
      if (response) {
        console.log(response)
        console.log(response.data)
        setInputs({})
        setRefreshApp(true)
        toast.success(response.data.message, {
          autoclose: 1000
        })
      }
      // }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not allowed to access this resource") {
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

  const goApp = (app={app}) => {
    // const app = { app }
    // return (
      navigate("/tasklist")
    // )
  }

  return (
    <>
      <Box
        component="div"
        display="flex"
        sx={{
          px: "10%",
          py: 2,
          "& button": { m: 1 },
          "& .MuiInputBase-input": {
            height: "25%"
          }
        }}
      >
        <TextField name="App_Acronym" value={app.App_Acronym} sx={{ py: 1, px: 1, width: "10%" }} inputProps={{ readOnly: true }} />
        <TextField name="App_Rnumber" value={app.App_Rnumber} sx={{ py: 1, px: 1, width: "5%" }} inputProps={{ readOnly: true }} />
        <Box noValidate autoComplete="off">
          <Box sx={{ py: 1 }}>{editing ? <TextField name="App_startDate" variant="outlined" onChange={handleChange} /> : <TextField name="App_startDate" value={app.App_startDate} variant="outlined" inputProps={{ readOnly: true }} />}</Box>
          <Box sx={{ py: 1 }}>{editing ? <TextField name="App_endDate" variant="outlined" onChange={handleChange} /> : <TextField name="App_endDate" value={app.App_endDate} variant="outlined" inputProps={{ readOnly: true }} />}</Box>
        </Box>
        {editing ? <TextField name="App_Description" sx={{ py: 1, px: 1, width: "20%" }} onChange={handleChange} /> : <TextField name="App_Description" value={app.App_Description} sx={{ py: 1, px: 1, width: "20%" }} inputProps={{ readOnly: true }} />}
        {editing ? (
          <Box sx={{ py: 1, px: 1 }}>
            <Select name="App_permit_create" options={groups} width="30%" />
          </Box>
        ) : (
          <TextField name="App_permit_create" value={app.App_permit_create} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        )}
        {editing ? (
          <Box sx={{ py: 1, px: 1 }}>
            <Select name="App_permit_Open" options={groups} width="30%" />
          </Box>
        ) : (
          <TextField name="App_permit_Open" value={app.App_permit_Open} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        )}
        {editing ? (
          <Box sx={{ py: 1, px: 1 }}>
            <Select name="App_permit_toDoList" options={groups} width="30%" />
          </Box>
        ) : (
          <TextField name="App_permit_toDoList" value={app.App_permit_toDoList} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        )}
        {editing ? (
          <Box sx={{ py: 1, px: 1 }}>
            <Select name="App_permit_Doing" options={groups} width="30%" />
          </Box>
        ) : (
          <TextField name="App_permit_Doing" value={app.App_permit_Doing} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        )}
        {editing ? (
          <Box sx={{ py: 1, px: 1 }}>
            <Select name="App_permit_Done" options={groups} width="30%" />
          </Box>
        ) : (
          <TextField name="App_permit_Done" value={app.App_permit_Done} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        )}
        <Box>
          <Box sx={{ px: 5 }}>
            {editing ? (
              <Button variant="contained" size="medium" onClick={save}>
                Save
              </Button>
            ) : (
              <Button variant="contained" size="medium" onClick={edit}>
                Edit
              </Button>
            )}
          </Box>
          <Box sx={{ px: 5 }}>
            <Button variant="contained" size="medium" onClick={goApp}>
              Go
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default EditApp
