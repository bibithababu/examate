
import {React,useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import './question-list.css';
import { ApproveQuestion ,deleteQuestion} from '@/services/ApiServices';
import { FaEdit } from "react-icons/fa";
import UpdateQuestion from '../updatequestion/updatequestion';
import PropTypes from 'prop-types';

const QuestionDetailModal = ({ questionDetails, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  if (!questionDetails) {
    return null;
  }
  const options = questionDetails.options;
  console.log("options print",options)
  console.log("question details",typeof(questionDetails.marks))
  

  const HandleApprove = async (questionid) => {
    try{
        await ApproveQuestion(questionid);
    }
    catch (error) {
      console.error('Error approve question:', error);
    }
    finally{
      onClose();
    }
  }
  const HandleEdit = async (questionDetails) => {
    setIsUpdate(true)
    setShowModal(true);
    console.log("is_update",isUpdate)

  }
  console.log("question-----",questionDetails.marks)
  const handleCloseModal = () => {
    console.log("Closed it hiii");
    onClose()
    console.log("Closed it");
    setShowModal(false);
  };
  const handleQuestionDelete = async (questionid) => {
    try{
    // console.log("in handle delete",pagelength)
    await deleteQuestion(questionid);
    console.log("question deleted")
    onClose();

  }
   catch (error) {
    console.error('Error delete question:', error);
  }
};
  return (
<Modal
  show={true}
  onHide={onClose}
  size="lg"
  aria-labelledby="contained-modal-title-vcenter"
  centered
  className="custom-modal" // Add your custom class here
>

      <Modal.Header >
        <Modal.Title><p class="text-break">{questionDetails.question_description}</p></Modal.Title>
        {questionDetails.is_drafted && (<button className="btn btn-outline-secondary" data-testid="edit-button" onClick={() => HandleEdit(questionDetails)}>
  <FaEdit />
</button>
)} 
      </Modal.Header>
      <Modal.Body>
      {questionDetails.options&&(
        <div>
            <h5>Options:</h5>
                <ul>
                {questionDetails.options.map((option, index) => (
                  <li key={option.id}>
                    {option.options} {option.is_answer ? '(Correct Answer)' : ''}
                  </li>
                ))}
              </ul>
        </div>
      )
                }
{questionDetails.answer&&(
<div>
<h5>Answer:</h5>
  {questionDetails.answer.map((item) => (
    <p key={item.answer}>
      {item.answer}
    </p>
  ))}
</div>
)
  }


  
{questionDetails.mark!==0 && <div>
 
    <h5 style={{ display: 'inline-block', marginRight: '8px' }}>Marks:</h5>
    <p style={{ display: 'inline-block' }}>{questionDetails.marks}</p>
  </div>
}




{questionDetails.difficulty_level_display
 && (
  <div>
    <h5 style={{ display: 'inline-block', marginRight: '8px' }}>Difficulty Level:</h5>
    <p style={{ display: 'inline-block' }}>{questionDetails.difficulty_level_display
}</p>
  </div>
)}

      </Modal.Body>
      <Modal.Footer>
      {questionDetails.is_drafted && (
        <div>
  <button className="btn btn-success" onClick={() => HandleApprove(questionDetails.id)}>
  PUBLISH
</button>


{isUpdate ? (
      <UpdateQuestion isUpdate={isUpdate} show={showModal} closeModal={handleCloseModal} questionData={questionDetails} />
    ) : null}
                                   
</div>

)} 
            {questionDetails.is_drafted && (<button className="btn btn-danger" onClick={() => handleQuestionDelete(questionDetails.id)}>
DELETE
            </button>)}
        <button className="btn btn-secondary" onClick={handleCloseModal}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

QuestionDetailModal.propTypes = {
  questionDetails: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuestionDetailModal;