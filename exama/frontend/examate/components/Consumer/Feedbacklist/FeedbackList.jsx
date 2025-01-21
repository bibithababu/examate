import { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { BsThreeDots} from 'react-icons/bs';
import {  RiStarFill } from 'react-icons/ri';
import "./feedback-list.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  feedbackList } from "@/services/ApiServices";
import Pagination from "@/components/pagination/Pagination";
import {  useSearchParams } from 'next/navigation';


const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(0);
 
  const searchParams = useSearchParams()
  const examId = searchParams.get('id')
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await feedbackList(examId)
        setFeedbacks(response.data.results)
        setTotalPages(response.data.total_pages)
        setPageSize(response.data.page_size)
      } catch (error) {
        toast.error(error);
      }
    };

    fetchFeedbacks();
  }, []);


  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
  };
  const fetchDataByPage = async (pageNumber) => {
      setCurrentPage(pageNumber);
      const response = await feedbackList(`${examId}/?page=${pageNumber}`);
  
      setFeedbacks(response.data.results);
  };
  // Function to generate star icons based on the rating value
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
  
    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<RiStarFill key={i} className="yellow-star" style={{marginLeft:"1px"}}/>);
    }
  
    // Render half star if necessary
    if (hasHalfStar) {
      stars.push(<RiStarFill className='half-filled-star' key={stars.length}  style={{marginLeft:"1px",fill:"rgb(211, 211, 37)"}}/>)
    }
  
    return stars;
  };
  

  
  return (
    <div>
      <h1 className="main-heading">Feedbacks</h1>
      {feedbacks.length> 0 ? (
      <>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" style={{ width: "3%" }}>#</th>
              <th scope="col" style={{ width: "20%" }}>Candidate Name</th>
              <th scope="col" style={{ width: "20%" }}>Email</th>
              <th scope="col" style={{ width: "10%" }}>Rating</th>
              <th scope="col" style={{ width: "50%" }}>Comment</th>
            </tr>  
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={feedback.id}>
                <td >
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                <td>{feedback.candidate_name}</td>
                <td>{feedback.candidate_email}</td>
                <td>{feedback.rating}</td>
                <td>
                  {feedback.feedback.length > 25 ? 
                    <>
                      {feedback.feedback.substring(0, 25)}{' '}
                      <BsThreeDots data-testid={`dots${index+1}`} onClick={() => openModal(feedback)} />
                    </>
                    : feedback.feedback
                  }
                </td>
              </tr>
            ))}
          </tbody>   
        </table> 
      </div>
      <div className="text-center">
        <div className="pagination-items mt-3">
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalPages}
            pageSize={1}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchDataByPage}
          />
        </div>
        <ToastContainer position="top-right" autoClose={false} />
      </div></>):(<div className="text-center py-4">
          <p style={{ color: "red" }}>Feedback not Found!</p>
        </div>)}
      
      <Modal show={modalShow} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Rating: {renderStars(selectedFeedback?.rating)}</p>
          <p>{selectedFeedback?.feedback}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  );
}

export default FeedbackList;
