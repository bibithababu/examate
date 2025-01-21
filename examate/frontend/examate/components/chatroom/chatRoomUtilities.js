
import { useConsumer } from "@/context/consumerDetailsContext"


export const setDirection = (isAdmin,flag)=>{
    if(isAdmin){
        if(flag===0){
            return "right"
        }else{
            return 'left'
        }
    }else if(!isAdmin){
        if(flag===0){
            return "left"
        }else{
            return "right"
        }
    }
}

export const setMargin = (isAdmin,flag)=>{
    if(isAdmin){
        if(flag===0){
            return "mr-3"
        }else{
            return 'ml-3'
        }
    }else if(!isAdmin){
        if(flag===0){
            return "ml-3"
        }else{
            return "mr-3"
        }
    }
}

export const setUser = (isAdmin,flag)=>{
    const {consumerName} = useConsumer()
    const user = (window?.localStorage ?? null)?.getItem('user');
    const userData=JSON.parse(user)
    if(isAdmin){
        if(flag===0){
            return "You"
        }else{
            return userData?.name?userData.name:consumerName
        }
    }else if(!isAdmin){
        if(flag===0){
            return "Admin"
        }else{
            return "You"
        }
    }
}




export const setImage = (isAdmin,flag) => {
 
    const {consumerProfile} = useConsumer()
    const user = (window?.localStorage ?? null)?.getItem('user');
    let profileImage = null
    console.log("consumer",consumerProfile)
    if(user!==null){
        const userData = JSON.parse(user);
        if (isAdmin || !isAdmin){
            if (flag==0){
               return true
    
            }else{
                profileImage=userData?.profileImage || consumerProfile
            }
          
            if(profileImage==='' || profileImage===null){
                return null
            }
           
        }

    }
        
    return profileImage

     
   
};

export const handleChatError=(data)=>{
   if(data.type=="save_message"){
    return "Message not sent"
   }else if(data.type=="push_notification"){
    return "Message is not notified"
   }else {
    return "Error in connection"
   }
}