import Axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { toast } from "react-toastify"
//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"

function EditUserProfile(props) {
  const { user, setRefreshUserProfile, refreshGrouplist } = props
  const [editing, setEditing] = useState(false)
  const [groups, setGroups] = useState([])
  const [status, setStatus] = useState(user.is_disabled)
  const [inputs, setInputs] = useState({})
  const [selectedGroups, setSelectedGroups] = useState([])
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
  }, [refreshGrouplist])

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

  const edit = () => {
    if (user.grouplist) {
      setSelectedGroups(
        user.grouplist
          .slice(1, -1)
          .split(",")
          .map(group => ({ value: group, label: group }))
      )
    }
    setInputs(values => ({ ...values, username: user.username }))
    setEditing(true)
  }

  const save = async () => {
    try {
      console.log("first IF" + JSON.stringify(inputs))
      if (!inputs.email && !inputs.grouplist && inputs.password === user.grouplist) {
        toast.success("Nothing changed", {
          autoclose: 1000
        })
      }

      if (inputs.email != user.email || inputs.grouplist != user.grouplist || inputs.password) {
        console.log(inputs)
        const response = await Axios.post("http://localhost:8000/updateUser", inputs, config)
        if (response) {
          console.log(response)
          console.log(response.data)
          setInputs({})
          setRefreshUserProfile(true)
          toast.success(response.data.message, {
            autoclose: 1000
          })
        }
      }
    } catch (e) {
      try {
        if (e.response.data.message === "Error: Not authorised") {
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

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const statusChange = async () => {
    try {
      const response = await Axios.post("http://localhost:8000/statusChange", { username: user.username, is_disabled: !user.is_disabled }, config)
      if (response) {
        setStatus(!status)
        setRefreshUserProfile(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Container>
        <Box component="div" display="flex" sx={{ py: 1, "& button": { m: 1 } }}>
          <TextField name="username" defaultValue={user.username} sx={{ px: 1, width: "15%" }} InputProps={{ readOnly: true }} />
          {editing ? <TextField name="email" value={user.email} sx={{ px: 1, width: "20%" }} onChange={handleChange} /> : <TextField name="email" defaultValue={user.email} sx={{ px: 1, width: "20%" }} InputProps={{ readOnly: true }} />}
          {editing ? <TextField name="password" type="password" value={inputs.password || ""} sx={{ px: 1, width: "10%" }} onChange={handleChange} /> : <TextField name="password" type="password" sx={{ px: 1, width: "10%" }} value="********" inputProps={{ readOnly: true }} />}
          {editing ? <Select value={selectedGroups} isMulti name="group" options={groups} className="basic-multi-select" classNamePrefix="select" onChange={handleGroupChange} width="40%" /> : <TextField name="group" value={user.grouplist} InputProps={{ readOnly: true }} sx={{ px: 1, width: "40%", overflow: "auto", whiteSpace: "normal" }} />}
          <TextField name="is_disbaled" value={user.is_disabled ? "Disabled" : "Active"} InputProps={{ readOnly: true }} sx={{ px: 1, width: "10%" }} />
          {editing ? (
            <Button variant="contained" size="small" onClick={save}>
              Save
            </Button>
          ) : (
            <Button variant="contained" size="small" onClick={edit}>
              Edit
            </Button>
          )}
          {user.is_disabled ? (
            <Button variant="contained" size="small" onClick={statusChange}>
              Enable
            </Button>
          ) : (
            <Button variant="contained" size="small" onClick={statusChange}>
              Disable
            </Button>
          )}
        </Box>
      </Container>
    </>
  )
}

export default EditUserProfile
