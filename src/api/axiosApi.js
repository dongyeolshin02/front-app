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
        
        //zustand 를 호출할 때
        //컴포넌트가 아닌 곳에서는 getState() 함수를 통해서 가져와함 
        const token = authStore.getState().token;

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

export default api;