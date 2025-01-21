"use client"

import { useLayoutEffect } from "react"
import { redirect } from "next/navigation"

export const requireAdminLoginAuthentications=(WrappedComponent)=>{
    return(props)=>{ 
         useLayoutEffect(()=>{
            const userRole = localStorage.getItem('userRole')
            if(userRole!=0){
                redirect('/login')   
            }
         },[])
            return <WrappedComponent {...props}/>
      
    }
}
