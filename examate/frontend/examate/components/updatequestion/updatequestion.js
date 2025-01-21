"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./updatequestion.css";
import AddSingleAnswer from "../singleanswer/singleanswer";

import AddFreeAnswerQuestion from "../freeanswer/freeanswer";
import AddMultipleAnswer from "../multipleanswer/multipleanswer";

const UpdateQuestion = ({ show, closeModal, questionData, isUpdate }) => {
  const [formData, setFormData] = useState({ answer_type: "" });

  useEffect(() => {
    if (isUpdate) {
      console.log("Update question form ")
   
      setFormData((prevformdata) => {
        return {
          ...prevformdata,
          answer_type: String(questionData.answer_type),
        };
      });
    }
  }, []);

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isUpdate ? "Update Question" : "Create Question"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          {formData.answer_type === "1" && (
            <AddSingleAnswer
              formData={formData}
              data={questionData}
              isUpdate={isUpdate}
              closeModal={closeModal}
            />
          )}
          {formData.answer_type === "2" && (
            <AddMultipleAnswer
              formData={formData}
              data={questionData}
              isUpdate={isUpdate}
              closeModal={closeModal}
            />
          )}
          {formData.answer_type === "3" && (
            <AddFreeAnswerQuestion
              formData={formData}
              data={questionData}
              isUpdate={isUpdate}
              closeModal={closeModal}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default UpdateQuestion;
