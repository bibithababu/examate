"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "font-awesome/css/font-awesome.min.css";
import PropTypes from "prop-types";
import "./rootLayout.css";
import Navbar from "../navbar/Navbar";
import { deleteDeviceRegisterToken, deviceRegister, getNotificationsCount, getNotificationsList } from "@/services/ApiServices";
import { initializeApp } from "firebase/app";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import {
getMessaging,
getToken,
onMessage } from
"firebase/messaging";
import { Toaster, toast } from "react-hot-toast";
import { handleErrorResponse } from "@/middlewares/errorhandling";
import { useTicketStatus } from "@/context/ticketStatusContext";
import { useMessageStatus } from "@/context/messageStatusContext";

const ExamateLayout = ({ dashboardContent, children, userType }) => {
  const [isToggled, setIsToggled] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState();
  const router = useRouter();
  const [notifications, setNotifications] = useState();
  const { updateTicketStatusCount } = useTicketStatus();
  const { updateUnReadMessageCount, setUserIdValue } = useMessageStatus();



  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID };


  console.log("Api key", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  useEffect(() => {

    if (userType == "consumer") {
      updateTicketStatusCount();
      updateUnReadMessageCount();
    }

    fetchNotificationCount();
    requestPermission();



  }, []);


  const fetchNotificationCount = async () => {
    const response = await getNotificationsCount();
    if (response?.data?.count !== 0) {
      setNotificationsCount(response?.data?.count);
    }

  };

  const fetchNotifications = async () => {
    console.log("inside fetch notifications");
    try {
      const response = await getNotificationsList();
      const results = response?.data?.results;
      if (results)
      {
        setNotifications(response?.data?.results);
        console.log("notifications : ", response?.data?.results);
      } else
      {
        setNotifications("notifications not found");
      }
    }
    catch (error) {
      console.log('Error fetching questions:', error);
      console.error('Error fetching questions:', error);
    }
  };

  const requestPermission = async () => {
if(typeof window !== 'undefined'){


      const fcm = initializeApp(config);
      const messaging = getMessaging(fcm);
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("inside request permission", permission);

          // Check if the device ID token is already stored in local storage
       
          const deviceIdTokenStored = localStorage.getItem("deviceIdToken");
          if (!deviceIdTokenStored) {
            const currentToken = await getToken(messaging, {
              vapidKey: "BFfb-VVHk2WBEfWq3A28JO7MaX2HPK45fLhgw6chJqZu2VN0a0Vg6w7mY4PExD5MMxivJ_Bwo3PbIVtH0Iu6gZ0" });

            console.log("deviceIdToken", currentToken);
          
            localStorage.setItem("deviceIdToken", currentToken);
          }

          // Add foreground message listener after permission is granted
          onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            const notification = payload.data;
            const body = notification?.body;
            const messageClientId = payload.data.client_id;
            console.log("")

            const clientId = (window?.localStorage ?? null)?.getItem('clientId');
            console.log("MessgaeID",messageClientId)
            console.log("clientId",clientId)
            fetchNotificationCount();
            fetchNotifications();

            pushNotification(payload, messageClientId, clientId, updateUnReadMessageCount, setUserIdValue, notification, body);
          

          });

          if (!deviceIdTokenStored) {
            sendDeviceIdTokenToBackend();}
        }
      
      } catch (error) {
        console.log("Error requesting permission or getting token:", error);
      }
    }
    
  };




  useEffect(() => {
    const handleResize = () => {
      setIsToggled(window.innerWidth > 768);
    };

    handleResize();
    localStorage.setItem(
    "currentLocation",
    JSON.stringify(window.location.pathname));


    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [notificationsCount]);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsToggled(!isToggled);
  };

  const handleLogout = async () => {

    const deviceIdToken = localStorage?.getItem('deviceIdToken');
    try {
      await deleteDeviceRegisterToken(deviceIdToken);
    } catch (error) {
      handleErrorResponse(error);
    }

    if (typeof window !== "undefined") {
      localStorage.clear();
      console.log("Logged out");
      router.push("/");
    }
  };

  const updateNotificationCount = () => {
    setNotificationsCount(0);
    fetchNotifications();
    console.log("noti count : ", notificationsCount);
  };


  const sendDeviceIdTokenToBackend = async () => {
    try {

      const deviceIdToken = localStorage?.getItem('deviceIdToken');

      if (deviceIdToken) {

        const response = await deviceRegister(deviceIdToken);

        if (response.ok) {
          console.log('Device ID token sent successfully!');
        } else {
          console.error('Error sending device ID token:', response.statusText);
        }
      } else {
        console.warn('Device ID token not found');
      }
    } catch (error) {
      console.error('Error sending device ID token:', error);
    }
  };

  return (
    <>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: "8px",
          background: "white",
          color: "black",
          fontSize: "16px",
          padding: "16px",
          border: "4px solid #3883ce",
          fontFamily: "times",
        },
        success: {
          background: "green",
        },
        error: {
          background: "red",
        },
      }}
    />
    <Navbar
      isToggled={isToggled}
      handleToggle={handleToggle}
      handleLogout={handleLogout}
      userType={userType}
      notificationsCount={notificationsCount}
      notifications={notifications}
      updateNotificationCount={updateNotificationCount}
    />

    <div id="wrapper" className={`${isToggled ? "toggled" : ""}`}>
      <div
        id="sidebar-wrapper"
        style={{ position: "fixed", height: "100vh", overflowY: "auto" }}
      >
        <ul className="sidebar-nav">
          <li className="sidebar-brand " style={{ fontSize: "17px" }}>
            {dashboardContent.map((item, index) => (
              <a key={item.label} href={item.link}>
                <i className={item.icon}> </i> {item.label}
              </a>
            ))}
          </li>
        </ul>
      </div>

      <div
        id="page-content-wrapper position-absolute top-0 overflow-hidden "
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 56px)" }}
      >
        <div className="container" style={{ marginTop: "10px" }}>
          {children}
        </div>
      </div>
    </div>
  </>);

};

ExamateLayout.propTypes = {
  dashboardContent: PropTypes.array.isRequired};


export default ExamateLayout;

function pushNotification(payload, messageClientId, clientId, updateUnReadMessageCount, setUserIdValue, notification, body) {
  console.log("messageId",messageClientId)
  console.log("client",clientId);
  if (payload.data.type === "chatMessage" && messageClientId !== clientId) {
    console.log("Body", payload.data.client_id);

    console.log("PathName", window.location.pathname);
    updateUnReadMessageCount();
    setUserIdValue(payload.data.client_id);
    toast(`${notification.title}: ${body}`, {
      icon: <FontAwesomeIcon icon={faComment} />
    });

  } else if (payload.data.type==="ticket_notification") {
    toast(`${body}`);
  }
}
