"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './createexammodal.css'
import { Modal, Form, Row } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { createExam, fetchExamDataById, subjectdropdownListing, updateExam } from '@/services/ApiServices';
import { FaTrash, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import { handleErrorResponse } from '@/middlewares/errorhandling';
import PropTypes from 'prop-types';
import { useTicketStatus } from "@/context/ticketStatusContext";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill').then((mod) => mod.default), { ssr: false });
import 'react-quill/dist/quill.snow.css';



const CreateExamModal = ({ isOpen, onClose, isUpdate, id }) => {

    const [subjectItems, setSubjectItems] = useState([]);
   
    const [instructions,setInstructions] = useState("")
    const [addSubjectCount, setAddSubjectCount] = useState(1);
    const [publishClicked, setPublishClicked] = useState(null);
    const [createClicked, setCreateClicked] = useState(null);
    const [selectedSubjectIndex, setSelectedSubjectIndex] = useState([]);
    const [subjectFieldError, setSubjectFieldError] = useState(false)
    const { ticketStatusCount, updateTicketStatusCount } = useTicketStatus()

    const [dateAndTime, setDateAndTime] = useState({
        date: false,
        time: false
    })
    const router = useRouter()



    const { register, handleSubmit, formState: { errors }, control, setValue, clearErrors, getValues } = useForm({
        defaultValues: {
            subjects: [{ subject: '', question_count: '', pass_percentage: '', difficulty_level: '', time_duration: '' }],
        },
    });


    const { fields, append, remove } = useFieldArray({
        control,
        name: 'subjects',
    });


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await subjectdropdownListing();
                setSubjectItems(response.data.results);
            } catch (error) {
                toast.error('Error in Fetching Subjects', { autoClose: 2000 })
            }
        };
        fetchSubjects();
    }, []);


    useEffect(() => {
        if (isUpdate) {
            const fetchExamData = async () => {
                try {
                    const response = await fetchExamDataById(id)


                    const scheduledTime = new Date(response.data.scheduled_time)
                    const formattedDate = scheduledTime.toISOString().split('T')[0]
                    const formatTime = scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    
                    setValue("name", response.data.name);
                    setValue("date", formattedDate);
                    setValue("time", formatTime);
                    setValue('subjects', response.data.subjects);
                    setAddSubjectCount(response.data.subjects.length);
                    setInstructions(response.data.instructions);
                    console.log("Insytuctions",response.data.instructions)


                } catch (error) {
                    handleErrorResponse(error);
                }

            }
            fetchExamData();
        }
    }, []);

    useEffect(() => {

    }, [subjectFieldError]);



    const handleAddSubject = () => {

        append({ subject: '', question_count: '', pass_percentage: '', difficulty_level: '', time_duration: '' });
        setAddSubjectCount((prevCount) => prevCount + 1);
    };

    const handleDeleteSubject = (index) => {
        remove(index);
        setAddSubjectCount((prevCount) => prevCount - 1);
    };

   
    const handleSubjectSelection = (index, selectedSubjectId) => {

        const subjectValue = selectedSubjectId

        setSelectedSubjectIndex((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            if (subjectValue === "") {
                setSelectedSubjectIndex([])
                clearErrors(`subjects[${index}]`);

                newIndexes[index] = null
            } else {
                newIndexes[index] = index
            }
            newIndexes[index] = index;
            return newIndexes;
        });
    };

    const formatDateTime = (date, time) => {

        if (!date || !time) {
            return null;
        }
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');


        const formattedDateTime = new Date(year, month - 1, day, hours, minutes);
        const formattedDateTimeString = formattedDateTime.toISOString().slice(0, 19)


        return formattedDateTimeString;
    }
    const handleSubjectValueErrors = async () => {
        const data = getValues();

        data.subjects.forEach((subjectData, _) => {
            const subjectValue = subjectData.subject;
            const otherFields = Object.values(subjectData).filter(value => value !== subjectData.subject);

            if (otherFields.length > 0 && otherFields.some(value => value !== "" && value !== null)) {
                if (subjectValue === "") {
                    setSubjectFieldError(true);
                }
            }
        });
    };

    const handleSuccessResponse = (response, successMessage) => {
        if (response.status === 200 || response.status === 201) {
            if (response.data.message === successMessage) {
                toast.success(successMessage, { autoClose: 2000 });
                setValue("subjects", [{ subject: '', question_count: '', pass_percentage: '', difficulty_level: '', time_duration: '' }])
                setAddSubjectCount(1);
                setValue("name", "")
                setValue("date", "")
                setValue("time", "")
                setInstructions("")
                setSubjectFieldError(false)
                setSelectedSubjectIndex([])
                updateTicketStatusCount();
            }
        }
    };

    const handleInsufficentTicketErrorResponse = (error) => {
        if (error?.response?.data?.errorCode === "E40024") {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success ms-3",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: ticketStatusCount.approvedCount,
                text: error?.response?.data?.message,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Buy Now",
                cancelButtonText: "cancel",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("history")
                }
            });
        } else {
            handleErrorResponse(error);
        }

    };

    const onSubmit = async (data, isDrafted) => {
        const formattedDateTime = formatDateTime(data.date, data.time);
      
        const status = isDrafted ? 0 : 1;
        const newData = {
            name: data.name,
            scheduled_time: formattedDateTime,
            instructions: instructions,
            subjects: data.subjects,
            status: status
        };

        try {
            let response;
            if (isUpdate) {
                response = await updateExam(id, newData);
                handleSuccessResponse(response, 'Exam Updated Successfully');
                handleSuccessResponse(response, 'Exam Updated and Published Successfully');
                setSelectedSubjectIndex([]);
            } else {
                response = await createExam(newData);
                handleSuccessResponse(response, 'Exam Created Successfully');
                handleSuccessResponse(response, 'Exam Published Successfully');
            }
        } catch (error) {
            handleInsufficentTicketErrorResponse(error);
        }
    };
    const handleCreate = () => {

        setPublishClicked(false)
        setCreateClicked(true)
        const dateValue = getValues("date")
        const timeValue = getValues("time")

        if (dateValue && !timeValue) {
            setDateAndTime({
                date: false,
                time: true
            })
        } else if (!dateValue && timeValue) {
            setDateAndTime({
                date: true,
                time: false
            })
        }
        handleSubjectValueErrors()
        handleSubmit((data) => {
            onSubmit(data, true);
        })();
    }
    const handlePublish = () => {

        setCreateClicked(false)
        setPublishClicked(true)
        handleSubmit((data) => {
            onSubmit(data, false);
        })();
    }

    const handleCloseModal = () => {
        setSubjectFieldError(false)
        setSelectedSubjectIndex([])
        setAddSubjectCount(1);
        setValue("name", "")
        setValue("date", "")
        setValue("time", "")
        setValue("subjects", [{ subject: '', question_count: '', pass_percentage: '', difficulty_level: '', time_duration: '' }])
        setDateAndTime({
            date: false,
            time: false
        })
        clearErrors()
        onClose()


    }
    return (
        <>
            <Modal show={isOpen} onHide={onClose} size="xl" dialogClassName="custom-modal" style={{
            }}>
                <button data-testid="close-button" className="close position-absolute top-0 end-0 m-3" style={{ background: 'none', border: 'none' }} onClick={handleCloseModal}
                >
                    <FaTimes style={{ "color": "red" }} />
                </button>
                <Modal.Header>
                    <Modal.Title>{isUpdate ? "Update Exam" : "Create Exam"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form

                    >
                        <div>
                            <div>
                                <div className="">


                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label htmlFor="name">Name</label>
                                                <input placeholder='name' type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name"
                                                    id="name" data-testId='name'
                                                    {...register("name", { required: true })} />
                                                {errors.name && (
                                                    <div className="invalid-feedback">
                                                        Please provide a name for the exam
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group mb-3">
                                                <label htmlFor="date">Date</label>
                                                <input type="date" className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                                    name="date" id="date" data-testId='date' {...register("date", { required: publishClicked || dateAndTime.date, min: new Date().toISOString().split('T')[0] })} />
                                                {errors.date && (
                                                    <div className="invalid-feedback">
                                                        Please select a valid date (current date or future date)
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="form-group mb-3">
                                                <label htmlFor="time">Time</label>
                                                <div className="input-group">
                                                    <input
                                                        data-testId='time'
                                                        type="time"
                                                        className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                                                        id="time"
                                                        name="time"
                                                        placeholder="Select time"
                                                        {...register("time", {
                                                            required: publishClicked || dateAndTime.time,
                                                        })}
                                                    />

                                                    {errors.time && (
                                                        <div className="invalid-feedback">
                                                            Please select a future time
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">

                                            {addSubjectCount < 3 && (
                                                <button type="button" className="btn btn-primary mt-5" onClick={handleAddSubject} data-dismiss="modal">
                                                    Click here to add subject
                                                </button>
                                            )}

                                        </div>
                                        {fields.map((subject, index) => (
                                            <Row key={subject.id}>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-3">
                                                    <div className="form-group mb-2">
                                                        <label data-testid="Subject" htmlFor={`subjects[${index}].subject`} className='mt-4' style={{ fontSize: "15px" }}>Subject</label>
                                                        <select
                                                            data-testid="select-subject"
                                                            className={`form-select ${errors.subjects?.[index]?.subject ? 'is-invalid' : ''}`}

                                                            name={`subjects[${index}].subject`}
                                                            id={`subjects[${index}].subject`}

                                                            {...register(`subjects[${index}].subject`,

                                                                { required: (publishClicked || subjectFieldError), min: 1, onChange: (e) => handleSubjectSelection(index, e.target.value) })}

                                                        >

                                                            <option value="">Select subject</option>
                                                            {subjectItems.map((subject) => (
                                                                <option data-testid="select-option-subject" key={subject.id} value={subject.id}>
                                                                    {subject.subject_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.subjects?.[index]?.subject && (
                                                            <div className="invalid-feedback">
                                                                Select a subject
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-2">
                                                    <div className="form-group mb-2">
                                                        <label htmlFor={`subjects[${index}].question_count`} className='mt-4' style={{ fontSize: "15px" }}>Total questions</label>
                                                        <input
                                                            data-testId="question_count"
                                                            type="number"
                                                            className={`form-control ${errors.subjects?.[index]?.question_count ? 'is-invalid' : ''}`}
                                                            name={`subjects[${index}].question_count`}
                                                            id={`subjects[${index}].question_count`}
                                                            {...register(`subjects[${index}].question_count`, { required: (publishClicked || (createClicked && selectedSubjectIndex[index] === index)), min: 1 })}
                                                        />
                                                        {errors.subjects?.[index]?.question_count && (
                                                            <div className="invalid-feedback">Total questions cannot be negative or zero</div>
                                                        )}

                                                    </div>
                                                </div>
                                                <div className="ccol-12 ol-sm-12 col-md-12 col-lg-2">
                                                    <div className="form-group mb-2">
                                                        <label htmlFor={`subjects[${index}].pass_percentage`} className='mt-4' style={{ fontSize: "15px" }} >Pass Percentage</label>
                                                        <input
                                                            data-testId="pass_percentage"
                                                            type="number"
                                                            className={`form-control ${errors.subjects?.[index]?.pass_percentage ? 'is-invalid' : ''}`}
                                                            name={`subjects[${index}].pass_percentage`}
                                                            id={`subjects[${index}].pass_percentage`}
                                                            {...register(`subjects[${index}].pass_percentage`, { required: (publishClicked || (createClicked && selectedSubjectIndex[index] === index)), min: 1, max: 100 })}
                                                        />
                                                        {errors.subjects?.[index]?.pass_percentage && (
                                                            <div className="invalid-feedback">Pass Percentage should be between 0 and 100</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-2">
                                                    <div className="form-group mb-2">
                                                        <label data-testid='level' htmlFor={`subjects[${index}].difficulty_level`} className='mt-4 ' style={{ fontSize: "15px" }} >Level</label>
                                                        <select
                                                            data-testid="select-level"
                                                            className={`form-select ${errors.subjects?.[index]?.difficulty_level ? "is-invalid" : ""}`}
                                                            name={`subjects[${index}].difficulty_level`}
                                                            id={`subjects[${index}].difficulty_level`}
                                                            style={{ height: "35px" }}
                                                            {...register(`subjects[${index}].difficulty_level`, { required: (publishClicked || (createClicked && selectedSubjectIndex[index] === index)) })}
                                                        >
                                                            <option value=''>Level</option>
                                                            <option value='1'>Easy</option>
                                                            <option data-testid="select-option" value='2'>Medium</option>
                                                            <option value='3'>Difficult</option>
                                                        </select>
                                                        {errors.subjects?.[index]?.difficulty_level && (
                                                            <div className="invalid-feedback">
                                                                select a level for subject
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-2">
                                                    <div className="form-group mb-2">
                                                        <label htmlFor={`subjects[${index}].time_duration`} className='mt-4' style={{ fontSize: "15px" }}>Duration (min)</label>
                                                        <input
                                                            data-testid="time_duration"
                                                            type="number"
                                                            className={`form-control ${errors.subjects?.[index]?.time_duration ? 'is-invalid' : ''}`}
                                                            name={`subjects[${index}].time_duration`}
                                                            id={`subjects[${index}].time_duration`}
                                                            {...register(`subjects[${index}].time_duration`, { required: (publishClicked || (createClicked && selectedSubjectIndex[index] === index)), min: 1 })}
                                                        />
                                                        {errors.subjects?.[index]?.time_duration && (
                                                            <div className="invalid-feedback">Duration should be greater than zero</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-1 col-lg-1 mt-4">
                                                    <FaTrash

                                                        name="Delete"
                                                        className="trash-icon mt-4"
                                                        style={{ color: "red" }}
                                                        data-testid={`delete${index + 1}`}
                                                        onClick={() => handleDeleteSubject(index)}
                                                    />
                                                </div>
                                            </Row>
                                        ))}


                                      
                                        <div className='mt-4'>
                                        <ReactQuill
                                            placeholder="Add Instructions"
                                            data-testId="instruction"
                                            value={instructions}
                                            onChange={(value) => { setInstructions(value)}}
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': [1, 2, false] }],
                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                   
                                                    ['clean']
                                                ]
                                            }}
                                            formats={[
                                                'header', 'font', 'size',
                                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                'list', 'bullet', 'indent',
                                                
                                            ]}
                                        /></div>

                                        <div className="modal-footer mt-5 d-flex justify-content-center">

                                            <button data-testid='createExambutton' type="button" onClick={handleCreate} className="btn btn-primary col-md-3">{isUpdate ? "Update" : "Create"}</button>
                                            <button data-testid='publishExambutton' type="button" onClick={handlePublish} className="btn btn-success col-md-3">Publish</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>



                    </Form>
                </Modal.Body>
            </Modal>
            {isUpdate && <ToastContainer position="top-right" autoClose={false} />}
        </>
    );
}


CreateExamModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
};


export default CreateExamModal;

