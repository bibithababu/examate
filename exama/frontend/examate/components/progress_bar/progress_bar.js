"use client";
import React, { useState, useEffect } from "react";
import { ProgressBar as BootstrapProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./progress_bar.css";
import { subjectPopularityCount } from "@/services/ApiServices";
import { useRouter } from "next/navigation";

const ProgressBar = () => {
  const [subjectsData, setSubjectsData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjectsPopularity = async () => {
      try {
        const response = await subjectPopularityCount();
        setSubjectsData(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjectsPopularity();
  }, []);

  const handleAddSubject = () => {
    router.push("admin/addsubject");
  };

  return (
    <>
       <h5 style={{color:'#05004E'}}><strong>Top Subjects</strong></h5> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<button
        type="button"
        className="btn btn-outline-primary rounded my-custom-button "
        style={{
          height: "2rem",
          padding: "10px",
          width: "6rem",
          marginBottom: "7px",
          marginLeft: "33%",
        }}
        data-testid="addsubject"
        onClick={handleAddSubject}
      >
        <i className="bi bi-plus-lg"></i>{" "}
        <h6 style={{ color: "#5A6ACF", fontSize: "xx-small" }}>
          Add Subjects +
        </h6>
      </button>
      <div
        className="card"
        style={{
          height: "auto",
          width: "auto",
          border: "ButtonShadow",
        }}
      >
        <table className={styles.progressBarTable}>
          <thead className="text" style={{ color: "GrayText" }}>
            <tr>
              <th style={{ textAlign: "left" }}>Subject</th>
              <th style={{ textAlign: "left", padding: "3%" }}>Popularity</th>
            </tr>
          </thead>
          <tbody
            className="text"
            style={{ color: "black", fontSize: "medium", textAlign: "left" }}
          >
            {subjectsData.slice(0, 4).map((subject, index) => (
              <tr key={subject.id}>
                <td>{subject.subject_name}</td>
                <td style={{ padding: "3%" }}>
                  <BootstrapProgressBar
                    now={subject.percentage}
                    className={`${styles.progressBar} thin-progress-bar`}
                    data-testid="progress-bar"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProgressBar;
