"use client"
import React, { useState,useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import './examinvitationcard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { addCandidateName, fetchExamDetailsByToken } from '@/services/ApiServices';
import { useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { handleErrorResponse } from '@/middlewares/errorhandling';
import PropTypes from 'prop-types';





const ExamInvitationCard = ({token}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [examDetails,setExamDetails] = useState({})
  const [subjectsDetails,setSubjectsDetails] = useState([])
  const [instructions,setInstructions] = useState()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [time,setTime] = useState("")
  const [date,setDate] = useState("")
  const [nameAlreadyAdded, setNameAlreadyAdded] = useState(false);
  const [name,setName] = useState("")
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [examId,setExamId] = useState("")
  const sessionToken = { token: token };
  const router = useRouter()

  useEffect(()=>{
    const fetchExamDetails = async()=>{
      try{
        const response = await fetchExamDetailsByToken(sessionToken)
        setExamDetails(response.data)
        const scheduledTime = new Date(response.data.scheduled_time)
        const formattedDate = scheduledTime.toISOString().split('T')[0]
        const formatTime = scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
         setTime(formatTime)
         setDate(formattedDate)
         setSubjectsDetails(response.data.subjects)
         setInstructions(response.data.instructions)
         setExamId(response.data.exam_id)
        const getName = await addCandidateName(sessionToken);
        if (getName.status === 202 && getName.data.name) {
          setNameAlreadyAdded(true);
          setName(getName.data.name);
      }
      
      }catch(error){
       handleErrorResponse(error)
        
      }

    }
    fetchExamDetails()
   
  },[])

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCloseInstructionsModal = () => {
    setShowInstructionsModal(false);
   
  };

  const handleShowInstructionsModal = () => {
    setShowInstructionsModal(true);
  };

  const handleAcceptInstructions = () => {
    setAcceptedInstructions(!acceptedInstructions);
  };
  const showSuccessMessage=(response) => {
    toast.success(response.data.message, { autoClose: 2000 });
    handleShowInstructionsModal();
  }
  const startExam=() => {
    setShowInstructionsModal(false);
    router.push(`/end-user/start-exam/?token=${token}&id=${examId}`)
    
  }



  const onSubmit = async(data)=>{
    const newData = {
      token : token,
      name: data.name
    }
    try{
      const response = await addCandidateName(newData)
      if (response.status === 200 && response.data.message === "Name Added successfully") {
        showSuccessMessage(response);
      }else if(response.status === 200 && response.data.message === "Name Updated successfully"){
         showSuccessMessage(response)
       
        }
    }catch(error){
     handleErrorResponse(error)   
    }
   
   

   
  }


  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
       <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={false} />
   <Modal show={showInstructionsModal} onHide={handleCloseInstructionsModal} size='lg'>
        <Modal.Header  closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: instructions }} />
          <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="acceptInstructions"
            checked={acceptedInstructions}
            onChange={handleAcceptInstructions}
          />
          <label className="form-check-label" htmlFor="acceptInstructions">
          I have carefully read and understand the instructions provided, and I hereby accept and agree to abide by them.
          </label>
        </div>
        </Modal.Body>
        <Modal.Footer className="text-center">
        <button className="btn mt-5" style={{backgroundColor: '#087990', color: '#fff' }} onClick={startExam}  disabled={!acceptedInstructions}>
                      Agree and Continue
           </button>
        </Modal.Footer>
      </Modal>

      
      <div className="row">
      
        <div className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center justify-content-center">
          <img
            src='/welcome.png'
            alt="welcome"
            className="img-fluid"
            width={1000} 
             height={300}
            style={{ objectFit: 'cover' }}
          />
        </div>

      
        <div className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center justify-content-center">
          <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        
            <div className="container card-container card-curved-edge shadow" style={{ width: '20rem', height: '30rem' }}>
              <div className="text-center">
                <div className="">
                  <h5 className="card-title exam-title">{examDetails.name}</h5>
                  <p className="mt-3 mb-2">{examDetails.organization_name} has invited you to attend this exam</p>
                </div>
                <div className="card-body">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th className="text-start">Name</th>
                        <td className='text-end'>{examDetails.name}</td>
                      </tr>
                      <tr>
                        <th className="text-start">Time</th>
                        <td className='text-end'>{time}</td>
                      </tr>
                      <tr>
                        <th className="text-start">Duration</th>
                        <td className='text-end'>{examDetails.exam_duration} minutes</td>
                      </tr>
                      <tr>
                        <th className="text-start">Date</th>
                        <td className='text-end'>{date}</td>
                      </tr>
                      <tr>
                        <th className="text-start">Topics</th>
                        <td className='text-end'>{subjectsDetails.map(subject => subject.subject_name).join(', ')}</td>

                      </tr>
                    </tbody>
                  </table>
                  <div className='text-center'>
                    <button className="btn mt-5" style={{ width: '100%',backgroundColor: '#087990', color: '#fff' }} onClick={handleClick}>
                      Go to Exam
                    </button>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="container shadow d-flex align-items-center justify-content-center" style={{ width: '20rem', height: '30rem' }}>
              <div className="text-center">
                <div className="card-body">
                  { nameAlreadyAdded ? (
          <div className="mb-3">
            <h2 className="mb-1 exam-title">Hi {name} <img alt='hii' src='/waving-hand.png'></img></h2>
            <button
            className="btn mt-3"
            style={{ width: '100%',backgroundColor: '#087990', color: '#fff' }}
            onClick={handleShowInstructionsModal}
          >
            Read Instructions
          </button>
          </div>
        ):( <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center">
                    <div className="mb-3">
                      <h2 className="mb-1 exam-title">Let's Sign You in</h2>
                      <div className='mt-3'>
                      <input placeholder='name' type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name"
                                            id="name" data-testId='name'
                                            {...register("name", { required: true })} />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                Please provide a name for the exam
                                            </div>
                                        )}
                      </div>
                    </div>
                   
                    <button type="submit" className="btn" style={{ width: '100%',backgroundColor: '#087990', color: '#fff' }}>
                      Submit
                    </button>
                  </form>)}
                 
                  <button className="btn mt-1" onClick={handleClick} style={{backgroundColor: '#087990', color: '#fff' }}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  </button>
                </div>
              </div>
            </div>
          </ReactCardFlip>
        </div>
      </div>
    </div>
  );
};
ExamInvitationCard.propTypes = {
  token: PropTypes.number.isRequired,
};

export default ExamInvitationCard;