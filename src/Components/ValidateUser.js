import Cookies from "js-cookie"
import { toast } from "react-toastify"
import Checkgroup from "./CheckGroup"

import { Navigate, useNavigate } from "react-router-dom"

function ValidateUser({ children, group }) {
  const navigate = useNavigate()
  const token = Cookies.get("jwtToken")

  if (!token) {
    toast.error("Error: Not authorised", { autoclose: 2000 })
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
