
import React, { useEffect,useState } from "react";
import './dashboard.css'
import { Row } from "react-bootstrap";
import DashboardCard from "./dashboardcard";
import { getexamscount } from "@/services/ApiServices";
import ListCard from "./listcard";


const Dashboard = () => {
    const[examscount,setExamCount] = useState()

    useEffect(() => {
      fetchcount();
    }, []);

    const fetchcount = async () => {
      try{
        const response = await getexamscount();
        setExamCount(response?.data)

      }
      catch(error)
      {
        console.log("error")
      }
    }
    console.log("examcount :",examscount)
  return (
    <div className="container-fluid">
      <div className="dashboardcontainer">
        <Row className="row gy-3">
          <DashboardCard content={'EXAMS'} count={examscount?.total_count}/>
          <DashboardCard content={'PENDING VALUATIONS'} count={examscount?.completed_exams}/>
          <DashboardCard content={'COMPLETED'} count={examscount?.completed_exams}/>
          <DashboardCard content={'UPCOMING EXAMS'} count={examscount?.upcoming_exams}/>
        </Row>
        <Row className="row gy-3">
          <ListCard content={'UPCOMING EXAMS'} filterStatus={0}/>
          <ListCard content={'PENDING VALUATIONS'} filterStatus={1}/>
          <ListCard content={'RESULTS'} filterStatus={2}/>
      </Row>
      </div>
      </div>
  );
};

export default Dashboard;
