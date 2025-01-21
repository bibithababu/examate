"use client";
import {React,useState, useEffect } from "react";
import { examlinkExpire } from "@/services/ApiServices";
import { useParams } from "next/navigation";
import ExamInvitationCard from "@/components/examinvitationcard/ExamInvitationCard";

const Page = () => {
  const { token } = useParams();
 
  const [expired, setExpired] = useState(false);

  localStorage.setItem("exam_access_token",token)
  const checkTokenExpiration = async () => {
    try {
      const response = await examlinkExpire({ token: token });
    
      if (response.statusText == "OK") {
       
        setExpired(response.data.expired);
        
      } else {
        console.error("Failed to check token expiration");
      }
    } catch (error) {
      console.error("Error during token expiration check", error);
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, [token]);



  if (expired) {
    console.log("inside component",expired)
    return (
      <div className="container" style={{marginLeft:'30%',marginTop:'20%'}}>
        <div className="row">
          <div className="col-md-12">
            <div className="error-template">
              <h1 style={{ color: "blue" }}>Oops!</h1>
              <h2 style={{ color: "blue" }}>Link is not active</h2>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return ( <ExamInvitationCard token = {token}/>);
  }
};

export default Page;
