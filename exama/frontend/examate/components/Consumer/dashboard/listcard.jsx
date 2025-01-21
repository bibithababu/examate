import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Col } from "react-bootstrap";
import { getexamslist } from "@/services/ApiServices";
import {formatTimedata} from "@/utils/common.functions";
import {useRouter } from 'next/navigation';

const ListCard = (props) => {
  const { content } = props;
  const {filterStatus} =props;
  const [list, setList] = useState([]);
  const router=useRouter();


  const fetchExams = async (filterStatus) => {
    console.log('in fetch exams :',filterStatus)
    try {
      const response = await getexamslist(filterStatus);
      setList(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    console.log("in use effect")
    fetchExams(filterStatus);
  },[]);

  const navigateToExam=(id)=>{
    
    router.push(`/consumer/exam-detail?id=${id}`)
  }

console.log("exams list :",list)
  return (
    <Col
      xs={12}
      sm={12}
      md={6}
      lg={4}
      style={{ marginBottom: "3%", height: "450px" }}
    >
      <div className={`dashboardcard`}>
        <div className="card-details">
        <div className='list-title'>{content}</div>
<hr></hr>
            {" "}
            <div className='examname'>
            {list?.map((exam,index) => (
  <figure key={exam.id}> {/* Provide a unique key prop */}
    <blockquote className="blockquote">
     <p style={{"cursor":"pointer"}} onClick={()=>navigateToExam(exam.id)}>{index+1}.{exam.name}</p>
    </blockquote>
    <figcaption className="blockquote-footer">
      {formatTimedata(exam.scheduled_time)} 
    </figcaption>
  </figure>
))}
</div>
          </div>

      </div>
    </Col>
  );
};

export default ListCard;
