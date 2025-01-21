"use client";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./questions.css";
import { React, useState, useEffect } from "react";
import { subjectListing } from "@/services/ApiServices";
import { useRouter } from "next/navigation";

export default function Questions() {
  const [subjectsData, setSubjectsData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectListing("/examate/subjects/list/");
        setSubjectsData(response.data.results);
        console.log("subjects", response.data.results);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddQuestion = () => {
    router.push("admin/question-list");
  };

  return (
    <div className="progress-div" style={{ marginTop: "1%" }}>
      &nbsp;&nbsp;&nbsp;&nbsp;<h5 style={{color:'#05004E'}}><strong>Subjects</strong></h5>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
      <br />&nbsp;&nbsp;&nbsp;&nbsp;<button
        type="button"
        className="btn btn-outline-primary rounded my-custom-button "
        style={{
          height: "2rem",
          padding: "10px",
          width: "18rem",
          marginBottom: "7px",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        onClick={handleAddQuestion}
      >
        <i className="bi bi-plus-lg"></i>{" "}
        <h6 style={{ color: "#5A6ACF", fontSize: "x-small" }}>
          Add Questions +
        </h6>
      </button>
      <table
        className={styles.progressBarTable}
        style={{ width: "100%", height: "50%" }}
      >
        <thead className="text1" style={{ color: "GrayText",fontFamily:'serif' }}>
          <tr>
            <th style={{ width: "30%",padding:'5%' }}>Subjects</th>
            <th style={{ width: "30%",padding:'5%' }}>Count</th>
          </tr>
        </thead>
        <tbody
          className="text"
          style={{ color: "black", fontSize: "medium", textAlign: "left" }}
        >
          {subjectsData.slice(0, 3).map((subject, index) => (
            <tr key={subject.id}>
              <td style={{ padding: "5%" }}><strong>
                {subject.subject_name}</strong>
                <br />
                <span className="text-muted" style={{ fontSize: "smaller" }}>
                  {new Date(subject.created_at).toLocaleDateString()}
                </span>
              </td>

              <td style={{ padding: "5%" }}><strong>
                {subject.question_count}</strong>
                <br />
                <span className="text-muted" style={{ fontSize: "smaller" }}>
                  Questions
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
