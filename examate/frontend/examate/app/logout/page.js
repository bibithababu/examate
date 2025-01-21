import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


function Logout()

{   if (typeof window !== 'undefined') {
   
    localStorage.clear();
    console.log("Logged out");
   
  }
  return(
    <a href="/admin">hello</a>
  )


}
export default Logout;