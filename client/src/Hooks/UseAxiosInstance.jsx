import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5000/api/auth', // backend url
    baseURL: 'https://streetsmart-server.onrender.com/api/auth',
    withCredentials: true,
    headers: {
        'Content-type': 'application/json'
    }
});

const useAxiosInstance = () => {
return axiosInstance
}

export default useAxiosInstance;
