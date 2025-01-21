'use client'
import React, { useState,useEffect} from 'react';
import './loginpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from "react-hook-form"
import { googleLogin, login} from '@/services/ApiServices';
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { handleErrorResponse } from '@/middlewares/errorhandling';

import "react-toastify/dist/ReactToastify.css";

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import LanguageSwitcher from '../languageswitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur', });
  const [errorMessage, setErrorMessage] = useState('');
  const [type, setType] = useState('password');
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const showpasswordicon = watch('password');
  const [loading, setLoading] = useState(false);
  const googleUserInfoApi = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_USERINFO_URL

  const {t}=useTranslation()
 



  useEffect(() => {
    const accessToken = localStorage.getItem("access")
    const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
    if (accessToken && currentLocation) {
           router.push(currentLocation);
    }
    else{
      router.push('/login')
    }
  }, [])


  const handleLoginResponse = (response) => {
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;
    localStorage?.setItem('access', accessToken);
    localStorage?.setItem('refresh', refreshToken);
    const authTokens = {
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    localStorage?.setItem('auth', JSON.stringify(authTokens));
    localStorage?.setItem('userRole', response.data.role);
    localStorage?.setItem('authTokens', JSON.stringify(authTokens));

    const dashboardMapping = {
      "0": "/admin",
      "1": "/consumer/dashboard",
    };
    router.push(dashboardMapping[response.data.role]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
     
    
      const response = await login(data);
    
      handleLoginResponse(response);
    
       
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  const loginWithGoogle = async (token) => {
    setLoading(true)
   
    const res = await axios.get(
      `${googleUserInfoApi}?access_token=${token}`,
      {}
    );
    
    try{
      const response = await googleLogin(res.data);
     
      handleLoginResponse(response);
    }
    catch(error){
      handleErrorResponse(error)
    }
   
   
  };

  const initiateGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => loginWithGoogle(tokenResponse.access_token)
  });



  
  const handleToggle = () => {
    if (type === 'password') {
      setShowPassword(true)
      setType('text')
    } else {
      setShowPassword(false)
      setType('password')
    }
  }

  return (
<>
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="row ">
      

        <div className="card shadow-lg" style={{ padding: '10%', border: '0', minWidth: '400px', maxWidth: '400px' }}>
          <div className="card-header text-primary" style={{ border: '0', backgroundColor: 'white' }}>
            <h3 className="text-center login-title">{t("Lets Sign you in")}</h3>
            {loading ? (
              <div className="loading-section" data-testid="loading-section">

                <div className="loading-dots">
                  <div className="dot-1"></div>
                  <div className="dot-2"></div>
                  <div className="dot-3"></div>
                </div>
              </div>
            ) : (<>
              {errorMessage && (
                <p className="email-text text-center " style={{ color: 'red' }}>{errorMessage}</p>
              )}</>
            )}
          </div>
          <div className="card-body" >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">

                <input type="text"
                  placeholder={t("Email")}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  {...register("email", { required: true, pattern: /^(?=[a-zA-Z0-9._%+-]{1,255}@)[a-zA-Z0-9._%+-]{1,64}@([a-zA-Z0-9-]{1,63}\.){1,125}[a-zA-Z]{2,63}$/ })}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                   {t("Please enter a valid email address")}.
                  </div>
                )}

              </div>
              <div className="mb-3 position-relative">
                <div className="input-group">
                  <input type={type}
                    id="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    {...register("password", { required: true, maxLength: 20 })}
                    placeholder={t("Password")}
                  />
                  {showpasswordicon &&
                    <button
                      className="btn"
                      type="button"
                      data-testid="toggle-button"
                      onClick={handleToggle}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  }

                  {errors.password && (
                    <div className="invalid-feedback">
                      {t("Please enter a password")}.
                    </div>
                  )}
                </div>
              </div>
              <a href="/forgetpassword" className="forgot-password-link">{t("Forgot Password?")}</a>
              <div className="d-lg-grid gap-2">
                <button type="submit" className="custom-button">{t("Login")}</button>
                <div className='d-lg-grid gap-2 mt-2'>
                <div className="text-center">
                               
                               <button type='button' class="btn google-button  btn-google btn-outline" onClick={initiateGoogleLogin}><img className='mb-1 mx-2' src="Logo-google-icon.png" width={20} height={20}/>{t("Continue with Google")}</button>

                          
                         </div>
                         <br/>
                         <div  class="text-center"  ><LanguageSwitcher/></div>
                </div>

              </div>
              
            </form>
           
            <a href="/register" className="forgot-password-link">{t("Register")}</a>
          
          </div>
        </div>
      </div>
    
    </div>
  
    </>
  );
}

export default Login;
