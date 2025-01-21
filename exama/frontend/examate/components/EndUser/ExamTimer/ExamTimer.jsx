import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import "./exam-timer.css";
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ExamTimer = ({duration,handleSubmit}) => {
  const [timeDuration, setTimeDuration] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isTimerRunning , setIsTimerRunning] = useState(true);
  

  // Function to fetch the time duration for a specific exam subject
  const fetchTimeDuration = async () => {
      const format_time=duration;
      setTimeDuration( format_time);
  }

  useEffect(() => {
    fetchTimeDuration();
  }, [duration]);

  useEffect(() => {
    if (timeDuration !== null) {
      const hours = Math.floor(timeDuration / 60 / 60);
      const minutes = Math.floor((timeDuration / 60) % 60);
      const seconds = timeDuration % 60;
      setRemainingTime({ hours, minutes, seconds });
    }
  }, [timeDuration]);

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    
    Swal.fire({
      icon: 'error',
      title: 'Time Up!',
      text: 'Your time is up. your answers have been submitted',
      timer: 10000, // Display the alert for 10 seconds
      timerProgressBar: true, // Enable the timer progress bar
      onClose: handleSubmit
    }).then(function () {
      handleSubmit();
    });
 
  };

  return (
    <div>
      {remainingTime && isTimerRunning ? (
  <div >
    <Countdown
      date={Date.now() + timeDuration * 1000}
      onComplete={handleTimeUp}
      renderer={({ hours, minutes, seconds }) => {
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const timeLeft = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        const color = hours === 0 && minutes === 0 && seconds <= 10 ? 'red' : 'green';
        return <span style={{ color }}>{timeLeft} Left</span>;
      }}
    />
  </div>
) : null}
        {/* <button onClick={handleSubmit}>Submit</button> */}
       
    
    </div>
    
  );
};
ExamTimer.propTypes = {
  duration:PropTypes.number.isRequired
};
export default ExamTimer;
