'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { subjectdropdownListing } from '@/services/ApiServices';
import PropTypes from 'prop-types';

const QuestionFilterModal = ({ show, onHide, onApplyFilters }) => {
  const { register, handleSubmit, reset } = useForm();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectdropdownListing();
        setSubjects(response?.data?.results);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    onApplyFilters(data);
    onHide();
  };
  const handleClearFilters = () => {
    reset(); // Reset form values// Notify the parent to clear filters
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Question filter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label data-testid="subject" htmlFor="subject" className="form-label">
                Select Subject
              </label>
              <select
                className="form-select"
                id="subject_id"
                data-testid="subject-select"
                {...register('subject_id')}
              >
                <option value="">Select...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
            <label htmlFor="answerType" className="form-label">Answer Type</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="freeAnswer"
                  {...register('answer_type')}
                  value="3"
                />
                <label className="form-check-label" htmlFor="freeAnswer">
                  Free Answer
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="singleAnswer"
                  {...register('answer_type')}
                  value="1"
                />
                <label className="form-check-label" htmlFor="singleAnswer">
                  Single Answer
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="multipleChoice"
                  {...register('answer_type')}
                  value="2"
                />
                <label className="form-check-label" htmlFor="multipleChoice">
                  Multiple Choice
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Difficulty Level</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="easy"
                  {...register('difficulty_level')}
                  value="1"
                />
                <label className="form-check-label" htmlFor="easy">
                  Easy
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="medium"
                  {...register('difficulty_level')}
                  value="2"
                />
                <label className="form-check-label" htmlFor="medium">
                  Medium
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="hard"
                  {...register('difficulty_level')}
                  value="3"
                />
                <label className="form-check-label" htmlFor="hard">
                  Hard
                </label>
              </div>
            </div>


            <div className="d-flex flex-row-reverse bd-highlight d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                FILTER
              </button>

              <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
               CLEAR
              </button>
</div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

QuestionFilterModal.propTypes = {
  show: PropTypes.bool.isRequired, // Boolean indicating whether the modal should be shown
  onHide: PropTypes.func.isRequired, // Function to handle the modal hide event
  onApplyFilters: PropTypes.func.isRequired, // Function to apply the filters
};


export default QuestionFilterModal;
