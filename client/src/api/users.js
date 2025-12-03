import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: sends cookies with requests
});
