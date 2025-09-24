import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
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

    const {loginMutation} = useLogin();
    const [loginError, setLoginError] = useState('');
    
    const goLogin = async (data) => {
        // 이전 에러 메시지 초기화
        setLoginError('');
        
        try {
            await loginMutation.mutateAsync(data);
            // 로그인 성공 시 처리 (예: 페이지 이동)
        } catch (error) {
            // 로그인 실패 시 처리
            console.error('Login failed:', error.response);
            
            // 서버에서 받은 에러 메시지 처리
            if (error.response?.status === 401) {
                alert('아이디 또는 패스워드가 올바르지 않습니다.');
            } else if (error.response?.status === 400) {
                alert('입력한 정보를 다시 확인해주세요.');
            } else {
                alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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