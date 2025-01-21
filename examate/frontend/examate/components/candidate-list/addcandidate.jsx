import React,{useState} from 'react';
import { Button,Modal  } from 'react-bootstrap';
import { AddCandidateService } from '@/services/ApiServices';
import { useForm } from "react-hook-form";
import "./candidate-list.css";
import PropTypes from 'prop-types';


const AddCandidate = ({ show, exam_id, onHide ,onAddCandidate}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [error,setError] = useState()
  console.log("in add candidate", show, exam_id);

  const handleAddCandidate = async (data) => { 
    console.log("in handle ADD",exam_id)
    try{
    await AddCandidateService(`examatecandidates/${exam_id}/add-candidate/`, data);
    onAddCandidate();
    reset({email:""});
    }
    catch(error)
    {
      setError(error.message)
      console.log("state errors",error.message)

    }
  };

  return (
<Modal show={show} onHide={onHide} size="lg">
  <Modal.Body>
    <div className="row">
      <div className="col-md-10">
        <input 
          type="text" 
          placeholder="Email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email" 
          name="email" 
          {...register("email", { required: true, pattern: /^(?=[a-zA-Z0-9._%+-]{1,255}@)[a-zA-Z0-9._%+-]{1,64}@([a-zA-Z0-9-]{1,63}\.){1,125}[a-zA-Z]{2,63}$/ ,message: 'Invalid email format',})}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              console.log("enter key", e.key)
              handleSubmit(handleAddCandidate)();
            }
          }}
        />
        {errors.email && (
          <div className="invalid-feedback">{console.log("email",errors.email)}
            enter a valid email address
          </div>
        )}
        {error &&(
            <p className="email-text text-center " style={{color:'red'}}>{error}</p>
          )}

      </div>
      <div className="col-md-2">
        <Button variant="success" onClick={handleSubmit(handleAddCandidate)}>
          Add
        </Button>
      </div>
    </div>
  </Modal.Body>
</Modal>
  );
};

AddCandidate.propTypes = {
  show: PropTypes.bool.isRequired, // 'show' prop should be a boolean and is required
  exam_id: PropTypes.number.isRequired,  // 'exam_id' prop should be a string and is required
  onHide: PropTypes.func.isRequired, // 'onHide' prop should be a function and is required
  onAddCandidate: PropTypes.func.isRequired // 'onAddCandidate' prop should be a function and is required
};

export default AddCandidate;