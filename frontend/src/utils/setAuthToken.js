
import axiosInstance from "../lib/axios"

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["x-auth-token"] = token
  } else {
    delete axiosInstance.defaults.headers.common["x-auth-token"]
  }
}

export default setAuthToken
