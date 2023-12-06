import Axios from "axios"
import Cookies from "js-cookie"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

//Import from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"

function AddGroup(props) {
  const token = Cookies.get("jwtToken")
  const [inputs, setInputs] = useState({})
  const { setRefreshGrouplist } = props
  const navigate = useNavigate()

  const newGroup = async () => {
    try {
      const config = { headers: { Authorization: "Bearer " + token } }
      let response = await Axios.post("http://localhost:8000/addGroup", inputs, config)
      if (response) {
        setInputs({})
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

  const editing = event => {
    const group = event.target.value
    setInputs(values => ({ ...values, group_name: group }))
  }

  return (
    <>
      <Container component="div" sx={{ py: 1, px: 1 }}>
        <Box display="flex" sx={{ position: "absolute", right: "5%", my: 1 }}>
          <TextField name="grouplist" size="small" value={inputs.group_name || ""} onChange={editing} sx={{ mx: 1 }} />
          <Button variant="contained" onClick={newGroup}>
            Add Group
          </Button>
        </Box>
      </Container>
      {/* <form onSubmit={newGroup}>
      <div>
        <input type="text" name="grouplist" value={inputs.group_name || ""} onChange={editing} />
        <button type="submit">Add Group</button>
      </div>
    </form> */}
    </>
  )
}

export default AddGroup
