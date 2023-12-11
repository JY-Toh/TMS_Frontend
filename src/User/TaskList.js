import Cookies from "js-cookie"
import React from "react"
// import Select from "react-select"
//MUI Imports
// import Box from "@mui/material/Box"
// import Container from "@mui/material/Container"
// import Typography from "@mui/material/Typography"

import Header from "../Components/Header"
// import EditApp from "./EditApp"
// import AddApp from "./AddApp"

function TaskList() {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }
  // const [appArray, setAppArray] = useState([
  //   {
  //     name: "Application_1",
  //     rnum: "001",
  //     startDate: "1/1/2023",
  //     endDate: "12/12/2023",
  //     description: "This is a description for an application created on 01/01/2023"
  //   }
  // ])

  // const appRows = appArray.map(app => {
  //   return <EditApp app={app} />
  // })

  return (
    <>
      <Header />
      {/* <Container component="main" maxWidth="false">
        <Typography variant="h3">Display list of Apps...</Typography>
        <Container maxWidth="false" height="100">
          <Box component="div" sx={{ display: "inline", p: 1, ml: 30, mr:10 }}>
            App
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 10 }}>
            RNumber
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 1 }}>
            Date
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 23 }}>
            Description
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Open
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            ToDo
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Doing
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Done
          </Box>
          <Box component="div" sx={{ display: "inline", p: 1, m: 5 }}>
            Actions
          </Box>

          <AddApp />
          {appRows}
        </Container>
      </Container> */}
    </>
  )
}

export default TaskList
