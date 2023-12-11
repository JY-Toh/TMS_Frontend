import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
//Imports from MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

function EditApp(props) {
  const { app } = props
  const [editing, setEditing] = useState(false)
  const [groups, setGroups] = useState(["abc", "def", "123", "456"])
  // const [groups, setGroups] = useState(["abc", "def", "123", "456"])
  // const [status, setStatus] = useState(user.is_disabled)
  const [inputs, setInputs] = useState({})
  const [selectedGroups, setSelectedGroups] = useState([])
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  const navigate = useNavigate()

  useEffect(() => {
    async function myABC() {
      setGroups(groups.map(group => ({ value: group, label: group })))
      // console.log(groups)
    }
    myABC()
  }, [])

  const goApp = () => {
    navigate("/tasklist")
  }

  return (
    <>
      {/* <Container maxWidth="false" height="250px"> */}
      {/* <Box display="flex" sx={{ py: 1, "& button": { m: 1 } }}>
          <TextField name="app" value={app.name} sx={{ px: 1, width: "20%" }} InputProps={{ readOnly: true }} />
          <TextField name="rNum" value={app.rnum} sx={{ px: 1, width: "10%" }} InputProps={{ readOnly: true }} />
          <Box sx={{ "& .MuiTextField-root": { m: 1, width: "20%" } }} noValidate autoComplete="off">
            <TextField name="date" type="date" value={app.date} sx={{ px: 1 }} InputProps={{ readOnly: true }} />
            <TextField name="date" type="date" value={app.date} sx={{ px: 1 }} InputProps={{ readOnly: true }} />
          </Box>
          <TextField name="description" value={app.description} sx={{ px: 1, width: "50%" }} InputProps={{ readOnly: true }} />
          <Box>
            <Button variant="contained" size="small">
              Edit
            </Button>
            <Button variant="contained" size="small">
              Go
            </Button>
          </Box>
        </Box> */}
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
        <TextField name="app" value={app.name} sx={{ py: 1, px: 1, width: "10%" }} inputProps={{ readOnly: true }} />
        <TextField name="rNum" value={app.rnum} sx={{ py: 1, px: 1, width: "5%" }} inputProps={{ readOnly: true }} />
        <Box noValidate autoComplete="off">
          <Box sx={{ py: 1 }}>
            <TextField name="startDate" label="Start Date" value={app.startDate} variant="outlined" inputProps={{ readOnly: true }} />
          </Box>
          <Box sx={{ py: 1 }}>
            <TextField name="endDate" label="End Date" value={app.endDate} variant="outlined" inputProps={{ readOnly: true }} />
          </Box>
        </Box>
        {/* <TextareaAutosize id="field2" label="Field 2"  rowsMin={3} /> */}
        <TextField name="description" value={app.description} sx={{ py: 1, px: 1, width: "20%" }} inputProps={{ readOnly: true }} />
        {/* <Box sx={{ py: 1, px: 1 }}> */}
        {/* <Select defaultValue="GroupName" isMulti name="group" options={groups} className="basic-multi-select" classNamePrefix="select" width="20%" /> */}
        <TextField name="GroupName" value={groups} InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        {/* </Box> */}
        {/* <Box sx={{ py: 1, px: 1 }}> */}
        {/* <Select defaultValue="GroupName" isMulti name="group" options={groups} className="basic-multi-select" classNamePrefix="select" width="20%" /> */}
        <TextField name="GroupName" value="abc" InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        {/* </Box> */}
        {/* <Box sx={{ py: 1, px: 1 }}> */}
        {/* <Select defaultValue="GroupName" isMulti name="group" options={groups} className="basic-multi-select" classNamePrefix="select" width="20%" /> */}
        <TextField name="GroupName" value="abc" InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        {/* </Box> */}
        {/* <Box sx={{ py: 1, px: 1 }}> */}
        {/* <Select defaultValue="GroupName" isMulti name="group" options={groups} className="basic-multi-select" classNamePrefix="select" width="20%" /> */}
        <TextField name="GroupName" value="abc" InputProps={{ readOnly: true }} sx={{ py: 1, px: 1, width: "6%", overflow: "auto", whiteSpace: "normal" }} />
        {/* </Box> */}
        <Box>
          <Box sx={{ px: 5 }}>
            <Button variant="contained" size="medium">
              Edit
            </Button>
          </Box>
          <Box sx={{ px: 5 }}>
            <Button variant="contained" size="medium" onClick={goApp}>
              Go
            </Button>
          </Box>
        </Box>
        {/* <Box sx={{ py: 1, px: 1, height: "45px" }}>
          <Button variant="contained" size="large">
            Go
          </Button>
        </Box> */}
      </Box>
      {/* </Container> */}
    </>
  )
}

export default EditApp
