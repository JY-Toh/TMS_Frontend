import Cookies from "js-cookie"
import Checkgroup from "./CheckGroup"

import { Navigate, useNavigate } from "react-router-dom"

function ValidateUser({ children, group }) {
  const navigate = useNavigate()
  const token = Cookies.get("jwtToken")

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (group) {
    Checkgroup(group).then(function (result) {
      if (!result) {
        Cookies.remove("jwtToken")
        navigate("/")
        return
      }
    })
  }

  return <>{children}</>
}

export default ValidateUser
