"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { otpVerification, resendOtp } from '@/services/ApiServices';
import './otpform.css';
import { useOtp } from '@/context/otpcontext';
import { useEmail } from '@/context/emailcontext';
import { handleErrorResponse } from '@/middlewares/errorhandling';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PinInput from 'react-pin-input';


const OtpForm = () => {
    const { handleSubmit, setValue,formState: { errors },setError,clearErrors} = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [otp,setOtp] = useState(0)
    const { email } = useEmail();
    const { setOtpValue, expirationTime, setOtpExpirationTime } = useOtp();
    const [timer, setTimer] = useState(0);
    const pathName = usePathname()
    const router = useRouter();
 
    let otp_type;
  


    useEffect(() => {
        expirationTime &&
            (() => {
                let interval = setInterval(() => {
                    const truncatedRemainingTime = (expirationTime - Math.floor(Date.now() / 1000)).toFixed(0);
                   
                    if (truncatedRemainingTime > 0) {
                        setTimer(truncatedRemainingTime);
                    } else {
                        setTimer(0);
                        clearInterval(interval);
                    }
                }, 1000);
            })();
    }, [expirationTime])


    useEffect(() => {
        setValue('otp', '0');
        
    }, []);

   




    const onSubmit = async (data) => {
       
        if(data.otp=="0" || data.otp==''){
            setError("otp",{
                type:"required",
                message:"Otp is required"
            })
            
            return;
        }else if(data.otp.length<4){
            setError("otp",{
                type:"minLength",
                message:"Enter 4-digit OTP"
            })
            return;
        }
        

        try {
            if (pathName === '/forgetpassword/otp') {
                otp_type = 0;
            } else {
                otp_type = 1;
            }

            const newData = {
                otp: otp,
                email: email,
                otp_type: otp_type
            };
            const response = await otpVerification('examate/verify-otp/', newData);
            if (response.data.message === 'OTP verification successful' && pathName == '/forgetpassword/otp') {
                setMessage(response.data.message);
                (window?.localStorage ?? null)?.removeItem('forgetPasswordToken');
                setOtpValue(data.otp);
                (window?.localStorage ?? null)?.setItem('otp',data.otp);
                router.push('/newpassword');
            } else if (response.data.message === 'OTP verification successful' && pathName == '/register/otp') {
                setMessage(response.data.message);
                router.push('/login');
            }
        } catch (error) {
            handleErrorResponse(error)
        }
    };

   
    const handleResendOtp = async () => {
        try {
            setLoading(true);
            if (pathName === '/forgetpassword/otp') {
                otp_type = 0;
            } else {
                otp_type = 1;
            }

            const data = {
                email: email,
                otp_type: otp_type
            };

            const response = await resendOtp(data);
            if (response.status === 201 && response.data.message === 'New OTP sent successfully') {
                setMessage('New OTP sent successfully');
                const expirationTime = new Date(response.data.expiration_time).getTime() / 1000;
                const truncatedExpirationTime = expirationTime.toFixed(2);
                setOtpExpirationTime(truncatedExpirationTime)
            }
        } catch (error) {
            if (error?.response?.data?.message) {
                setMessage(error.response.data.message)
            } else {
                setMessage("Network unable to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={false} />
            <div className=" container-fluid d-flex align-items-center justify-content-center min-vh-100 max-vh-100" style={{}}>
                <div className="row d-flex align-items-center justify-content-center ">

                    <div className="card shadow-lg " style={{ padding: '10%', border: '0', minWidth: '400px', maxWidth: '400px' }}>
                        <div className="card-header" style={{ border: '0', backgroundColor: 'white' }}>
                            <h1 className="text-center reset-password-heading">You've Got Email</h1>

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
                                        <p className={`email-text text-center ${message === 'New OTP sent successfully' || message === 'OTP verification successful' ? 'text-success' : 'text-danger'}`}>{message}</p>
                                    ) : (
                                        <p className="email-text text-center">We have sent the OTP verification code to your email address. Check your email and enter the code below.</p>
                                    )}
                                </>
                            )}
                            <hr />
                            <form aria-label="form" name="forget-password-form" method="POST" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <div className="row justify-content-center">
                                        <PinInput
                                            length={4}
                                            initialValue=""
                                          
                                            onChange={(value) => {
                                             
                                              setValue('otp',value)
                                              if (errors.otp?.type === "required") {
                                                clearErrors("otp");
                                            }
                                            }} 
                                            type="numeric"
                                            inputMode="number"
                                            style={{ margin: 'auto', display: 'flex', justifyContent: 'space-between' }} 
                                            inputStyle={{ width: '60px', height: '60px', fontSize: '1.0rem', textAlign: 'center', border: errors.otp ? '1px solid red' : '1px solid #ced4da', borderRadius: '7px' }} 
                                            inputFocusStyle={{ borderColor: '#80bdff', boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' }}
                                            onComplete={(value) => {
                                                setValue('otp',value)
                                                setOtp(value)
                                                if (errors.otp?.type === "minLength") {
                                                    clearErrors("otp");
                                                }
                                                                          }} 
                                            autoSelect={true}
                                            regexCriteria={/^\d*$/}
                                          
                                          
                                        />
                                    </div>
                                    {errors.otp && <p className="text-danger mt-1">{errors.otp.message}</p>} 
                                  
                                </div>

                                <div className="row justify-content-center">
                                    <button type="submit" className="btn custom-button">
                                        Confirm
                                    </button>
                                </div>
                                <div className="row text-center mt-2">
                                    {timer > 0 ? <p className="custom-time">
                                        {`OTP expires in ${timer} seconds`}
                                    </p> : <button type='button' onClick={handleResendOtp} style={{
                                        border: 'none',
                                        background: 'none',
                                        padding: 0,
                                        outline: 'none',

                                    }}>
                                        Resend
                                    </button>}
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default OtpForm;