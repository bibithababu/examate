import React from "react";
import AddQuestionForm from "../Addquestion/addquestion";
const AddFreeAnswerQuestion = ({ formData, data, isUpdate,closeModal }) => {
  
  return (
    <AddQuestionForm formData={formData} data={data} isUpdate={isUpdate} closeModal={closeModal}>
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
        handleSubmit,
        setIsFormSubmitted,
      }) => (
        <div className="container">
          <form className="row g-1" method="post">
            <div className="mb-2 ">
              <select
                className={`form-select  ${
                  errors.subject_id ? "is-invalid" : ""
                }`}
                id="subject"
                name="subject_id"
                data-testId="select-subject"
                aria-label="Select an option"
                {...register("subject_id", { required: true })}
                required
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
                  required: "Question description is required",
                  minLength: {
                    value: 10,
                    message:
                      "Question description must be at least 10 characters long",
                  },
                  maxLength: {
                    value: 250,
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
                    data-testid="difficulty"
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
            <div className="col-md-12">
              <textarea
                id="answer"
                className={`form-control ${errors.answer ? "is-invalid" : ""}`}
                name="answer"
                {...register("answer", {
                  required: isFormSubmitted ? "Answer is required" : false,
                  minLength: {
                    value: 10,
                    message: "Answer must be at least 10 characters long",
                  },
                  maxLength: {
                    value: 250,
                    message: "Answer cannot exceed 250 characters",
                  },
                })}
                value={questionData.answer}
                onChange={handleInputChange}
                rows="5"
                placeholder="Add Your answer"
                style={{ borderColor: "#3883ce"}}
                data-testId="answer"
              />
              {isFormSubmitted && errors.answer && (
                <div className="invalid-feedback">{errors.answer.message}</div>
              )}
              {!isFormSubmitted && errors.answer && (
                <div className="invalid-feedback">{errors.answer.message}</div>
              )}
            </div>
            <div className="col-md-5">
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

           

            <div className="row">
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
                data-testid="submit"
              >
                {isUpdate ? "Update" : "Save"}
              </button>
              <div className="col-md-3 ">
                <button
                  type="button"
                  className="btn btn-success "
                  style={{
                    width: "100px",
                    marginTop: "10px",
                    padding: "5px",
                    alignItems: "center",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    setIsFormSubmitted(true);
                    handleSubmit(handlePublishQuestion)();
                  }}
                  data-testid="submit"
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

export default AddFreeAnswerQuestion;

