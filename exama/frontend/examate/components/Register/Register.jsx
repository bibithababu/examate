"use client"
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEmail } from '@/context/emailcontext'
import './register.css'
import { registration } from '@/services/ApiServices';
import { useOtp } from '@/context/otpcontext';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {setEmailValue } = useEmail();
  const router = useRouter()
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setOtpExpirationTime } = useOtp()

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');


  const onSubmit = async (data) => {

    try {

      setLoading(true);
      const response = await registration(data)

      const expirationTime = new Date(response.data.expiration_time).getTime() / 1000;
      const truncatedExpirationTime = expirationTime.toFixed(2);
      setOtpExpirationTime(truncatedExpirationTime)
      setMessage("Registered Successfully You got an OTP please verify that For complete the process.")
      setEmailValue(data.email);
      localStorage.setItem('registerToken',response.data.token); 
      router.push('register/otp')

    } catch (error) {
      setMessage('Registration Failed !' + error.response.data.message)
    }
    finally {
      setLoading(false)
    }

  };
  return (


    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg p-3 " min>
            <h2 className="card-title text-center mb-3">Let's Register Your Account</h2>
            {loading && (
              <div className="loading-section">
                <p className="sending-text email-text text-center ">Sending OTP</p>
                <div className="loading-dots">
                  <div className="dot-1"></div>
                  <div className="dot-2"></div>
                  <div className="dot-3"></div>
                </div>
              </div>
            )}

            <div className="card-body">
              <div className="mb-3 text-center">
                {message && (
                 <div className={`alert ${message.startsWith('Registered Successfully') ? 'text-success' : 'text-danger'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} role="form">
              <div className="row ">
                <div className="col">
                  <label htmlFor="name" className="form-label">Name</label>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <input data-testid='name' type="text"
                    placeholder="Organization name"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="name"
                    name="name" {...register("username", { required: true, pattern: /^[a-zA-Z\s'-]+$/ })} />
                  {errors.username && (
                    <div className="invalid-feedback">
                      Invalid organization name.
                    </div>
                  )}

                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <label htmlFor="email" className="form-label">Email</label>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <input data-testid='email' type="text"
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
              </div>

              <div className="row mb-1">
                <div className="col">
                  <label htmlFor="address" className="form-label">Address</label>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <input data-testid='address' type="text"
                    placeholder="Address"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address" {...register("address", { required: true, pattern: /^[a-zA-Z0-9\s,'-]*$/ })} />
                  {errors.address && (
                    <div className="invalid-feedback">
                      Please enter a valid address.
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <label htmlFor="contact" className="form-label">Contact number</label>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <input data-testid='contact' type="text"
                    placeholder="contact"
                    className={`form-control ${errors.contact_number ? 'is-invalid' : ''}`}
                    id="contact"
                    name="contact" {...register("contact_number", { required: true, pattern: /^[6-9]\d{9}$/ })} />
                  {errors.contact_number && (
                    <div className="invalid-feedback">
                      Please enter a valid contact number.
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <label htmlFor="password" className="form-label">Password</label>
                </div>
              </div>
              <div className="mb-1">
                <div className="input-group">
                  <input data-testid='password' type={showPassword ? 'text' : 'password'}
                    placeholder="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password" {...register("password", { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ })} />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    data-testid="toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                  {errors.password && (
                    <div className="invalid-feedback">
                      Please enter a valid password.The password should contain at least one lowercase letter,one uppercase letter,one digit,one special character among @, $, !, %, *, ?, or &password must consist of at least 8 characters long.
                    </div>
                  )}
                </div>
              </div>

              <div className="row mb-1">
                <div className="col">
                  <label htmlFor="confirm password" className="form-label">Confirm password</label>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <div className="input-group">
                    <input data-testid='confirm'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="confirm password"
                      className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                      id="confirm_password"
                      name="confirm_password"
                      {...register('confirm_password', {
                        required: true,
                        validate: (value) => value == password || 'Passwords do not match',
                      })}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      data-testid='confirm-toggle'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>


                    {errors.confirm_password && (
                      <div className="invalid-feedback">
                        {errors.confirm_password.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <button type="submit" data-testid='register' className="btn btn-primary w-100" name='Register'>
                    Register
                  </button>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <label htmlFor="already have an account" className="form-label">Already have an account?</label>
                  <a href="/login" >Login</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RegistrationForm;
