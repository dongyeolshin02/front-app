import axios from 'axios';
import { authStore } from '../store/authStore';

const api = axios.create({
    headers :{
        'Content-Type': 'application/json'
    }
})

//리퀘스트 전에 인증토큰 있으면 헤더에 추가
api.interceptors.request.use(
    (config)=> {
        
        const token = authStore.getState().token;
        console.log(token);
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

export default api;