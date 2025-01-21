"use client";
import {getUnreadMessagesCount } from "@/services/ApiServices";
import { createContext, useContext, useMemo, useReducer, useState } from "react";


const MessageStatusContext = createContext();

const initialState={
    messagesCount:0,
   
}


const messageStatusReducer = (state,action) => {

    if (action.type === 'SET_COUNTS') {
        console.log("Action",action.payload.messagesCount);
        return {
            messagesCount:action.payload.messagesCount,
           
        };
    }else if(action.type==="RESET"){
        return {
            messagesCount:0
        }
    }
    return state;
    }



export const MessageStatusProvider = ({children}) =>{
    const [unRead,dispatch] = useReducer(messageStatusReducer,initialState)
    const [userId,setUserId] = useState([])

    const setUserIdValue = (id)=>{
        console.log("Id from context",id);
        setUserId(...userId,id)
    }
    const resetUnReadMessagesCount=()=>{
        dispatch({
            type:"RESET"
        })
    }


    const updateUnReadMessageCount = async (clientId=null) => {
        console.log("I am called get")
        try {
          const response = await getUnreadMessagesCount(clientId)
          console.log("From message context",response.data.count);
          dispatch({
            type: 'SET_COUNTS',
            payload:{
                messagesCount:response.data.count,
            
            }
        })
      
        } catch (error) {
            console.error("Error updating unread message count:", error);
        throw error
        }
    }

   

    const contextValue = useMemo(() => ({
        unRead,
        userId,
        setUserIdValue,
        updateUnReadMessageCount,
        resetUnReadMessagesCount
    }), [unRead,userId]);
    
    return(
        < MessageStatusContext.Provider value={contextValue}>
            {children}
        </ MessageStatusContext.Provider>
    )
    }

export const useMessageStatus = () => useContext(MessageStatusContext)
