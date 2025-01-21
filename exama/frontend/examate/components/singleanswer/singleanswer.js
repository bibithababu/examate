import React from "react";
import AddQuestionForm from "../Addquestion/addquestion";
import { BiSolidEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";

const AddSingleAnswer = ({ formData, data, isUpdate ,closeModal}) => {

  return (
    <AddQuestionForm formData={formData} data={data} isUpdate={isUpdate} closeModal={closeModal}  >
      {({
        register,
        
        errors,
        questionData,
        handleInputChange,
        subjects,
        isFormSubmitted,
        handleButtonClick,
        handlePublishQuestion,
        handleDifficultyChange,
        handleEditOption,
        editingIndex,
        editingOption,
        newOption,
        handleNewOptionChange,
        handleAddOption,
        handleSubmit,
        setIsFormSubmitted,
        setEditingOption,
        validateCheckBox,
        handleCheckboxChange,
        handleRemoveOption,
      }) => (
        <div className="container">
          <form className="row g-1" method="post">
            <div className="mb-2">
              <select
                className={`form-select  ${
                  errors.subject_id ? "is-invalid" : ""
                }`}
                id="subject"
                role="combobox"
                name="subject_id"
                aria-label="Select an option"
                data-testId="select-subject"
                
                {...register("subject_id", { required: true })}
                onChange={handleInputChange}
                style={{ borderColor: "#3883ce" }}
                value={isUpdate ? data.subject_id : questionData.subject_id}
              >
                <option value="">Select...</option>
                {subjects.map((subject) => (
                  <option
                    data-testId="select-option-subject"
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.subject_name}
                  </option>
                ))}
              </select>

              {errors.subject_id && (
                <div className="invalid-feedback ">
                  Please select a subject.
                </div>
              )}
               <textarea
                id="question_description"
                className={`form-control ${
                  errors.question_description ? "is-invalid" : ""
                }`}
                
                {...register("question_description", {
                  required: "question description is required",
                  minLength: {
                    value: 10,
                    message:
                      "Question description must be at least 10 characters long",
                  },
                  maxLength: {
                    value: 1000,
                    message:
                      "Question description cannot exceed 1000 characters",
                  },
                })}
                name="question_description"
                value={questionData.question_description}
                
                onChange={handleInputChange}
                rows="5"
                placeholder="Add Your Question"
                style={{ borderColor: "#3883ce", marginTop: "20px" }}
                data-testId="question_description"
              />
              {errors.question_description && (
                <div className="invalid-feedback">
                  {errors.question_description.message}
                </div>
              )}

              <div
                className={`mb-2 d-flex flex ${
                  errors.difficulty_level ? "is-invalid" : ""
                }`}
                style={{ marginTop: "14px" }}
              >
                <div className="custom-control custom-radio custom-control-inline ">
                  <input
                    type="radio"
                    id="easy"
                    name="difficulty_level"
                    {...register("difficulty_level", {
                      required: isFormSubmitted,
                    })}
                    className="custom-control-input green me-2"
                    value="1"
                    checked={questionData.difficulty_level === "1"}
                    onChange={handleDifficultyChange}
                    data-testId="difficulty"
                  />
                  <label className="custom-control-label me-2" htmlFor="easy">
                    Easy
                  </label>
                </div>

                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="medium"
                    name="difficulty_level"
                    {...register("difficulty_level", {
                      required: isFormSubmitted,
                    })}
                    className="custom-control-input green me-2"
                    value="2"
                    checked={questionData.difficulty_level === "2"}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label me-2" htmlFor="medium">
                    Medium
                  </label>
                </div>

                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="hard"
                    name="difficulty_level"
                    {...register("difficulty_level", {
                      required: isFormSubmitted,
                    })}
                    className="custom-control-input green me-2 "
                    value="3"
                    checked={questionData.difficulty_level === "3"}
                    onChange={(e) => handleDifficultyChange(e)}
                  />
                  <label className="custom-control-label me-2" htmlFor="hard">
                    Hard
                  </label>
                </div>
              </div>
              {isFormSubmitted && errors.difficulty_level && (
                <div className="invalid-feedback">
                  Please select a difficulty level.
                </div>
              )}
            </div>
            <div className="col-md-7">
              <input
                type="number"
                id="marks"
                className={`form-control ${errors.marks ? "is-invalid" : ""}`}
                name="marks"
                data-testid="marks"
                {...register("marks", { required: isFormSubmitted })}
                value={questionData.marks}
                onChange={handleInputChange}
                style={{ borderColor: "#3883ce" }}
                placeholder="Enter mark...."
                min={1}
              />
              {errors.marks && (
                <div className="invalid-feedback">Please enter the mark.</div>
              )}

             
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className={`form-control ${errors.options ? "is-invalid" : ""}`}
                {...register("options", {
                  minLength: {
                    value: 1,
                    message: "Option must be at least 1 character long",
                  },
                  maxLength: {
                    value: 50,
                    message: "Option cannot exceed 50 characters",
                  },
                })}
                value={editingIndex !== null ? editingOption : newOption}
                onChange={
                  editingIndex !== null
                    ? (e) => setEditingOption(e.target.value)
                    : handleNewOptionChange
                }
                data-testid="delete-button"
                name="options"
                style={{ borderColor: "#3883ce",maxWidth:' 100%', whiteSpace: 'wrap' }}
                placeholder="Add Options"
              />

              {errors.options && (
                <div className="invalid-feedback">{errors.options.message}</div>
              )}
            </div>

            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-sm btn-primary button-plus"
                onClick={handleAddOption}
                disabled={!!errors.options}
                style={{ width: "30px", height: "30px", marginTop: "3px" }}
                data-testId="add-button"
              >
                +
              </button>
            </div>

            <div className="col-md-12 ">
              {questionData.options &&
                questionData.options.length > 0 &&
                questionData.options.map((opt, index) => (
                  <div
                    key={opt.id}
                    className="form-check d-flex align-items-center"
                  >
                    <input
                      type="checkbox"
                      id={`option_${index}`}
                      className="form-check-input px-2" // Add padding for spacing
                      value={opt.options}
                      checked={opt.is_answer === true}
                      {...register(`options[${index}].is_answer`, {
                        validate: validateCheckBox,
                      })}
                      onChange={(event) => handleCheckboxChange(event, index)}
                      data-testId={`option-checkbox-${index}`}
                    />
                     <label className="form-check-label px-2">
                     
                      {opt.options.length > 20 ? (
                        <>
                          {opt.options.substring(0,20)}...
                        </>
                      ) : (
                        opt.options
                      )}
                    </label>{" "}
                    {/* Add padding for spacing */}
                    <BiSolidEdit
                      type="button"
                      data-testid="editoption"
                      onClick={() => handleEditOption(index)}
                      className="fs-0"
                      style={{ fontSize: "20px" ,minWidth:'30px'}}
                    />
                    <FaTrash
                    size={15}
                      color="red"
                      type="button"
                      className="fs-0"
                      onClick={() => handleRemoveOption(index)}
                      style={{ fontSize: "20px" ,minWidth:'20px'}}
                      data-testId="trash-button"
                    />
                  </div>
                ))}

              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: "100px",
                  marginTop: "10px",
                  padding: "5px",
                  alignItems: "center",
                }}
                onClick={handleButtonClick}
              >
                {isUpdate ? "Update" : "Save"}
              </button>
              <div className="col-md-4 ">
                <button
                  type="button"
                  className="btn btn-success mt-8"
                  style={{
                    width: "100px",
                    marginTop: "10px",
                    padding: "5px",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    setIsFormSubmitted(true);
                    handleSubmit(handlePublishQuestion)();
                  }}
                  data-testId="submit"
                >
                  Publish
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </AddQuestionForm>
  );
};
AddSingleAnswer.propTypes = {
  formData: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  isUpdate: PropTypes.bool.isRequired,
};

export default AddSingleAnswer;

