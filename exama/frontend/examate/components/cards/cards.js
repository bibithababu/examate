"use client";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useEffect } from "react";
import { FaBuilding, FaQuestionCircle } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoMdListBox } from "react-icons/io";
import {
  TotalCount,
} from "@/services/ApiServices";
import CardComponent from "./cardcomponent";


export default function Card() {
  const [organisationCount, setOrganisationCount] = useState(10);
  const [questionCount, setQuestionCount] = useState("");
  const [subjectCount, setSubjectCount] = useState("");
  const revenue = 125634;

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await TotalCount();
        setQuestionCount(response.data.total_question_count);
        setSubjectCount(response.data.total_subject_count);
        setOrganisationCount(response.data.total_organisation_count);

        console.log("Qusetion Count", response.data.question);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchCount();
  }, []);



  function formatNumber(number) {
    if (number < 1000) {
      console.log("formatNumber", number);
      return number;
    }
    console.log("formatNumber", number);
    // Handle numbers with thousands separators (customizable)
    return (number / 1000).toFixed(3) + "K";
  }

  return (
    <div>
      <div className="row d-flex justify-content-between">
        <CardComponent
          icon={<FaBuilding color="BF83FF" size="2.5em" />}
          color="#FFE2E5"
          title="Total Organization"
          count={organisationCount}
        />
        <CardComponent
          icon={<FaQuestionCircle color="FF947A" size="2.5em" />}
          color="#FFF4DE"
          title="Total Questions"
          count={questionCount}
        />
        <CardComponent
          icon={<IoMdListBox color="3CD856" size="2.5em" />}
          color="#DCFCE7"
          title="Total Subject"
          count={subjectCount}
        />
        <CardComponent
          icon={<BsCurrencyDollar color="FA5A7D" size="2.5em" />}
          color="#F3E8FF"
          title="Total Revenue"
          count={formatNumber(revenue)}
        />
      </div>
    </div>
  );
}
