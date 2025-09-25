import api from '../api/axiosApi';


export const boardAPI ={

    list : async (page) =>{
        const response = await api.get(`/api/v1/board?page=${page}`);
        console.log(response)
        return response.data.response;
    }
}