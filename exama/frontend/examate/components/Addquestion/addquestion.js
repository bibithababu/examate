import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  createquestion,
  updateQuestion,
  subjectdropdownListing,
} from "@/services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { handleErrorResponse } from "@/middlewares/errorhandling";


const AddQuestionForm = ({ formData, data, isUpdate, children,closeModal}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  const [questionData, setQuestionData] = useState({
    marks: null,
    question_description: "",
    answer: "",
    difficulty_level: null,
    subject_id: "",
    options: [],
  });

  const [subjects, setSubjects] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingOption, setEditingOption] = useState("");
  const [newOption, setNewOption] = useState("");
  

  useEffect(() => {
    if (isUpdate) {
      setQuestionData((prevquestiondata) => ({
        ...prevquestiondata,
        marks: data.marks,
        question_description: data.question_description,
        difficulty_level:
          data.difficulty_level !== null ? String(data.difficulty_level) : null,
        subject_id: data.subject_id,
        answer: data.answer?.[0]?.answer || "",
        options: data?.options?.map((opt) => ({
          id: opt.id,
          options: opt.options,
          is_answer:opt.is_answer,
        })),
      }));
      setValue("marks", data.marks);
      setValue("question_description", data.question_description);
      setValue(
        "difficulty_value",
        data.difficulty_level === null
          ? null
          : data.difficulty_level || undefined
      );
      setValue("subject_id", data.subject_id);
      setValue("answer", data.answer?.[0]?.answer || "");
    }
  }, [data, isUpdate, setValue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("hiii",name,value)
    if(name=="subject_id" && data){
      data.subject_id=value
    }
  
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleQuestion = async (e, isDrafted) => {
    toast.dismiss();
    console.log("mark ", questionData.marks);
    const combinedData = {
      ...formData,
      ...questionData,
      is_drafted: isDrafted.toString(),
      
    };
    

    if(isUpdate && !isDrafted){
      console.log("Called updation method on publish click")
      handleQuestionUpdation(data.id,isDrafted);
    }else{
      try {
        await createquestion(combinedData);
  
        if (isDrafted) {
          toast.success("Question drafted successfully");
        } else {
          toast.success("Question created successfully");
        }
  
        setQuestionData({
          subject_id: "",
          marks: null,
          question_description: "",
          difficulty_level: null,
          answer: "",
          options: [],
        });
      } catch (error) {
         handleErrorResponse(error);
      }
    }

  
  };




  const handleQuestionUpdation = async (id,isDrafted=true) => {

    console.log("Updation",isDrafted)
  
    try {
     
  
     
      if(isDrafted){
        
        const response = await updateQuestion(id, {...questionData,answer_type:data.answer_type, is_drafted: isDrafted.toString()});
      
      
        toast.success(response.data.message);
       
     
        setQuestionData({
          subject_id: "",
          marks: null,
          question_description: "",
          difficulty_level: null,
          answer: "",
        });
        closeModal()
      }else{
        const newQuestionData = {
          ...questionData,
          is_drafted: isDrafted.toString(),
          answer_type:data.answer_type
        }
        await updateQuestion(id, newQuestionData);
        toast.success('Question details updated and published')
       
       
        
        setQuestionData({
          subject_id: "",
          marks: null,
          question_description: "",
          difficulty_level: null,
          answer: "",
          options:[]
,        });
        closeModal()
         
      }
    
    } catch (error) {
      console.log("error in question creation",error)
      handleErrorResponse(error);
    }
  };



  const handleButtonClick = () => {
    if (isUpdate) {
      handleQuestionUpdation(data.id);
    } else {
      handleSubmit(handleDraftedQuestion)();
      setIsFormSubmitted(false);
    }
  };

  const handleDraftedQuestion = async (e) => {
    handleQuestion(e, true);
  };

  const handlePublishQuestion = async (e) => {
    handleQuestion(e, false);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectdropdownListing();
        setSubjects(response.data.results);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleDifficultyChange = (e) => {
    console.log("i am",e.target.value)
    setQuestionData({ ...questionData, difficulty_level: e.target.value });
  };

  const handleEditOption = (index) => {
    setEditingOption(questionData.options[index].options);
    setEditingIndex(index);
  };
  const handleNewOptionChange = (e) => {
    setNewOption(e.target.value);
    console.log(e.target.value);
  };

  const handleAddOption = () => {
    toast.dismiss();

    if (editingIndex !== null && editingOption.trim() !== "") {
      const updatedOptions = questionData.options.map((option, index) =>
        index === editingIndex ? { ...option, options: editingOption } : option
      );

      setQuestionData({
        ...questionData,
        options: updatedOptions,
      });

      setEditingOption("");
      setEditingIndex(null);
    } else if (newOption.trim().length < 1 || newOption.trim().length > 100) {
      toast.error("Option must be between 1 and 100 characters long");
      return;
    } else if (
      questionData.options.some(
        (option) =>
          option.options.toLowerCase() === newOption.trim().toLowerCase()
      )
    ) {
      toast.info("Duplicate options are not allowed");
    } else if (newOption.trim() === "") {
      toast.error("Please enter an option");
    } else if (questionData.options.length < 4) {
      const newOptionObject = { options: newOption, is_answer: false };
      setQuestionData({
        ...questionData,
        options: [...questionData.options, newOptionObject],
      });
      setNewOption("");
    } else {
      toast.info("Maximum of 4 options allowed");
    }
  };

  let toastDisplayed = false;

  const validateCheckBox = () => {
    const checkedOptionsCount = questionData.options.filter(
      (opt) => opt.is_answer === true
    ).length;
    if (checkedOptionsCount !== 1 && !toastDisplayed) {
      toast.error("Please select one options");
      toastDisplayed = true;
      return false;
    } else if (checkedOptionsCount === 1 && toastDisplayed) {
      toastDisplayed = false;
    }
    return true;
  };

  


  const handleRemoveOption = (indexToRemove) => {
    const updatedOptions = questionData.options.filter(
      (_, index) => index !== indexToRemove
    );
    setQuestionData({ ...questionData, options: updatedOptions });
  };

  const handleCheckboxChange = (event, index) => {
    const updatedOptions = questionData.options.map((option, i) => ({
      ...option,
      is_answer: i === index,
    }));
    setQuestionData({ ...questionData, options: updatedOptions });
  };

  const CheckboxChange = (event, index) => {
  
      const updatedOptions = questionData.options.map((option, i) => {
        if (i === index) {
          return { ...option, is_answer: !option.is_answer };
        } else {
          return option;
        }
      });
      setQuestionData({ ...questionData, options: updatedOptions });
    
  };

  return (
    <div className="container">
      <ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={false} />
      <form className="row g-1" method="post">
        {children({
          register,
          errors,
          setValue,
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
          handleNewOptionChange,
          newOption,
          handleAddOption,
          setIsFormSubmitted,
          handleSubmit,
          setEditingIndex,
          setEditingOption,
          validateCheckBox,
          handleRemoveOption,
          handleCheckboxChange,
          CheckboxChange,
        
          handleErrorResponse,
          formData,
      
        })}
      </form>
    </div>
  );
};

AddQuestionForm.propTypes = {
  formData: PropTypes.object.isRequired,
  data: PropTypes.object,
  isUpdate: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
  closeModal:PropTypes.func.isRequired
};

export default AddQuestionForm;
