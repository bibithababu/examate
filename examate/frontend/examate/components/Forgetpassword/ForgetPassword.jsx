"use client"
import React,{useState,useEffect} from 'react'
import { useForm } from 'react-hook-form';
import './forgetpassword.css'
import { forgetPassword } from '@/services/ApiServices';
import { useRouter } from 'next/navigation'
import { useEmail } from '@/context/emailcontext';
import { useOtp } from '@/context/otpcontext';
import { handleErrorResponse } from '@/middlewares/errorhandling';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'animate.css'
const ForgetPassword = () => {

    const { register, handleSubmit, formState: { errors },setFocus } = useForm()
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false);
    const { setEmailValue} = useEmail(); 
    const {setOtpExpirationTime} = useOtp()
    const router = useRouter()

    useEffect(()=>{
        setFocus("email")
    },[])


    const onSubmit = async (data) => {

        try {
            setLoading(true);
            const response = await forgetPassword(data)
            if (response.status === 201 && response.data.message === 'Password reset OTP sent successfully') {
                setMessage('Password reset OTP sent successfully');
                localStorage.setItem('forgetPasswordToken',response.data.token); 
                const expirationTime = new Date(response.data.expiration_time).getTime() / 1000;
                const truncatedExpirationTime = expirationTime.toFixed(2);
                setOtpExpirationTime( truncatedExpirationTime )
                setEmailValue(data.email); 
                router.push('/forgetpassword/otp')
                

            }
        } catch (error) {
          
           if (error.response?.data?.errorCode==="E10112"){
            Swal.fire({
                title: "Password reset is not available",
                imageUrl:"Logo-google-icon.png",
                imageHeight:100,
                imageWidth:100,
                padding:"1em",
                imageAlt:"Google logo",
                showClass: {
                  popup: `
                    animate__animated
                    animate__fadeIn
                    animate__faster
                  `
                },
                hideClass: {
                  popup: `
                    animate__animated
                    animate__fadeOut
                    animate__faster
                  `
                }
              });
           }else{
            handleErrorResponse(error)

           }
        
        } finally {
            setLoading(false)
        }
    };


    return (
        <>
         <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={false} />
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 max-vh-100">
        <div className="row d-flex align-items-center justify-content-center">
  
            <div className="forgotpasswordcard card shadow-lg d-flex justify-content-center " style={{padding:'10%',border: '0',minWidth:'400px',maxWidth:'400px'}}>
              <div className="card-header" style={{ border: '0' ,backgroundColor: 'white' }}>
                                <h1 className="text-center reset-password-heading">Reset Password</h1>
                                {loading ? (
                                    <div className="loading-section">
                                        <p className="sending-text email-text text-center ">Sending OTP</p>
                                        <div className="loading-dots">
                                            <div className="dot-1"></div>
                                            <div className="dot-2"></div>
                                            <div className="dot-3"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {message ? (
                                            <p className='email-text text-center text-success'>{message}</p>
                                        ) : (
                                            <p className="email-text text-center">Enter your email for a password reset OTP</p>
                                        )}
                                    </>
                                )}


                                <hr />
                                <form aria-label="form" name="forget-password-form" method="POST" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">

                                        <input type="text"
                                            placeholder="Email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email" {...register("email", { required: true, pattern: /^(?=[a-zA-Z0-9._%+-]{1,255}@)[a-zA-Z0-9._%+-]{1,64}@([a-zA-Z0-9-]{1,63}\.){1,125}[a-zA-Z]{2,63}$/ })} />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                Please enter a valid email address.
                                            </div>
                                        )}

                                    </div>
                                    <div className="row mb-1">

                                    </div>

                                    <div className="row justify-content-center">
                                        <button type="submit" className="btn custom-button">
                                            Send OTP
                                        </button>
                                    </div>
                                    <div className="row text-center mt-2">
                                        <a href="/login" className="custom-link">
                                            Back to Sign in
                                        </a>
                                    </div>
                                </form>
                            </div>
                          
                        </div>
                    </div>
                </div>
                </>
            
    )
}

export default ForgetPassword