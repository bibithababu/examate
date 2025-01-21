"use client";
import { getAdminDetails } from "@/services/ApiServices";
import { useState, createContext, useContext, useMemo } from "react";



const ConsumerContext = createContext();

export const ConsumerProvider = ({ children }) => {
  const [consumerName, setConsumerName] = useState('');
  const [consumerProfile, setConsumerProfile] = useState('');
  const [adminProfile, setAdminProfile] = useState("");

  const setConsumerDetails = (name, profileImage) => {
    console.log("name", name);
    const data = {
      name: name,
      profileImage: profileImage };

    console.log("data", data);
    const localStorage = window?.localStorage ?? null;

    if (localStorage) {
      localStorage.setItem('user', JSON.stringify(data));
    }

    setConsumerName(name);
    setConsumerProfile(profileImage);
  };

  const setAdminDetails = async () => {
    try {
      const response = await getAdminDetails();
      console.log("Admindetails", response.data);
      const data = {
        name: response.data.username,
        profileImage: response.data.profile_image };

      setAdminProfile(response.data.profile_image);
      const localStorage = window?.localStorage ?? null;
      if (localStorage) {
        localStorage.setItem('admin', JSON.stringify(data));
      }
    } catch (error) {
      console.log("There is error in taking admindetails");
      throw error;
    }


  };



  const contextValue = useMemo(() => ({
    consumerName,
    setConsumerDetails,
    setAdminDetails,
    consumerProfile,
    adminProfile }),


  [consumerName,consumerProfile,adminProfile]);

  return (
    <ConsumerContext.Provider value={contextValue}>
        {children}
    </ConsumerContext.Provider>);



};

export const useConsumer = () => useContext(ConsumerContext);