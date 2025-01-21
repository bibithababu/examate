import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  examDetails,
  examQuestions,
  regenerateQuestions,
} from "@/services/ApiServices";
import "./examquestionlist.css";
import { useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { handleErrorResponse } from "@/middlewares/errorhandling";

const ExamQuestions = () => {
  const [examSubjectData, setExamSubjectData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const examid = searchParams.get("id");
  const [expanded, setExpanded] = useState({}); 

  useEffect(() => {
    const fetchExamSubject = async () => {
      try {
        const response = await examDetails(examid);
        setExamSubjectData(response.data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    fetchExamSubject();
  }, [examid]);

  const handleRegenerateQuestions = async () => {
    console.log("Attempting to regenerate questions...");
    setLoading(true);
    try {
      const subjectid = selectedSubject.subject;
      const response = await regenerateQuestions(examid, subjectid);
      handleSubjectClick(selectedSubject.id);

      console.log("Questions regenerated successfully:", response);
    } catch (error) {
      console.log("list",error)
      handleErrorResponse(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = async (subjectId) => {
    console.log("exam subject is", subjectId);
    const selected = examSubjectData.subjects.find(
      (subject) => subject.id === subjectId
    );
    setSelectedSubject(selected);
    try {
      const response = await examQuestions(subjectId);
      setQuestions(response.data.questions);
      setAnswers(response.data.answers);
      console.log("exam questions", response.data.questions);
      console.log("exam answers", response.data.answers);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleArrowClick = (questionId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [questionId]: !prevExpanded[questionId],
    }));
  };

  return (
    <div className="container">
      <ToastContainer/>
      <div className="card" style={{ width: "75%", marginTop: "2%" }}>
        <ul
          className="nav nav-tabs"
          style={{ position: "relative", height: "auto",zIndex:10,top:0,width:'100%',left:0 }}
        >
          {examSubjectData?.subjects?.map((subject, index) => (
            <li className="nav-item" key={subject.id}>
              <button
                className={`nav-link ${
                  selectedSubject?.id === subject.id ? "active" : ""
                }`}
                onClick={() => handleSubjectClick(subject.id)}
                data-testid={`subject-button-${index}`}
              >
                {subject.subjectname}
              </button>
            </li>
          ))}
        </ul>
        {selectedSubject && (
          <>
            <ul
              className="question-list"
              style={{ listStyleType: "decimal"}}
            >
              {questions.map((question, index) => (
                <li key={question.id}>
                  <button
                    className="btn btn"
                    type="button"
                    onClick={() => handleArrowClick(question.id)}
                    aria-expanded={expanded[question.id]}
                  >
                    <span
                      style={{
                        color: "black",
                        textDecoration: "none !important",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      {question.question_description}
                    </span>
                    {expanded[question.id] ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </button>

                  {expanded[question.id] && (
                    <div className="card-body" style={{ color: "#7D7C7C" }}>
                      <strong>Answer : </strong>

                      {answers.find((answer) => answer.question === question.id)
                        ? answers.find(
                            (answer) => answer.question === question.id
                          ).answer
                        : answers
                            .filter(
                              (answersArray) =>
                                Array.isArray(answersArray) &&
                                answersArray.some(
                                  (answer) => answer.question === question.id
                                )
                            )
                            .map((answersArray, optionIndex) => (
                              <div key={answersArray[0].created_at}>
                                {answersArray.map((option) => (
                                  <div key={option.created_at}>
                                    {option.options}
                                    {option.is_answer && (
                                      <strong>(Correct)</strong>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {examSubjectData.status === 1 && (
              <button
                className="button"
                onClick={handleRegenerateQuestions}
                data-testid="regenerate-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="svg-icon"
                      fill="none"
                      height="20"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g stroke="#fff" strokeLinecap="round" strokeWidth="1.5">
                        <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
                        <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
                      </g>
                    </svg>
                    <span className="lable">Regenerate</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExamQuestions;
