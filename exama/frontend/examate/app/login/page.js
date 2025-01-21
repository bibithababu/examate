import React from 'react'
import  Login  from '@/components/login/login'
import { GoogleOAuthProvider } from '@react-oauth/google';


const page = () => {
    return (
      <GoogleOAuthProvider clientId='28601681894-qa3fqh5mb2rs7kn9lcj4nb9foe3tbih5.apps.googleusercontent.com'>

    
        <Login/>
        </GoogleOAuthProvider>
    )
  }
  
export default page
