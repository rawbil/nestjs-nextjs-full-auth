import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const axiosApi = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    // don't add headers, let axios automatically detect, to prevent limiting the types of data sent or received
})

export default axiosApi;