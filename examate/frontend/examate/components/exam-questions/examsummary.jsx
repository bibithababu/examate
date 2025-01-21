import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import "./exampage.css";

function ExamSummary(props) {
    const {subject, questions, handleSubmit,answersheet} = props;
    console.log("answer sheet",questions.filter(question => question?.attempted === 1).length)
    console.log("attempted ",)
    const noOfAttempted = questions.filter(question => question?.attempted === 1).length;
    const noOfUnAttempted = questions.filter(question => question.attempted === 0).length;
console.log("answer sheet : ",answersheet)
console.log("questions :",questions)

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        <h4>SUMMARY</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <table className="table table-bordered">
        <thead className="table-primary">
            <tr>
                <th>SUBJECT</th>
                <th>Total Questions</th>
                <th>Attempted Questions</th>
                <th>Unattempted Questions</th>
            </tr>
        </thead>
        <tbody>
        <tr>
          <td>{subject}</td>
              <td><div className="circle">
      {questions.length}
    </div></td>
    <td><div className="circle" style={{ backgroundColor: "green" }}>
      {noOfAttempted}
    </div></td>
    <td><div className="circle" style={{ backgroundColor: "red" }}>
      {noOfUnAttempted}
    </div></td>
            </tr>

            </tbody>
    </table>

      </Modal.Body>
      <Modal.Footer>
      <Button onClick={handleSubmit}>Confirm Submission</Button>
      </Modal.Footer>
    </Modal>
  );
}
ExamSummary.propTypes = {
  questions:PropTypes.array.isRequired,
  subject: PropTypes.string.isRequired,
  handleSubmit :PropTypes.func.isRequired
};
export default ExamSummary;