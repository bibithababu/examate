"use client"
import {useRouter} from 'next/navigation'
import React,{useEffect} from 'react'

const requireEmailAuthentication=(WrappedComponent)=>{
    return(props)=>{
        const router = useRouter()

        useEffect(()=>{
            const forgetPasswordToken = localStorage.getItem('forgetPasswordToken')

            if(!forgetPasswordToken){
                router.push('/login')
                return null
            }
        },[])
       

        try{
            return <WrappedComponent {...props}/>
        }catch(error){
            router.push('/login')
        }
    }
}

const requireOtpAuthentication=(WrappedComponent)=>{
    return(props)=>{
        const router = useRouter()
        useEffect(() => {
            const otp = localStorage.getItem('otp');

            if (!otp) {
                router.push('/login');
            }
        }, []);

        

        try{
            return <WrappedComponent {...props}/>
        }catch(error){
            router.push('/login')
        }
    }
}

const requireRegisterTokenAuthentication=(WrappedComponent)=>{
    return(props)=>{
        const router = useRouter()

        useEffect(()=>{
            const registerToken = localStorage.getItem('registerToken')

            if(!registerToken){
                router.push('/register')
                return null
            }
    
        },[])
       
        try{
            return <WrappedComponent {...props}/>
        }catch(error){
            router.push('/register')
        }
    }
}
const requireAdminLoginAuthentication=(WrappedComponent)=>{
    return(props)=>{
        const router = useRouter()
        const userRole = localStorage.getItem('userRole')
      

        if(userRole!=0){
            router.replace('/login')
            
        }

        try{
            return <WrappedComponent {...props}/>
        }catch(error){
            router.push('/login')
        }
    }
}
const requireOrganizationLoginAuthentication=(WrappedComponent)=>{
    return(props)=>{
        const router = useRouter()
        const userRole = localStorage.getItem('userRole')
      

        if(userRole!=1){
            router.push('/login')
            return null
        }

        try{
            return <WrappedComponent {...props}/>
        }catch(error){
            router.push('/login')
        }
    }
}



export {requireEmailAuthentication,
        requireOtpAuthentication,
        requireRegisterTokenAuthentication,
        requireAdminLoginAuthentication,
        requireOrganizationLoginAuthentication}