import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import Select from "react-select"
import { toast } from "react-toastify"

//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

function AddApp() {
  // const { setRefreshUserProfile, setRefreshGrouplist, refreshGrouplist } = props
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const [inputs, setInputs] = useState({})
  const [groups, setGroups] = useState([])
  // const [selectedGroups, setSelectedGroups] = useState([])
  // const navigate = useNavigate()

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
    console.log("Hello its me " + event.target.value)
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handlePermitChange = event => {
    try {
      console.log("Hello its meeeeeeeeee " + event.target.name + " still meeeeeeee " + event.target)
    } catch (e) {
      console.log(e)
    }
  }

  // const handleGroupChange = event => {
  //   const name = event.target.name
  //   let grouplist = ","
  //   event.map(group => {
  //     return (grouplist += group.value + ",")
  //   })

  //   // delete grouplist property if empty
  //   if (grouplist === ",") {
  //     console.log("If grouplist is empty")
  //     setInputs(values => ({ ...values, [name]: "" }))
  //   } else {
  //     console.log("Grouplist containing")
  //     setInputs(values => ({ ...values, [name]: grouplist }))
  //   }

  //   setSelectedGroups(event)
  // }

  const create = async () => {
    try {
      let response = await Axios.post("http://localhost:8000/createApp", inputs, config)
      if (response) {
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
          px: "10%",
          py: 2,
          "& button": { m: 1 },
          "& .MuiInputBase-input": {
            height: "25%"
          }
        }}
      >
        <TextField value={inputs.App_Acronym || ""} name="App_Acronym" label="name" sx={{ py: 1, px: 1, width: "10%" }} onChange={handleChange} />
        <TextField value={inputs.App_Rnumber || ""} name="App_Rnumber" label="Rnumber" sx={{ py: 1, px: 1, width: "5%" }} onChange={handleChange} />
        <Box noValidate autoComplete="off">
          <Box sx={{ py: 1 }}>
            <TextField value={inputs.App_startDate || ""} name="App_startDate" label="startdate" variant="outlined" onChange={handleChange} />
          </Box>
          <Box sx={{ py: 1 }}>
            <TextField value={inputs.App_endDate || ""} name="App_endDate" label="enddate" variant="outlined" onChange={handleChange} />
          </Box>
        </Box>
        {/* <TextareaAutosize id="field2" label="Field 2"  rowsMin={3} /> */}
        <TextField name="App_Description" label="Description" sx={{ py: 1, px: 1, width: "20%" }} onChange={handleChange} />
        <Box sx={{ py: 1, px: 1 }}>
          <Select name="App_permit_create" options={groups} width="30%" onChange={handlePermitChange} />
        </Box>
        <Box sx={{ py: 1, px: 1 }}>
          <Select value={inputs.App_permit_Open || ""} name="App_permit_Open" options={groups} onChange={handleChange} className="basic-multi-select" classNamePrefix="select" width="30%" />
        </Box>
        <Box sx={{ py: 1, px: 1 }}>
          <Select value={inputs.App_permit_toDoList || ""} name="App_permit_toDoList" options={groups} onChange={handleChange} className="basic-multi-select" classNamePrefix="select" width="30%" />
        </Box>
        <Box sx={{ py: 1, px: 1 }}>
          <Select value={inputs.App_permit_Doing || ""} name="App_permit_Doing" options={groups} onChange={handleChange} className="basic-multi-select" classNamePrefix="select" width="30%" />
        </Box>
        <Box sx={{ py: 1, px: 1 }}>
          <Select value={inputs.App_permit_Done || ""} name="App_permit_Done" options={groups} onChange={handleChange} className="basic-multi-select" classNamePrefix="select" width="30%" />
        </Box>
        <Box sx={{ py: 1, px: 2 }}>
          <Button variant="contained" size="large" onClick={create}>
            Create
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default AddApp
