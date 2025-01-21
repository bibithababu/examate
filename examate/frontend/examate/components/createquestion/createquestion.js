"use client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./createquestion.css";

import AddSingleAnswer from "../singleanswer/singleanswer";
import AddFreeAnswerQuestion from "../freeanswer/freeanswer";
import AddMultipleAnswer from "../multipleanswer/multipleanswer";


const CreateQuestion = ({ show, onHide }) => {
  const [formData, setFormData] = useState({ answer_type: "" });
  

  const handleAnswerTypeChange = (e) => {
    setFormData({ ...formData, answer_type: e.target.value }); 
  };
  
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          <form>
            <div className="mb-3 d-flex flex-row">
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="freeAnswer"
                  name="answer_type"
                  className="custom-control-input green me-2"
                  value="3"
                  checked={formData.answer_type === "3"}
                  onChange={handleAnswerTypeChange}
                />
                <label
                  className="custom-control-label me-4"
                  htmlFor="freeAnswer"
                >
                  FA
                </label>
              </div>

              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="singleAnswer"
                  name="answer_type"
                  className="custom-control-input green me-2"
                  value="1"
                  checked={formData.answer_type === "1"}
                  onChange={handleAnswerTypeChange}
                />
                <label
                  className="custom-control-label me-4"
                  htmlFor="singleAnswer"
                >
                  SA
                </label>
              </div>
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="multipleAnswer"
                  name="answer_type"
                  className="custom-control-input green me-2"
                  value="2"
                  checked={formData.answer_type === "2"}
                  onChange={handleAnswerTypeChange}
                />
                <label
                  className="custom-control-label me-4"
                  htmlFor="multipleAnswer"
                >
                  MA
                </label>
              </div>
            </div>

            {formData.answer_type === "1" && (
              <AddSingleAnswer formData={formData} onHide={onHide} />
              
            )}
            {formData.answer_type === "2" && (
              <AddMultipleAnswer formData={formData} />
            )}
            {formData.answer_type === "3" && (
              <AddFreeAnswerQuestion formData={formData} />
            )}
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default CreateQuestion;
