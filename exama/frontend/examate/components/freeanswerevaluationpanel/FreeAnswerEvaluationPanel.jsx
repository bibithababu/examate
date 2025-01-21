import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import './freeanswerevaluationpanel.css'
import { evaluationFinalSubmission, fetchCandidateFreeAnswersDetails } from '@/services/ApiServices';
import { handleErrorResponse } from '@/middlewares/errorhandling';
import Swal from 'sweetalert2';
import { useSearchParams,useRouter } from 'next/navigation';





const FreeAnswerEvaluationPanel = () => {

  const [freeAnswerDetails, setFreeAnswerDetails] = useState({})
  const [paginationLinks, setPaginationLinks] = useState({
    nextLink: "",
    previousLink: ""
  });
  const [correctnessArray, setCorrectnessArray] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams()
  const router = useRouter(); 
  const candidateId = searchParams.get('candidate_id')


 
  const fetchFreeAnswerDatas = async (url) => {

    try {
      const response = await fetchCandidateFreeAnswersDetails(candidateId, url);
     
      if (response.status === 204){
        router.push('evaluated-candidate-list')
      }

      setFreeAnswerDetails(response.data.results[0])
      setPaginationLinks({
        nextLink: response.data.next,
        previousLink: response.data.previous
      })
    } catch (error) {
      handleErrorResponse(error)
    }
  }
  useEffect(() => {
    fetchFreeAnswerDatas()
    
    
  }, [])
 

  useEffect(() => {
    console.log(correctnessArray);
  }, [correctnessArray])


  const handleNext = () => {
    fetchFreeAnswerDatas(paginationLinks.nextLink);
  }

  const handlePrevious = () => {
    fetchFreeAnswerDatas(paginationLinks.previousLink);
  }

  const submitEvaluatedAnswers = async () => {
    try {
    
      await evaluationFinalSubmission(correctnessArray)
    } catch (error) {
      handleErrorResponse(error)
    }

  }

  const displaySwalMessage = (icon, title) => {
    Swal.fire({
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleCheckIconClick = () => {
    const candidateAnswerId = freeAnswerDetails.id
    const existingIndex = correctnessArray.findIndex(item => item.candidate_answer_id === candidateAnswerId)
    if (existingIndex !== -1) {
      const updatedCorrectnessArray = [...correctnessArray]
      updatedCorrectnessArray[existingIndex].correct = true
      setCorrectnessArray(updatedCorrectnessArray)
    } else {
      const newCorrectnessEntry = {
        candidate_answer_id: candidateAnswerId,
        correct: true
      };
      setCorrectnessArray([...correctnessArray, newCorrectnessEntry])
    }
    displaySwalMessage("success", "The answer has been marked as correct");
  };

  const handleCrossIconClick = () => {
    const candidateAnswerId = freeAnswerDetails.id;
    const existingIndex = correctnessArray.findIndex(item => item.candidate_answer_id === candidateAnswerId);
    if (existingIndex !== -1) {
      const updatedCorrectnessArray = [...correctnessArray]
      updatedCorrectnessArray[existingIndex].correct = false;
      setCorrectnessArray(updatedCorrectnessArray);
    } else {
      const newCorrectnessEntry = {
        candidate_answer_id: candidateAnswerId,
        correct: false
      };
      setCorrectnessArray([...correctnessArray, newCorrectnessEntry])
    }
    displaySwalMessage("error", "The answer has been marked as incorrect");
  };

  const handleSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await submitEvaluatedAnswers()
        Swal.fire({
          title: "Submitted!",
          text: `${freeAnswerDetails.candidate_name}'s free answer marks have been submitted.`,
          icon: "success"
        }).then(async(result)=>{
          if(result.isConfirmed){
            router.push('pendingevaluation-list')
          }
        });
        setIsSubmitted(true);
       
      }
    });
  }


  return (



    <>
      <Row className="d-flex justify-content-center align-items-center text-center">
        <Col className=" mb-4 mt-md-5" xs={12} md={6}>
          <h2 style={{ fontWeight: '700' }}  >Evaluation Panel</h2>
        </Col>
      </Row>

      <Row className="mt-3 d-flex align-items-center justify-content-center">
        <Col xs={1} className="text-end">
          <FontAwesomeIcon
            data-testid='previous-button'
            icon={faAngleDoubleLeft}
            className={`arrow-icon ${!paginationLinks.previousLink && 'disabled'}`}
            onClick={paginationLinks.previousLink ? handlePrevious : undefined}
          />
        </Col>
        <Col xs={10} md={10}>
          <Card className="" style={{ backgroundColor: '#D9D9D9' }}>
            <Card.Header style={{ backgroundColor: 'black', color: "#FFFFFF", fontWeight: '700', border: "black" }} as="h5">Mark: {freeAnswerDetails.question_mark}</Card.Header>
            <Card.Body >
              <Card.Title className='ms-1' style={{ color: '#226CDC', fontWeight: '700' }}>Question Description</Card.Title>
              <Card>
                <Card.Body style={{ maxHeight: '100px', minHeight: '100px', overflowY: 'auto' }}>
                  <Card.Text className='ms-2'>{freeAnswerDetails.question_description}</Card.Text>
                </Card.Body>
              </Card>
              <Row className='mt-4'>
                <Col xs={12} md={6} className="mb-3">
                  <Card.Title className='ms-1' style={{ color: '#226CDC', fontSize: '18px', fontWeight: '700' }}>Candidate Answer</Card.Title>
                  <Card>

                    <Card.Body style={{ maxHeight: '150px', minHeight: '150px', overflowY: 'auto' }}>
                      <Card.Text>{freeAnswerDetails.free_answer}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <Card.Title className='ms-1' style={{ color: '#226CDC', fontSize: '18px', fontWeight: '700' }}>Answer Key</Card.Title>
                  <Card>

                    <Card.Body style={{ maxHeight: '150px', minHeight: '150px', overflowY: 'auto' }}>
                      <Card.Text>{freeAnswerDetails.answer_key}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <Button className={`me-auto ${isSubmitted ? "Submitted" : "Submit"}`} onClick={handleSubmit} style={{ height: 'auto' }}>
                {isSubmitted ? "Submitted" : "Submit"}
              </Button>

              <div className="d-flex">
                <div className="circle me-3" onClick={handleCheckIconClick}>
                  <FontAwesomeIcon disabled={isSubmitted} icon={faCheck} data-testid='check-icon-button' className={`check-icon ${isSubmitted && 'disabled'}`} onClick={!isSubmitted ? handleCheckIconClick : undefined} />
                </div>
                <div className="circle" onClick={handleCrossIconClick}>
                  <FontAwesomeIcon disabled={isSubmitted} icon={faTimes} data-testid='times-icon-button' className={`times-icon ${isSubmitted && 'disabled'}`} onClick={!isSubmitted ? handleCrossIconClick : undefined} />
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={1} className="text-start">
          <FontAwesomeIcon
            data-testid='next-button'
            icon={faAngleDoubleRight}
            className={`arrow-icon ${!paginationLinks.nextLink && 'disabled'}`}
            onClick={paginationLinks.nextLink ? handleNext : undefined}
          />
        </Col>
      </Row>
    </>


  );
}

export default FreeAnswerEvaluationPanel