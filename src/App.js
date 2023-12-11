//External Imports
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

//My Components (Internal)
import ManageUsers from "./Admin/ManageUsers"
import Home from "./User/Home"
import Login from "./User/Login"
import UserProfile from "./User/UserProfile"
import ValidateUser from "./Components/ValidateUser"
import TaskList from "./User/TaskList"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/manageusers"
            element={
              <ValidateUser group={"admin"}>
                <ManageUsers />
              </ValidateUser>
            }
          />
          <Route path="/manageusers" element={<ManageUsers />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/tasklist" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer closeOnClick theme="colored" autoClose={1000}/>
    </>
  )
}

// const root = ReactDOM.createRoot(document.querySelector("#app"))
// root.render(<App />)

// if (module.hot) {
//   module.hot.accept()
// }

export default App
