import React, { useState, useEffect, useRef } from "react";
import "./exampage.css";
import { useSearchParams,useRouter } from "next/navigation";
import {
  examsubjectListing,
  enduserservices,
} from "@/services/ApiServices";
import Swal from "sweetalert2";
import ExamTimer from "../EndUser/ExamTimer/ExamTimer";
import ExamSummary from "./examsummary";


const ExamPage = () => {
  const searchParams = useSearchParams();
  const examid = searchParams.get("id");
  const token = localStorage?.getItem("exam_access_token");
  const examtoken = token;
  const [subjects, setSubjects] = useState([]);
  const [currentsubject, setCurrentsubject] = useState();
  const [questions, setQuestions] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [pagenumber, setPagenumber] = useState(1);
  const [totalquestions, setTotalquestions] = useState();
  const answertype = { 1: "radio", 2: "checkbox" };
  const [answersheet, setAnswersheet] = useState([
    { questionid: "", answertype: "", answer: [] | "" },
  ]);

  const [currentanswer, setCurrentanswer] = useState([]);
  const formRef = useRef(null);
  const router = useRouter();
  const progersbuttoncolor = { 0: "redButton", 1: "greenButton" };
  const [examCandidateDetails, setExamCandidateDetails] = useState("aksya");
  const [examStartTime, setExamStartTime] = useState();
  const currentTime = new Date();
  const [loading, setLoading] = useState();
  const [summaryModalShow, setSummaryModalShow] = useState(false);
  const flag = useRef(true);

  useEffect(() => {
    decodeCandidate();
    fetchsubjects();


    

  }, []);

  useEffect(() => {
    const fullscreenchange = function (e) {
      if (document.fullscreenElement) {
        console.log("Screen entered fullscreen mode");
      } else {
        e.preventDefault();
        handlePause();
      }
    }
    
    if (flag.current) {
      document.addEventListener("fullscreenchange",fullscreenchange );
    }
    return() =>{
      document.removeEventListener("fullscreenchange",fullscreenchange)
    }

    
  }, [flag]);

  const handlePause = async () => {
    const result = await Swal.fire({
      title: "Would you like to end the exam?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        popup: "custom-swal-popup",
      },
    });

    if (result.isConfirmed) {
      router.push(`/end-user/rating?exam_id=${examid}&candidate_id=${examCandidateDetails?.candidate_id}`);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      document.documentElement.requestFullscreen();
    }
  };

  const decodeCandidate = async () => {
    setLoading(true);
    try{
   
    const data = { exam_token: examtoken };
    const response = await enduserservices.fetchdecodedcandidate(data);
    setExamCandidateDetails(response?.data);
    console.log("candidate details : ",response?.data)
    if (response?.data.status >= 2) {
      router.push("/otherpage");
    }
  }
  catch{
    router.push("/otherpage")
  }
  };

  const fetchsubjects = async () => {
    try {
      const response = await examsubjectListing(examid);
      setSubjects(response?.data?.results);
      setCurrentsubject(response?.data?.results[0]);
      setExamStartTime(currentTime);
      fetchquestions(response?.data?.results[0].id);
      
    } catch (error) {
      console.log(error);
    }
  };
  const fetchquestions = async (examsubjectid) => {

    const response = await enduserservices.examquestionsListing(examsubjectid);
    setTotalquestions(response?.data?.count);
    setQuestions(response?.data?.results);
    setCurrentQuestion(response?.data?.results[0]);
    setLoading(false);
  };

  const handleSubjectChange = (nextsubject) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert to this subject again!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedSubjects = [...subjects];
        const index = subjects.indexOf(currentsubject);
        updatedSubjects[index] = {
          ...updatedSubjects[index],
          visited: true,
        };
        setSubjects(updatedSubjects);
        setPagenumber(1);
        setAnswersheet([{ questionid: "", answertype: "", answer: [] | "" }]);
        setCurrentsubject(nextsubject);
        setExamStartTime(currentTime);
        fetchquestions(nextsubject.id);
        Swal.fire({
          title: "Moved!",
          text: `Your timer has started for ${nextsubject.subject}`,
          icon: "success",
        });
      }
    });
  };

  const handleOptionsSelect = (option) => {
    if (currentQuestion?.answer_type === 1) {
      setCurrentanswer([option]);
    } else if (currentanswer?.includes(option)) {
      setCurrentanswer(currentanswer.filter((item) => item !== option));
    } else {
      setCurrentanswer([...currentanswer, option]);
    }
  };

  const handlefreeanswer = (event) => {
    setCurrentanswer(event.target.value);
  };

  const handlesaveanswer = () => {
    const updatedquestions = [...questions];
    const index = questions?.indexOf(currentQuestion);
    if (currentanswer?.length === 0 || currentanswer === undefined) {
      updatedquestions[index] = {
        ...updatedquestions[index],
        attempted: 0,
      };
    } else {
      updatedquestions[index] = {
        ...updatedquestions[index],
        attempted: 1,
      };
    }
   
    setQuestions(updatedquestions);
    const questionId = currentQuestion?.id;

    setAnswersheet((prevAnswersheet) => {
      const isQuestionExists = prevAnswersheet.some(
        (item) => item.questionid === questionId
      );

      if (isQuestionExists) {
        return prevAnswersheet.map((item) =>
          item.questionid === questionId
            ? {
                questionid: questionId,
                answertype: currentQuestion?.answer_type,
                answer: currentanswer,
              }
            : item
        );
      } else {
        return [
          ...prevAnswersheet,
          {
            questionid: questionId,
            answertype: currentQuestion?.answer_type,
            answer: currentanswer,
          },
        ];
      }
    });
    setCurrentanswer([]);
  };

  const handlepagination = (qnumber) => {
    
    handlesaveanswer();
    setPagenumber(qnumber);
    if (questions && questions.length > qnumber - 1) {
      setCurrentQuestion(questions[qnumber - 1]);
      setCurrentanswer(answersheet[qnumber] ? answersheet[qnumber].answer : []);
    }
  };
  const questionElements = Array.from(
    { length: totalquestions },
    (_, index) => {
      const attemptedClass = questions && questions[index] && questions[index].attempted !== undefined
        ? progersbuttoncolor[questions[index].attempted]
        : '';
      
      return (
        <div key={index} className="col-3 col-xl-2 col-sm-2">
          <button
            className={`progressbutton ${
              questions && questions[index] === currentQuestion
                ? "blueButton"
                : attemptedClass
            } `}
            onClick={() => handlepagination(index + 1)}
          >
            <p>{index + 1}</p>
          </button>
        </div>
      );
    }
  )

  const handlesubmit = async () => {
    
    setSummaryModalShow(false);
    handlesaveanswer();
   
    const currentIndex = subjects.indexOf(currentsubject);
    await enduserservices.examanswersheetsubmit(
      examCandidateDetails?.candidate_id,
      currentsubject?.id,
      answersheet
    );
    if (currentIndex + 1 < subjects.length) {
      handleSubjectChange(subjects[currentIndex + 1]);
    } else {
      router.push(`/end-user/rating?exam_id=${examid}&candidate_id=${examCandidateDetails?.candidate_id}`);
    }
  };

  return (
    <div className="container-fluid aling-items-center">
      {summaryModalShow === true && (
        <ExamSummary
          show={summaryModalShow}
          onHide={() => setSummaryModalShow(false)}
          subject={currentsubject?.subject}
          questions={questions}
          handleSubmit={handlesubmit}
          answersheet={answersheet}
        />
      )}
      {loading === true ? (
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      ) : (
        <div className="row py-5">
          
          <div className="col-12 col-sm-9 col-xl-9 d-flex flex-column ">
            <div className="row">
              <div className="col lg-10">
                <div className="radio-inputs">
                  {subjects?.map((subject) => (
                    <label key={subject.id} className="radio">
                      <input
                        type="radio"
                        data-testid={`subjectradio`}
                        name="radio"
                        value={subject}
                        checked={subject === currentsubject}
                        disabled={subject?.visited === true}
                      />
                      <span className="name">
                        {subject.subject} ({subject.question_count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-2 col-sm-4">
                <div className="d-flex justify-content-end">
                  {currentsubject && (
                    <ExamTimer
                      duration={
                        currentsubject?.time_duration * 60 -
                        Math.floor(
                          ((currentTime - examStartTime) % (1000 * 60)) / 1000
                        )
                      }
                      handleSubmit={handlesubmit}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="card shadow">
              <div className="question">
                <p>Q : {currentQuestion?.question_description}</p>
              </div>
            </div>

            <div className="card shadow flex-grow-1">
              <div className="question ">
                <form ref={formRef}>
                  {currentQuestion?.options.length > 0 ? (
                    <div>
                      {currentQuestion?.options.map((option, index) => (
                        <div className="form-check" key={option.id}>
                          {" "}
                          {/* Add key prop here */}
                          <input
                            className="form-check-input"
                            type={answertype[currentQuestion?.answer_type]}
                            name="flexRadioDefault"
                            onChange={() => handleOptionsSelect(option.id)}
                            checked={
                              currentQuestion?.answer_type === 1
                                ? currentanswer == option.id
                                : currentanswer?.includes(option.id)
                            }
                            id={`flexRadioDefault${index}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexRadioDefault${index}`}
                          >
                            <p>{option.options}</p>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        onChange={handlefreeanswer}
                        value={currentanswer}
                        rows="15"
                      ></textarea>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="row align-items center py-3">
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  disabled={pagenumber - 1 === 0}
                  className="navigatebutton"
                  onClick={() => handlepagination(pagenumber - 1)}
                >
                  previous
                </button>
                <button
                  type="button"
                  disabled={pagenumber + 1 > totalquestions}
                  className="navigatebutton"
                  onClick={() => handlepagination(pagenumber + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-3 col-xl-3">
            <div className="infocard shadow flex-grow-1">
              <div className="examdetails">
                <figure className="text-center">
                  <h3>{examCandidateDetails?.exam_name}</h3>
                </figure>
              </div>
              <div className="candidateinfo">
                <p style={{ fontSize: "16px" }}>CANDIDATE NAME : {examCandidateDetails?.candidate_name}
                  <br />
                  CANDIDATE ID : {examCandidateDetails?.candidate_id}
                </p>
              </div>
              <hr />
              <div className="progresscontainer">
                <div className="row">{questionElements}</div>
              </div>
              <div className="bottom-row">
                <button
                  type="submit"
                  className="submitbutton"
                  onClick={() => {setSummaryModalShow(true);handlesaveanswer()}}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
