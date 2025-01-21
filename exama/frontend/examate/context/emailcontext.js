"use client";
import { createContext, useContext, useState, useMemo } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');

  const setEmailValue = (newEmail) => {
    setEmail(newEmail);

  };

  const setPasswordResetStatus = (status) => {
    setResetStatus(status);
  };
  const contextValue = useMemo(() => ({
    email,
    setEmailValue,
    resetStatus,
    setPasswordResetStatus,
    setResetStatus }),
  [email, resetStatus]);

  return (
    <EmailContext.Provider value={contextValue}>
      {children}
    </EmailContext.Provider>);

};

export const useEmail = () => {
  const context = useContext(EmailContext);
  return context;
};