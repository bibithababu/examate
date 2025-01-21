"use client";
import { useState, createContext, useContext, useMemo, useEffect } from "react";


const ReceiverContext = createContext();

export const ReceiverProvider = ({ children }) => {
  const [clientId, setClientId] = useState();

  const setClientValue = (value) => {
    console.log("Received value s", value);


    const localStorage = window?.localStorage ?? null;


    if (localStorage) {
      localStorage.setItem('clientId', JSON.stringify(value));
    }

    setClientId(value);
    console.log("Received value return", value);
  };

  useEffect(() => {
    console.log("Receiver value changed", clientId);
  }, [clientId]);



  const contextValue = useMemo(() => ({
    clientId,
    setClientValue }),

  [clientId]);

  return (
    <ReceiverContext.Provider value={contextValue}>
        {children}
    </ReceiverContext.Provider>);



};

export const useReceiver = () => useContext(ReceiverContext);