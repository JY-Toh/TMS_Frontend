import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"

//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import { toast } from "react-toastify"

function AddUser(props) {
  const { setRefreshUserProfile, setRefreshGrouplist, refreshGrouplist } = props
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const [inputs, setInputs] = useState({})
  const [groups, setGroups] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
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
  }, [refreshGrouplist])

  const newUser = async () => {
    setInputs(values => ({ ...values, is_disabled: false }))
    console.log(inputs)
    try {
      console.log("Trying to axios.post call")
      let response = await Axios.post("http://localhost:8000/register", inputs, config)
      if (response) {
        console.log("I am done with axios call for register user")
        setInputs({})
        setSelectedGroups([])
        setRefreshUserProfile(true)
        setRefreshGrouplist(true)
        toast.success(response.data.message, {
          autoclose: 1000
        })
      }
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
  }

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleGroupChange = event => {
    let grouplist = ","
    event.map(group => {
      return (grouplist += group.value + ",")
    })

    // delete grouplist property if empty
    if (grouplist === ",") {
      console.log("If grouplist is empty")
      setInputs(values => ({ ...values, grouplist: "" }))
    } else {
      console.log("Grouplist containing")
      setInputs(values => ({ ...values, grouplist: grouplist }))
    }

    setSelectedGroups(event)
  }

  return (
    <>
      <Container>
        <Box component="div" display="flex" sx={{ py: 1 }}>
          <TextField name="username" label="username" value={inputs.username || ""} sx={{ px: 1, width: "12%" }} onChange={handleChange} />
          <TextField name="email" label="email" value={inputs.email || ""} sx={{ px: 1, width: "17%" }} onChange={handleChange} />
          <TextField name="password" type="password" label="********" value={inputs.password || ""} sx={{ px: 1, width: "8%", mr: 11 }} onChange={handleChange} />
          <Select value={selectedGroups} isMulti name="group" options={groups} className="basic-multi-select" classNamePrefix="select" onChange={handleGroupChange} />
          <TextField name="is_disbaled" defaultValue="active" InputProps={{ readOnly: true }} sx={{ px: 5, width: "9%", ml: 18 }} />
          <Button variant="contained" size="small" sx={{ px: 1 }} onClick={newUser}>
            Create User
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default AddUser
