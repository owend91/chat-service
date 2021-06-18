// import {axiosLogin, axiosOthers} from "../http-common"
import http from "../http-common"


class Account {
    login(data){
        return http.post(`/login`, data)
    }

    register(data){
        return http.post(`/register`, data)
    }

    joinRoom(data){
        return http.post(`/joinroom`, data)
    }

    getRooms(){
        return http.get(`/getrooms`)
    }

    getUser(){
        return http.get(`/getuser`)
    }
}

export default new Account();