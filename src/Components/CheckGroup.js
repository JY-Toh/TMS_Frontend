import Axios from "axios"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"

async function Checkgroup(groupname) {
  const token = Cookies.get("jwtToken")
  const config = { headers: { Authorization: "Bearer " + token } }

  try {
    let authorised = await Axios.post("http://localhost:8000/checkgroup", { grouplist: groupname }, config)
    return authorised.data.result
  } catch (e) {
    if (e.response.status === 401) {
      Cookies.remove("jwt-token")
      ;<Navigate to="/" />
    }

    if (e.response.data) {
      console.log(e.response.data)
    }
  }
}

export default Checkgroup
