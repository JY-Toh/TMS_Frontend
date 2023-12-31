//External Imports
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

//My Components (Internal)
import ManageUsers from "./Admin/ManageUsers"
import ValidateUser from "./Components/ValidateUser"
import Home from "./User/Home"
import Login from "./User/Login"
import ManagePlans from "./User/ManagePlans"
import TaskList from "./User/TaskList"
import UserProfile from "./User/UserProfile"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ValidateUser>
                <Home />
              </ValidateUser>
            }
          />
          <Route
            path="/manageusers"
            element={
              <ValidateUser group={"admin"}>
                <ManageUsers />
              </ValidateUser>
            }
          />
          <Route
            path="/userprofile"
            element={
              <ValidateUser>
                <UserProfile />
              </ValidateUser>
            }
          />
          <Route
            path="/tasklist"
            element={
              <ValidateUser>
                <TaskList />
              </ValidateUser>
            }
          />
          <Route
            path="/manageplans"
            element={
              <ValidateUser group={"PM"}>
                <ManagePlans />
              </ValidateUser>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer closeOnClick theme="colored" autoClose={1000} />
    </>
  )
}

export default App
