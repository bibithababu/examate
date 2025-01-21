"use client";
import "bootstrap/dist/css/bootstrap.css";
import { React, useState, useEffect } from "react";
import { examDetails } from "@/services/ApiServices";
import { FaRegEdit } from "react-icons/fa";
import CreateExamModal from "../createexammodal/CreateExamModal";
import CandidateList from "../candidate-list/CandidateList";
import { useSearchParams, useRouter } from "next/navigation";
import EvaluatedCandidate from "../Consumer/EvaluatedCandidateList/EvaluatedCandidateList";
import { handleErrorResponse } from "@/middlewares/errorhandling";


const ExamDetails = () => {
  const searchParams = useSearchParams();
  const examid = searchParams.get("id");
  const [examData, setExamData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await examDetails(examid);
        setExamData(response.data);
      } catch (error) {
        handleErrorResponse(error);
      }
    };

    fetchExamDetails();
  }, [examid]);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
    const date = dateTime.toLocaleDateString(undefined, dateOptions);

    const time = dateTime.toLocaleTimeString();
    return { date, time };
  };

  const handleViewQuestions = () => {
    router.push(`examquestion-list?id=${examid}`);
  };

  const handleViewFeedback = () => {
    if (examData.status === 0) {
      alert("Exam not completed!");
    } else {
      router.push(`feedback-list?id=${examid}`);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchExamDetails();
  };

  const handleEdit = () => {
    setIsUpdate(true);
    openModal();
  };
  const statusLabels = {
    0: "Drafted",
    1: "Confirmed",
    2: "Completed",
    3: "Evaluated",
    4: "Result_published",
    5:"Cancelled"
  };

  return (
    <div>
      <div className="container" style={{ marginTop: "1%" }}>
        <h2
          style={{ fontFamily: "serif", marginBottom: "2%" }}
          data-testid="exam-name"
        >
          {examData?.name}&nbsp;&nbsp;
          <FaRegEdit
            onClick={examData.status !== 2 ? handleEdit : null}
            size={20}
            disabled={examData.status === 2}
            style={{
              cursor: examData.status >0 ? "not-allowed" : "pointer",
            }}
            data-testid="edit-icon"
          />
        </h2>
        <div
          className="card"
          style={{
            height: "10rem",
            width: "18rem",
            background: "#F3F8FF",
            border: "ButtonShadow",
          }}
        >
          <table style={{ width: "80%", height: "80%" }}>
            <tbody
              className="text"
              style={{
                color: "#505050",
                textAlign: "left",
                padding: "1%",
              }}
            >
              <tr>
                <td>Scheduled Date</td>
                <td data-testid="scheduled-date-value">
                  {examData?.scheduled_time ? formatDateTime(examData.scheduled_time).date : 'Not provided'}
              </td>
              </tr>
              <tr>
                <td>Scheduled Time</td>
                <td data-testid="scheduled-time-value">
                {examData?.scheduled_time ? formatDateTime(examData.scheduled_time).time : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td>Total candidates</td>
                <td data-testid="count">{examData.candidate_count}</td>
              </tr>
              <tr>
                <td>Subject</td>
                <td data-testid="subject">
                {examData.subjects && examData.subjects.length !== 0 ? (
                    examData.subjects.map((subject, index) => (
                        <span key={subject.id}>{subject.subjectname}, </span>
                    ))
                ) : (
                    <span>Not provided</span>
                )}
            </td>
              </tr>
              <tr>
                <td data-testid="status">Status</td>
                <td style={{ color: examData.status === 0 ? "red" : "green" }}>
                  {statusLabels[examData.status]}
                </td>
              </tr>
              <tr>
  {examData.status !== 0 && examData.candidate_count !== 0 &&( 
    <a
      data-testid="View question"
      className="menu__link"
      onClick={handleViewQuestions}
      style={{ cursor: "pointer" }}
    >
      View question!
    </a>
  )}
</tr>
              <tr>
              {examData.status !== 0 && examData.candidate_count !== 0 &&( 
                <a
                  data-testid="View feedback"
                  className="menu__link"
                  onClick={handleViewFeedback}
                  style={{ cursor: "pointer" }}
                >
                  View feedback!
                </a>
                 )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {isUpdate ? (
        <CreateExamModal
         
          isUpdate={isUpdate}
          id={examid}
          isOpen={isModalOpen}
          onClose={closeModal}
          data-testid="create-exam-modal" 
        />
      ) : null}
      

      <div>
  {examData.status < 2 && (
    <div>
      <CandidateList examid={examid} />
    </div>
  )}
  {examData.status >= 2 && examData.status !== 5 && (
    <div>
      <EvaluatedCandidate examId={examid} />
    </div>
)}
</div>
    </div>
  );
};
export default ExamDetails;
