import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // backend url
    withCredentials: true,
    headers: {
        'Content-type': 'application/json'
    }
});

const useAxiosInstance = () => {
return axiosInstance
}

export default useAxiosInstance;