import axios from "axios";

export default axios.create({
    baseURL: ` ${process.env.REACT_APP_API_URL}`,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
    }
})