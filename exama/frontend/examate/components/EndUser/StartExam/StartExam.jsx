import React, { useState, useEffect } from 'react';
import "./start-exam.css"
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { scheduled_time } from '@/services/ApiServices';

const StartExam = () => {
    const searchParams = useSearchParams()
    const exam_id = searchParams.get('id')
    const token = searchParams.get("token");
    const [scheduledTime, setScheduledTime] = useState();
    const router = useRouter();

    const fetchScheduledTime = async () => {
        try {
          const response=await scheduled_time(exam_id);
     
          const schedule_time = new Date(response.data.scheduled_time);
          setScheduledTime(schedule_time)
        } catch (error) {
          console.error('Error fetching exam subject time duration:', error);
        }
      };
    
    useEffect(() => {
        fetchScheduledTime();
    }, []);
    
    const handleStartExam = () => {
            const currentTime = new Date();
            // Compare the current time with the scheduled time
            if (scheduledTime && currentTime < scheduledTime) {
              const formattedScheduledTime = scheduledTime.toLocaleString('en-US', {
                weekday: 'long', // Display the full name of the weekday
                month: 'long', // Display the full name of the month
                day: 'numeric', // Display the day of the month
                year: 'numeric', 
                hour: 'numeric',
                minute: 'numeric',
                hour12: true // Format time in 12-hour format
            });
            console.log("swal is fired")
                Swal.fire({
                    icon: "warning",
                    title: 'Exam Not Started Yet!',
                    text: `The exam will start at ${formattedScheduledTime}. Please wait until then.`,
                });
                return; // Prevent further execution
            }
        
        try {
          if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen();
          } else {
            console.error('Fullscreen mode not supported.');
          }
        } catch (error) {
          console.error('Error entering fullscreen mode:', error);
        }
        router.push(`/exam?id=${exam_id}&token=${token}`);
        
      };

    return(
    <div className='start-exam' >
        <img src='/images/start_exam.png' alt='start exam logo' width={300} height={300} />
        <button className='start-exam-button'  data-testid="start-exam" onClick={handleStartExam}>START EXAM</button>
    </div>
    )
};

export default StartExam;
