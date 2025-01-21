"use client";
import React, { useState } from 'react';
import Rating from 'react-rating';
import "./rating.css"
import {useSearchParams,useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { feedback } from '@/services/ApiServices';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RatingComponent = () => {
  const searchParams = useSearchParams()
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const router = useRouter();
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };



  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Exit early if form is not valid
    }
    // Send rating and comment data to backend
    try {
      const examId = searchParams.get('exam_id')
      const candidateId = searchParams.get('candidate_id');
      const feedbackData = {
        exam: examId,
        candidate: candidateId,
        rating: rating,
        feedback: comment
      }
    const response = feedback(feedbackData);
    console.log(response)
    Swal.fire({
      icon: "success",
      title: "Thank you",
      showConfirmButton: false,
      timer: 1500
      });
      document.exitFullscreen()
      router.push(`thankyou`);
    }
    catch (error) {
      toast.error(error);
    }
  };

  const validateForm = () => {
    if (rating === 0 || comment.trim() === '') {
      Swal.fire({
        icon: "warning",
        title: 'Kindly give feedback it will help us to improve!',})
      return false;
    }
    return true;
  };

  return (
    <div className='container'>
      <div className='card-container'>
        <h1 className='main-heading'>Rate Your Experience With Us</h1>

        <Rating
          initialRating={rating}
          emptySymbol={<span className="icon">&#9734;</span>}
          fullSymbol={<span className="icon" style={{ color: 'yellow' }}>&#9733;</span>}
          onChange={(value) => setRating(value)}
          fractions={2}  

        />
        <textarea
          className='feedback'
          value={comment}
          onChange={handleCommentChange}
          placeholder="Enter any comments..."
          rows={3}
          cols={30}
        />
        <button className='button-rating'  data-testid="rating-submit"  onClick={handleSubmit}>SUBMIT</button>
      </div>
      <ToastContainer position="top-right" autoClose={false} />
    </div>

  )
};
export default RatingComponent;
