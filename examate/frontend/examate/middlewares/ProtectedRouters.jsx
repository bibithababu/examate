import {useRouter } from "next/navigation";
import { useEffect, useState } from "react";



function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [isPageReady,setIsPageReady] = useState(false)
  useEffect(() => {
    const userRole = (window?.localStorage ?? null)?.getItem('userRole');

    if (userRole !== '0') { 
      router.replace('/login')
    }else{
      setIsPageReady(true)
    }
  }, []);

 return isPageReady ? children:null
}
function ConsumerProtectedRoute({ children }) {
  const router = useRouter();
  const [isPageReady,setIsPageReady] = useState(false)
  useEffect(() => {
    const userRole = (window?.localStorage ?? null)?.getItem('userRole');

    if (userRole !== '1') { 
      router.replace('/login')
    }else{
      setIsPageReady(true)
    }
  }, []);

 return isPageReady ? children:null
}



function ExamPagesProtectedRoute({ children }) {
  const router = useRouter();
  const [isPageReady,setIsPageReady] = useState(false)
  useEffect(() => {
    const examAccessToken = (window?.localStorage ?? null)?.getItem('exam_access_token');

    if (examAccessToken === null) { 
      router.replace('/not-found')
    }else{
      
      setIsPageReady(true)
    }
  }, []);

 return isPageReady ? children:null
}

function ChatRoomProtectedRoute({children}){
  const router = useRouter();
  const [isPageReady,setIsPageReady] = useState(false)

  useEffect(()=>{
    const clientId = (window?.localStorage ?? null)?.getItem("clientId");
    if(clientId===null){
      router.replace('/not-found')
    }else{
      setIsPageReady(true)
    }
  },[])
  return isPageReady ? children:null
}

export { AdminProtectedRoute,ExamPagesProtectedRoute, ConsumerProtectedRoute,ChatRoomProtectedRoute};
