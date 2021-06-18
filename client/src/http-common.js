import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

export default axios.create({
    baseURL: process.env.REACT_APP_API_BASE,
    headers: {
        "Content-type": "application/json"
    }, 
    withCredentials: true
});

// export function axiosLogin(){
//     return axios.create({
//         baseURL: process.env.REACT_APP_API_BASE,
//         headers: {
//             "Content-type": "application/json"
//         }
//     });
// } 

// export function axiosOthers(){
//     return axios.create({
//         baseURL: process.env.REACT_APP_API_BASE,
//         headers: {
//             "Content-type": "application/json"
//         },
//         withCredentials: true
//     });
// } 