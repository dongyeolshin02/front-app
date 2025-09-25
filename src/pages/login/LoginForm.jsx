import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLogin } from '../../hooks/useLogin.js';

const schema = yup.object().shape({

    username: yup.string().required('아이디를 입력하십시오'),
    password : yup.string().required('패스워드를 입력하십시오')
});

function LoginForm(props) {

    const {register, handleSubmit, formState:{errors}} =
                useForm({resolver : yupResolver(schema)});

    const loginMutation = useLogin();
    
    const goLogin = async (data) => {
       console.log(data);
       //함수 실행 
       try{
           //  mutationFn 실행 -> onSuccess(또는 onError) -> 호출한 곳 
           await  loginMutation.mutateAsync(data);

       }catch(error) {


        if(error.status === 401) {
            alert('아이디 또는 패스워드가 일치하지 않습니다.');
        }else if(error.status === 400) {
            alert('입력한 정보가 잘못되었습니다.');
        }else {
            alert('처리 중 오류가 발생했습니다. 다시시도 해주세요.'); 
        }
       }
    }

    return (
        <>
          <div className='d-flex justify-content-center align-items-center vh-100'>
            <div className='w-25 border p-4 rounded'>
                <h1 className='text-center mb-4'>Login</h1>
                <form onSubmit={handleSubmit(goLogin)}>
                     <div className='mb-3'>
                        <label htmlFor='username' className='form-label'>아이디</label>
                        <input type='text' className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                           id="username" {...register('username')} />
                        {errors.username &&(<div className='invalid-feedback'>{errors.username.message}</div> )}
                     </div>
                     <div className='mb-3'>
                        <label htmlFor='username' className='form-label'>패스워드</label>
                        <input type='password' className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                           id="password" {...register('password')} />
                        {errors.username &&(<div className='invalid-feedback'>{errors.password.message}</div> )}
                     </div>
                     <div className='text-center'>
                         <button type='submit' className='btn btn-primary me-2'> 로그인</button>
                         <button type='submit' className='btn btn-secondary'>회원가입</button>
                     </div>
                </form>
            </div>
        
          </div>   
        </>
    );
}

export default LoginForm;