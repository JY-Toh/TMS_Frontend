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
//Internal Imports

function EditApp(props) {
  const { app, setRefreshApp, isPL } = props
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }

  const [editing, setEditing] = useState(false)
  const [groups, setGroups] = useState([])
  const [inputs, setInputs] = useState({})

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
    setRefreshApp(false)
  }, [])

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const edit = () => {
    setInputs(values => ({ ...values, App_Acronym: app.App_Acronym, App_Rnumber: app.App_Rnumber }))
    setEditing(true)
  }

  const save = async () => {
    console.log("my inputs are: " + JSON.stringify(inputs))
    try {
      const App_Acronym = app.App_Acronym
      const response = await Axios.post(`http://localhost:8000/updateApp/${App_Acronym}`, inputs, config)
      if (response) {
        setInputs({})
        setRefreshApp(true)
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

  const goApp = () => {
    navigate("/tasklist", { state: app })
  }

  return (
    <>
      <Box
        component="div"
        display="flex"
        sx={{
          px: "5%",
          py: 2,
          "& button": { m: 1 },
          "& .MuiInputBase-input": {
            height: "25%"
          }
        }}
      >
        <TextField name="App_Acronym" value={app.App_Acronym} sx={{ py: 1, px: 1, width: "10%" }} isDisabled />
        <TextField name="App_Rnumber" value={app.App_Rnumber} sx={{ py: 1, px: 1, width: "5%" }} isDisabled />
        <Box noValidate autoComplete="off">
          <Box sx={{ py: 1 }}>{editing ? <TextField name="App_startDate" variant="outlined" onChange={handleChange} /> : <TextField name="App_startDate" value={app.App_startDate === null ? "" : app.App_startDate} variant="outlined" isDisabled />}</Box>
          <Box sx={{ py: 1 }}>{editing ? <TextField name="App_endDate" variant="outlined" onChange={handleChange} /> : <TextField name="App_endDate" value={app.App_endDate === null ? "" : app.App_endDate} variant="outlined" isDisabled />}</Box>
        </Box>
        {editing ? <TextField name="App_Description" multiline rows={4} sx={{ py: 1, px: 1, width: "20%" }} onChange={handleChange} /> : <TextField name="App_Description" value={app.App_Description === null ? "" : app.App_Description} multiline rows={4} sx={{ py: 1, px: 1, width: "20%" }} isDisabled />}

        {["App_permit_create", "App_permit_Open", "App_permit_toDoList", "App_permit_Doing", "App_permit_Done"].map(state =>
          editing ? (
            <Box sx={{ py: 1, px: 1 }} key={state}>
              <Select
                name={state}
                defaultValue={{ value: app[state], label: app[state] || "Select.." }}
                isClearable
                options={groups}
                width="30%"
                onChange={event => {
                  if (!event) {
                    setInputs({ ...inputs, [state]: "" })
                  } else {
                    setInputs({ ...inputs, [state]: event.value })
                  }
                }}
                classNamePrefix="select"
              />
            </Box>
          ) : (
            <TextField name={state} value={app[state] === null ? "" : app[state]} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
          )
        )}
        <Box>
          <Box sx={{ px: 5 }}>
            {isPL &&
              (editing ? (
                <Button variant="contained" size="medium" onClick={save}>
                  Save
                </Button>
              ) : (
                <Button variant="contained" size="medium" onClick={edit}>
                  Edit
                </Button>
              ))}
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
