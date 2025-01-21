"use client";
import { useEffect, useState, useRef } from 'react';
import './chatroom.css'

import {  viewProfile, getMessages, updateMessagesReadStatus } from '@/services/ApiServices'
import { handleErrorResponse } from '@/middlewares/errorhandling'
import { useReceiver } from '@/context/receiverContext'
import { handleChatError, setDirection,setImage,setMargin, setUser } from './chatRoomUtilities'
import Avatar from 'react-avatar'
import { toast,ToastContainer } from 'react-toastify'
import { useForm } from 'react-hook-form';

function Chatroom() {
 
  const [chatSocket, setChatSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [isAdminLoggedIn,setIsAdminLoggedIn] = useState(false)
  const [receiverInfo, setReceiverInfo] = useState({
    name: "",
    profileImage: ""
  });
  const [flag,setFlag] = useState(null)
  const {clientId, setClientValue} = useReceiver()
  const chatMessagesRef  = useRef(null)
  const { register, handleSubmit, formState: { errors } } = useForm();

  const PROFILE_IMAGE_BASE_URL=process.env.NEXT_PUBLIC_PROFILE_IMAGE_BASE_URL
  const WEBSOCKET_BASEURL = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT;
  
  
  let client;
  let messageResponses;
 

  const fetchUserDetails = async () => {
    try {
     
  
     
      const response = await viewProfile()
      console.log("USER DETAILS: ", response.data)
     
      if(response.data.user_type===0){
        const user = (window?.localStorage ?? null)?.getItem('user');
        if(user!=null){
          const userData = JSON.parse(user)
            setReceiverInfo({name:userData.name,profileImage:userData.profileImage})
            setIsAdminLoggedIn(true)
            setFlag(0)
        }
        
      }else {
        setReceiverInfo({name:"Examate",profileImage:null})
        setClientValue(response.data.id)
        setIsAdminLoggedIn(false)
        setFlag(1)
      }
     
      messageResponses= await getAllMessages()
     setMessages(prevMessages => [...prevMessages, ...messageResponses.data])
    
     
    } catch (error) {
      handleErrorResponse(error)
    }


  }
  const formatTime = (timeString) => {
    const date = new Date(timeString)
   
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedTime = `${formattedHours}: ${formattedMinutes}`
    return formattedTime

  }
  useEffect(() => {
   
    fetchUserDetails()
    
    return ()=>{
      localStorage.removeItem("clientId");
    }
    
  }, []);



  useEffect(()=>{
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  },[messages])

  useEffect (()=>{
   

    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const accessToken = authTokens?.accessToken;
      const socket = new WebSocket(`${WEBSOCKET_BASEURL}/ws/chat/?client_id=${clientId}&token=${accessToken}`);
      console.log("I am admin",socket);
  
   
      setChatSocket(socket);
  

  

    return () => {

      console.log('Closing WebSocket connection...');
      socket.close();
    };
  },[clientId])



  useEffect(() => {
    if (chatSocket) {
      chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          setMessages(prevMessages => [...prevMessages, data]); 
        }else {
          toast.error(handleChatError(data),{autoClose:2000})
         
        }
      
      };
    }

  }, [chatSocket]);

  useEffect(()=>{
    markMessagesAsRead()
   
  },[messages])

  

  const sendMessage = async () => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      const messageData = {
        client: clientId,
        message: message,
        flag: flag,
        
      };
     
      if(messageData.message!==""){
        chatSocket.send(JSON.stringify(messageData));
        setMessage('');
      }
    }
  };

  const markMessagesAsRead = async()=>{
   
      try{
        if(isAdminLoggedIn){
          const responses = await getAllMessages(1)
          console.log("Admin logged get messages",responses)
          const latestMessageId = responses.data.length > 0 ? responses.data[responses.data.length-1].id:0
          await updateMessagesReadStatus(latestMessageId,clientId)
         
        }else{
          const responses = await getAllMessages(0)
          console.log("Yes it is",responses.data)
          const latestMessageId = responses.data.length > 0 ? responses.data[responses.data.length-1].id:0
          await updateMessagesReadStatus(latestMessageId)
         
        }
      
        
      }catch(error){
        console.log("Error in updating is_read",error)
      }
    
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value);
   
  };

  const onSubmit = () => {
    sendMessage()
  };

  const handleKeyDown = (event)=>{
    if(event.key === 'Enter'){
      event.preventDefault()
      sendMessage()
    }
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const messageDate = new Date(message.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let displayDate;

    if (isSameDate(messageDate, today)) {
        displayDate = 'Today';
    } else if (isSameDate(messageDate, yesterday)) {
        displayDate = 'Yesterday';
    } else {
      const day = messageDate.toLocaleDateString('en-US', { day: '2-digit' });
      const month = messageDate.toLocaleDateString('default', { month: 'short' }); 
      const year = messageDate.getFullYear();
      displayDate = `${day} ${month} ${year}`;
    }

    if (!groups[displayDate]) {
        groups[displayDate] = [];
    }
    groups[displayDate].push(message);
    return groups;
}, {});


function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}



  return (
    <div>
      <ToastContainer position="top-right" autoClose={false} />
      <main className="content" >
        <div className="container p-0">
         
        
            <div className=" row g-0">
             
              <div ref={chatMessagesRef} className=" chat-messages  col-12 col-lg-7 col-xl-9 ">
              <div className="py-2 px-4 border-bottom sticky-top bg-white">
              {receiverInfo ? (
  <div className="d-flex align-items-center py-1">
    <div className="position-relative">
      {receiverInfo.profileImage ? (
        <img
          src={`${PROFILE_IMAGE_BASE_URL}${receiverInfo.profileImage}`}
          className="rounded-circle mr-1"
          alt={receiverInfo.name || "User"}
          width={40}
          height={40}
        />
      ) : (
        <Avatar name = {receiverInfo.name} size="40" round />
      )}

            </div>
            <div className="flex-grow-1 pl-3 ms-2">
                <strong>{receiverInfo.name}</strong>
            </div>
            <div>
                <button className="btn btn-light border btn-lg px-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-more-horizontal feather-lg"
                    >
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={19} cy={12} r={1} />
                        <circle cx={5} cy={12} r={1} />
                    </svg>
                </button>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    )}
</div>

                <div className="position-relative">
              

                    {Object.entries(groupedMessages).map(([date, messages]) => (
                      <div key={date}>
                        <div className="text-center mt-3 mb-2">{date}</div>
                        {messages.map((msg, index) => (
                          <div key={index++} className={`chat-message-${setDirection(isAdminLoggedIn,msg.flag)} pb-4`}>
                            <div>
                           
                              {setImage(isAdminLoggedIn,msg.flag)!==null && setImage(isAdminLoggedIn,msg.flag)!==true  ?(<img
                                 src={`${PROFILE_IMAGE_BASE_URL}${setImage(isAdminLoggedIn,msg.flag)}`}
                                className="rounded-circle mr-1"
                                alt={`User `}
                                width={40}
                                height={40}
                              />):( <Avatar
    
                                name={setImage(isAdminLoggedIn, msg.flag) === true ? "Examate" : setUser(isAdminLoggedIn, msg.flag)}
                                size="40"
                                round
                                
                              />)}
                              
                              <div className="text-muted small text-nowrap mt-2">{formatTime(msg.date)}</div>
                            </div>
                            <div className={`flex-shrink-1 bg-light rounded py-2 px-3 ${setMargin(isAdminLoggedIn,msg.flag)} ${msg.message.length > 50 ? 'long-message' : ''}`}>
                              <div className="font-weight-bold mb-1 message-body">{setUser(isAdminLoggedIn,msg.flag)}</div>
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                    ))}

          
{errors.message && (
    <span className="text-danger">{errors.message.message}</span>
  )}
                </div>
               
               
                <div className="flex-grow-0 py-3 px-4 border-top sticky-bottom bg-white">
                  <div className="input-group sticky-bottom">
                 
                    <input
                      type="text"
                      className={`form-control ${errors.messages? 'is-invalid':''}`}
                      placeholder="Type your message"
                      value={message}
                     
                      onKeyDown={handleKeyDown}
                      {...register("message", {
                        required: true,
                        maxLength: { value: 50, message: "Message must be less than 50 characters" },
                        onChange: (e) => handleInputChange(e)
                      })}
                      
                    />
                   
                    <button type='button' onClick={handleSubmit(onSubmit)} className="btn btn-primary">Send</button>

                  
                  </div>
                </div>
              
              </div>
            </div>
       
        </div>
      </main>
    </div>
  )

  async function getAllMessages(flag=-1) {
    const clientIdFromLocalStorage = (window?.localStorage ?? null)?.getItem('clientId')


    if (clientIdFromLocalStorage) {
      console.log("setted to context")
      setClientValue(JSON.parse(clientIdFromLocalStorage))

    }
    client = clientIdFromLocalStorage ? JSON.parse(clientIdFromLocalStorage) : clientId
    const response = await getMessages(client,flag)
    return response
  
  }
}

export default Chatroom
