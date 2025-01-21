"use client";
import Chatroom from '@/components/chatroom/Chatroom'
import {ChatRoomProtectedRoute} from "@/middlewares/ProtectedRouters"

function page() {
  return (

    <div>
       <ChatRoomProtectedRoute> 
      <Chatroom/>
     </ChatRoomProtectedRoute>
    </div>
   
  )
}

export default page
