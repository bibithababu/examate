"use client"
import React, { useState } from 'react';
import './newpassword.css';
import { useForm } from 'react-hook-form';
import PasswordToggle from '../Showpassword/Showpassword';
import { resetPassword } from '@/services/ApiServices';
import { useRouter } from 'next/navigation';
import { useOtp } from '@/context/otpcontext';
import { useEmail } from '@/context/emailcontext';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const NewPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const new_password = watch('new_password', '');
    const { email} = useEmail()
    const { otp} = useOtp()
    const router = useRouter();


    const onSubmit = async (data) => {
        try {
            const newData = {
                ...data,
                email: email,
                otp: otp,
                otp_type: 0
            };
            const response = await resetPassword(newData);
            if (response.status === 200 && response.data.message === 'Password reset successfully') {
                setMessage(response.data.message)
             
                  
                        localStorage.removeItem('otp');
  
                router.push('/login')

            }
        } catch (error) {
            if (error?.response?.data?.message) {
                setMessage(error.response.data.message)
                } else {
              setMessage("Network unable to connect to the server");
                }
  
        }
    };

    return (
        <>
           <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={false} />
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 max-vh-100" style={{}}>
        <div className="row d-flex align-items-center justify-content-center">
  
            <div className="newpasswordcard card shadow-lg" style={{padding:'10%',border: '0',minWidth:'400px',maxWidth:'400px'}}>
              <div className="card-header" style={{ border: '0' ,backgroundColor: 'white' }}>
                    <h1 className="text-center reset-password-heading">Create New Password</h1>
                    {message ? (
                        <p className={`email-text text-center ${message === "Password reset successfully" ? 'text-success' : 'text-danger'}`}>{message}</p>
                    ) : (
                        <p className="email-text text-center">Enter your new password</p>
                    )}
                    <hr />
                                <form aria-label="form" method="POST" onSubmit={handleSubmit(onSubmit)}>
                                    <div className='show-error-message'>
                                    <div className="password-container ">
                                        <input
                                            id="password"
                                            placeholder="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control mb-4 custom-input ${errors.new_password ? 'is-invalid' : ''}`}
                                            {...register('new_password', {
                                                required: 'Password is required',
                                                pattern:  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

                                        })}
                                    />
                                    {errors.new_password && <div className="password-error-message ">This password is too short. It must contain at least 8 characters.Include one Uppercase and special characters among @,#,$,%</div>}
                                    <div className='showpassword'>
                                        <PasswordToggle showPassword={showPassword} setShowPassword={setShowPassword} />
                                    </div>

                                </div>

                            </div>


                       
                                <div className="password-container ">
                                    <input
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`form-control mb-4 custom-input confirm-input ${errors.confirm_password ? 'is-invalid' : ''} ${errors.new_password ? 'confirm-input-invalid' : ''}`}
                                        {...register('confirm_password', {
                                            required: 'Confirm Password is required',
                                            validate: (value) => value === new_password || 'Passwords do not match',
                                        })}
                                    />

                                    {errors.confirm_password && <div className='confirm-password-error-message'>{errors.confirm_password.message}</div>}
                                    <div className='showconfirmpassword'>
                                        <PasswordToggle showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} isConfirmPassword />
                                    </div>

                                </div>

                            

                            <div className="row justify-content-center">
                                <button type="submit" className="btn custom-button">
                                    Continue
                                </button>
                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>

    );
}

export default NewPassword;
