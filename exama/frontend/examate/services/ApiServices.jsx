import { axiosPrivate } from "@/interceptor/Interceptor";

const registration = async (data) => {
   return  await axiosPrivate.post('examate/user-register/', data);
};
const login = async (data) => {
    try{
      const response = await axiosPrivate.post('examate/login/',data);
      return response;
    }
   catch (error) {
    if (error.response) {
        const errorMessage = error.response?.data?.detail;
        console.log(errorMessage)
        throw new Error(errorMessage);
    } else if (error.request) {
        console.log(error.request)
        throw new Error ('Network Error: Unable to connect to the server');
    } else {
        throw new Error('Network Unable to connect to the server');
    }
}
}

const googleLogin = async(credentials) => {
    return await axiosPrivate.post('examate/google/login/',credentials)
}


const forgetPassword = async (data) => {
        return  await axiosPrivate.post('examate/forget-password/', data);
};


const otpVerification =async (url,data)=>{
       console.log("Otp verfication");
        return await axiosPrivate.patch(url,data)
}


const resendOtp =async (data)=>{
    console.log("Resend otp");
        return await axiosPrivate.post('examate/resend-otp/',data)
   
}

const resetPassword = async(data) => {
        return await  axiosPrivate.patch('examate/reset-password/',data)
    

}

const fetchConsumersDetails= async (url,data) => {
        return await axiosPrivate.get(url,{ params:data})  
  };

  const searchbyName= async (url) => {
        return await axiosPrivate.get(url);
  };


  const switchUserAccountStatus= async (id) => {
        return await axiosPrivate.patch(`/examate/organization/switch-user-status/${id}/`);
  };



  const deleteUserAccount= async (id) => {
        return await axiosPrivate.patch(`/examate/organization/delete-user/${id}/`);
  };

const subjectListing = async (url) => {
    try {
        const response = await axiosPrivate.get(url);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};

const subjectAdding = async (subjectData) => {
    try {
        const response = await axiosPrivate.post('examate/subjects/create/',subjectData);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};
const subjectdropdownListing = async () => {
    try {
        const response = await axiosPrivate.get('examate/subjects/dropdownlist/');
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};
const createquestion = async (data) => {
    try {
        const response = await axiosPrivate.post('question/create-question/',data);
        return response;
    } catch (error) {
        if (error.response) {

            const errorMessage = error.response.data.message;
            console.log("From service error"+error.response.data.message)
            console.log(errorMessage);
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};
const searchBySubject = async (name) => {
    try {
        const response = await axiosPrivate.get(`examate/subjects/search/?search=${name}`);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};
const questiontListing = async (page,filterparams,searchparam) => {
    try {

        const response = await axiosPrivate.get('question/question-list',{params:{...filterparams,searchparam,page}});
        return response;
    } 
    catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};

const questiontDetail = async (questionid) => {
    try {
        const response = await axiosPrivate.get(`question/question-details/${questionid}`);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};


const subjectDeleting = async (id) => {
    try {
        const response = await axiosPrivate.delete(`examate/subjects/delete/${id}/`);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};
const deleteQuestion= async (questionid) => {
    try {
        const response = await axiosPrivate.delete(`/question/question-delete/${questionid}/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };
  const ApproveQuestion= async (questionid) => {
    try {
        const response = await axiosPrivate.post(`/question/approve-question/${questionid}/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };


  const TotalCount= async () => {
    try {
        const response = await axiosPrivate.get(`/question/count/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };

  
    const candidateListing = async (url,searchparam,sortingParams) => {
    try {
        console.log("in api",sortingParams)
        const response = await axiosPrivate.get(url,{params:{searchparam,ordering:sortingParams}});
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};
const AddCandidateService = async (url,data) => {
    try {
        const response = await axiosPrivate.post(url,data);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
    };


const createExam = async (data) => {
        return axiosPrivate.post('examate/exam/create-exam/', data);
}

const updateExam = async (id,data) => {
     return await axiosPrivate.put(`examate/exam/update-exam/${id}/`, data);
}
        

const fetchExamDataById = async (id) => {
        return  await axiosPrivate.get(`/examate/exam/exam-details/${id}/`);   
        };



    const candidateInvite= async (data) => {
                try {
                    const response = await axiosPrivate.post(`examatecandidates/access-link/`,data);
                    console.log("from service",response)
                    return response;
                } catch (error) {
                    if (error.response) {
                        const errorMessage = error.response.data.message;
                        console.log(errorMessage)
                        throw error;
                    } else if (error.request) {
                        throw new Error('Network Error: Unable to connect to the server');
                    } else {
                      throw new Error('Network Error: Unable to connect to the server');
                    }
                }
              
                };
            

    const examlinkExpire= async (data) => {
        try {
        console.log("imapi",data)
        const response = await axiosPrivate.post(`examatecandidates/check-token-expiration/`,data);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };
const candidateList= async (examid) => {
    try {
        const response = await axiosPrivate.get(`examatecandidates/exam-candidate-list/${examid}/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };
  const CandidateDelete = async (url) => {
    try {
        const response = await axiosPrivate.delete(url);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};

  



  const examListing = async (url,sortParams,search) => {
        const response = await axiosPrivate.get(url,{params:{search,ordering:sortParams}});
        return response;
    
};
const cancelExam= async (id) => {
        const response = await axiosPrivate.patch(`/examate/exam/exam-cancel/${id}/`);
        return response;
}
const deleteExamDetails= async (id) => {
    try {
        const response = await axiosPrivate.put(`/examate/exam/exam-delete/${id}/`);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };

    const updateQuestion = async (id,data) => {
            return await axiosPrivate.put(`question/update-question/${id}/`, data);
    
    };

    const fetchExamDetailsByToken = (data)=>{
        return axiosPrivate.post('/examate/exam/exam-detail/',data)
    }

    const addCandidateName = (data)=>{
        return axiosPrivate.post('/examatecandidates/add-name/',data)
    }
    


  

const examQuestions= async (subject_id) => {
    try {
        const response = await axiosPrivate.get(`examate/exam/exam-questions/${subject_id}/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };
  

    

const examDetails= async (examid) => {
    try {
        const response = await axiosPrivate.get(`examate/exam/exam-detail/${examid}/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
};
  


  
const regenerateQuestions = async (examid,subjectid) => {
        
            return await axiosPrivate.get(`/examate/exam/regenarate-questions/${examid}/${subjectid}/`);
            
    
    };

    const examsubjectListing = async (examid) => {
        console.log("in api",examid)
        const response = await axiosPrivate.get(`examate/exam/exam-subjects/${examid}/`);
        return response;
    };
    const examquestionsListing = async (examsubjectid,pagenumber) => {
        const response = await axiosPrivate.get(`question/exam-questions/${examsubjectid}/`,{params:{page:pagenumber}});
        return response;
    };
    const examanswersheetsubmit = async (candidate_id,examsubjectId,answersheet) =>{
        const response = await axiosPrivate.post(`examateanswers/candidateanswers/${examsubjectId}/${candidate_id}/`,answersheet);
        return response;
    }
    const fetchdecodedcandidate = async (data) =>{
        try{
        const response = await axiosPrivate.post(`examatecandidates/examtokendecode/`,data)
        return response;
    }
    catch(error){
        const errorMessage = error.response.data.message;
        console.log("exam error :",errorMessage)
        throw new Error(errorMessage);
    }

    }
    

const enduserservices = {
    examsubjectListing,
    examquestionsListing,
    examanswersheetsubmit,
    fetchdecodedcandidate
};

const timer= async (id) => {
        return await axiosPrivate.get(`/examate/exam/exam-timer/${id}/`);       
  }; 
  
  const scheduled_time= async (exam_id) => {
    try {
        const response = await axiosPrivate.get(`/examate/exam/exam-time/${exam_id}`);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  }; 
        

 const subjectPopularityCount= async () => {
    try {
        const response = await axiosPrivate.get(`examate/exam/subject-popularity/`);
        console.log("from service",response)
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
   };




  const pendingEvaluationList = async (url,sortParams,search) => {
    try {
        const response = await axiosPrivate.get(url,{params:{search,ordering:sortParams}});
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};


   const feedback = async (feedbackData) => {
    try {
        const response = await axiosPrivate.post('examate/exam/exam-feedback/',feedbackData);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};

 const feedbackList =  async (examId) => {
    try {
        const response = await axiosPrivate.get(`/examate/exam/exam-feedback/${examId}`);
        return response;
    } catch (error) { 
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };
  const evaluatedCandidateList =  async (examId,search) => {
   
        const response = await axiosPrivate.get(`examatecandidates/evaluated-candidate-list/${examId}`,{params:{
            search
        }});
        return response;
    
  
  };
  const fetchCandidateFreeAnswersDetails = (id, url = null) => {
    if (url) {
      return axiosPrivate.get(url);
    } else {
      return axiosPrivate.get(`examate/mark/candidate-free-answers/${id}/`);
    }
  };


  const evaluationFinalSubmission = async(data) =>{
    return await axiosPrivate.put('examate/mark/evaluate-free-answer/',data)
   }
  
const downloadMarkList = async (examId) => {
    try {
        const response = await axiosPrivate.get(`examate/exam/download-mark-list/${examId}`);
        return response;
    } catch (error) { 
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Network Error: Unable to connect to the server');
        } else {
          throw new Error('Network Error: Unable to connect to the server');
        }
    }
  
  };

  const buyTicket = async (ticket_count) => {
    
        return await axiosPrivate.post('tickets/buy-ticket/',{ticket_count:ticket_count});
      
   
};
const ticketList = async (page) => {
    try {  
        const response = await axiosPrivate.get(`tickets/ticket-list/?page=${page}`);
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
}

  const examNameListing = async () => {
    try {
        
        const response = await axiosPrivate.get('examate/exam/exam-list');
        return response;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage)
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error ('Network Error: Unable to connect to the server');
        } else {
            throw new Error('Network Unable to connect to the server');
        }
    }
};

const PublishResult = async (candidateIdList)=> {
    return await axiosPrivate.post('examatecandidates/send-result-emails/',candidateIdList);
}

const getexamscount = async () =>{
    return await axiosPrivate.get('examate/exam/exam-count')
}

const getexamslist = async (status) =>{

    return await axiosPrivate.get(`examate/exam/dasboardExamList/${status}/`)
}
const getTicketStatusCounts = async() =>{
    return await axiosPrivate.get('tickets/ticket-status-count/')
}

const ticketRequestlist = async (page) =>{

    return await axiosPrivate.get(`tickets/ticket-request/?page=${page}`)
}
const ticketApprove =async (data) => {
    return await  axiosPrivate.put('tickets/ticket-status-update/',data)
}
const deleteTicketRequest = async (data) => {
    
    return await  axiosPrivate.put('tickets/ticket-status-update/',data)
}
const ticketHistory = async (searchparam,sortingParam,page) =>{
    return await axiosPrivate.get('tickets/ticket-history',{params:{searchparam,sortingParam,page}})
}
const viewProfile = async ()=>{
    return await axiosPrivate.get('examate/view-profile')
}
const applyeditchanges =async (data,config)=>{
    return await axiosPrivate.put('examate/update-profile-field/',data,config)
}

const deviceRegister =async (data)=>{
  
    return await axiosPrivate.post('tickets/register-device/',data)
   
}

const deleteDeviceRegisterToken =async (deviceIdToken)=>{
  
    return await axiosPrivate.delete(`tickets/delete-register-device/${deviceIdToken}`)

}

const getNotificationsList = async () =>{
    return await axiosPrivate.get('tickets/notifications-list/')
}

const getNotificationsCount = async () => {
    return await axiosPrivate.get('tickets/notifications/count/')
}
const getRevenueData = async () => {
    return  await axiosPrivate.get(`tickets/revenue/`);   
    };


const PaymentCheckout =async (ticketCount)=>{
  
        return await axiosPrivate.post('transaction/payment-checkout/',ticketCount)
       
}
const PaymentConfirmation =async (payment_inputs)=>{
    console.log("payment conifirm APi service");
  
    return await axiosPrivate.post('transaction/payment-confirmation/',payment_inputs)
}
const saveMessage= async (data) => {
    return await axiosPrivate.post('chat/save-message/',data);
};

const getMessages= async (clientId=0,flag=-1) => {
const data = { params: { client_id: clientId,flag:flag } }
console.log("data",data)
return await axiosPrivate.get(`chat/get-messages/`,data);
};

const updateMessagesReadStatus = async(latestMessageId,clientId=-1) =>{
const data={"latest_message_id":latestMessageId,"client_id":clientId}
return await axiosPrivate.patch('chat/mark-messages-read/',data)
}

const getUnreadMessagesCount = async(clientId)=>{
const data = { params: { client_id: clientId } }
console.log("I am called ",data);
return await axiosPrivate.get('chat/unread-messages-count/',data)
}

const getUserDetails  = async(id) => {
return await axiosPrivate.get('get-user-details/',{"user_id":id})
}
const getAdminDetails  = async() => {
    return await axiosPrivate.get('examate/get-admin-details/')
}



export {
    registration,
    forgetPassword,
    resetPassword,
    otpVerification,
    resendOtp,
    login,
    fetchConsumersDetails,
    searchbyName,
    switchUserAccountStatus,
    deleteUserAccount,
    subjectListing,
    subjectAdding,
    subjectdropdownListing,
    questiontListing,
    questiontDetail,
    searchBySubject,
    subjectDeleting,
    deleteQuestion,
    ApproveQuestion,
    createquestion,
    TotalCount,
    candidateListing,
    createExam,
    fetchExamDataById,
    updateExam,
    examDetails,
    AddCandidateService,
    updateQuestion,
    candidateInvite,
    deleteExamDetails,
    examListing,
    candidateList,
    examlinkExpire,
    examsubjectListing,
    timer,
    scheduled_time,
    enduserservices,
    feedback,
    examQuestions,
    pendingEvaluationList,
    regenerateQuestions,
    subjectPopularityCount,
    fetchExamDetailsByToken,
    addCandidateName,
    CandidateDelete,
    fetchCandidateFreeAnswersDetails,
    evaluationFinalSubmission,
    feedbackList,
    examNameListing,
    evaluatedCandidateList,
    PublishResult,
    downloadMarkList,
    getexamscount,
    getexamslist,
    buyTicket,
    ticketList,
    getTicketStatusCounts,
    ticketRequestlist,
    ticketApprove,
    deleteTicketRequest,
    ticketHistory,
    cancelExam,
    viewProfile,
    googleLogin,
    applyeditchanges,
    deviceRegister,
    deleteDeviceRegisterToken,
    getNotificationsList,
    getNotificationsCount,
    getRevenueData,
    PaymentCheckout,
    PaymentConfirmation,
    saveMessage,
    getMessages,
    updateMessagesReadStatus,
    getUnreadMessagesCount,
    getUserDetails,
    getAdminDetails

}
