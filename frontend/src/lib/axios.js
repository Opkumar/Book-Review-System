import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://book-review-system-cc20.onrender.com",
    withCredentials:true,
})

export default axiosInstance;

