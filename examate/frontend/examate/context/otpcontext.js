"use client"
import { createContext, useContext, useState,useMemo } from 'react';

const OtpContext = createContext();

export const OtpProvider = ({ children }) => {
  const [otp, setOtp] = useState('');
  const [expirationTime, setExpirationTime] = useState(null);

  const setOtpExpirationTime = (time) => {
    console.log("OTP Time",time)
    setExpirationTime(time);
  };

  

  const setOtpValue = (newOtp) => {
    setOtp(newOtp);
  };

  const contextValue = useMemo(() => ({
    otp,
    setOtpValue,
    expirationTime,
    setOtpExpirationTime
  }), [otp, expirationTime]);


 
  return (
    <OtpContext.Provider value={contextValue}>
      {children}
    </OtpContext.Provider>
  );
};

export const useOtp = () => {
  const context = useContext(OtpContext);
  return context;
};
