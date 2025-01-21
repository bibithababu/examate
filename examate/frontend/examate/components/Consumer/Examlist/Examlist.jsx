"use client";
import "./exam-list.css";
import Link from 'next/link';
import { Row, Col,Button,Modal } from "react-bootstrap";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { FaSearch, FaTrash,FaFilter} from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { examListing,deleteExamDetails,cancelExam} from "@/services/ApiServices";
import CreateExamModal from "@/components/createexammodal/CreateExamModal";
import FilterModal from "./examfilter";
import Pagination from "@/components/pagination/Pagination";


const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "Drafted";
    case 1:
      return "Confirmed";
    case 2:
      return "Completed";
    case 3:
      return "Evaluated";
    case 4:
      return "Result Published";
    case 5:
      return "Cancelled";
    default:
      return "Unknown Status";
  }
};

const formatExams = (examsData) => {
  return examsData.map((exam) => ({
    ...exam,
    scheduled_time: exam.scheduled_time ? format(new Date(exam.scheduled_time), "dd-MMMM-yyyy") : null,
    is_drafted: exam.is_drafted ? "Drafted" : "Published",
  }));
};

export const convertMinutesToHoursMinutesSeconds = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const seconds = 0;

  return {
    hours,
    minutes: remainingMinutes,
    seconds,
  };
};

const ExamList = () => {
  const [exams, setExams] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState( );
  const [pageSize, setPageSize] = useState(1);
  const [sortParams, setSortParams] = useState('-scheduled_time');
  const [currentUrl, setCurrentUrl] = useState("examate/exam/exam-list/");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [noExams,setNoExams]=useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [examToCancel, setExamToCancel] = useState(null);
  
 
    const fetchExams = async (url) => {
      try {
        setIsLoading(true); // Set loading to true
        const response = await examListing(url,sortParams,searchTerm)
        // to format the date
        const formattedExams = formatExams(response.data.results);
        setExams(formattedExams);
        setNoExams(false)
        setCurrentUrl(url);
        setTotalPages(response.data.total_pages);
        setPageSize(response.data.page_size);
        setIsLoading(false); 
      } catch (error) {
        setIsLoading(false);
        toast.error(error)
        if (error?.response?.data?.errorCode === "E43002") {
          setNoExams(true);
        }
       
      }
    };

  useEffect(() => {
    fetchExams(
      `/examate/exam/exam-list` 
    );
  }, [searchTerm, sortParams]);

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
  }

  const handleSort = (field) => {
    toast.dismiss();
    const newKey = sortParams === field ? `-${field}` : field;
    setSortParams(newKey);
    setCurrentPage(1);

  };

  const handleConfirmCancel = (examId,status) => {
    setExamToCancel(examId);

    if(status===1)
      {
        setShowCancelModal(true);
      }
    else
      {
        setShowCancelModal(false);
        handleCancel(examId);
      }
  };


  const handleDelete = async (id) => {
    toast.dismiss();
    try {
      const response = await deleteExamDetails(id);
   
      if (response.status === 204) {
        
        if (exams.length === 1 && currentPage === 1) {
          setNoExams(true);
        }
        if(exams.length === 1) {
          setTotalPages((totalPages)=>totalPages-1);
          fetchDataByPage(currentPage-1); 

        } else {
          setTimeout(()=>{ 
            toast.success("Exam deleted successfully")
          },100)
          fetchDataByPage(currentPage); 
        } 
     
      } else {
        toast.error(" Can't delete the exam");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const handleCancel = async (examToCancel) => {
    toast.dismiss();
    try {
      const response = await cancelExam(examToCancel);
   
      if (response.status === 200) {
        
        if (exams.length === 1 && currentPage === 1) {
          setNoExams(true);
        }
        if(exams.length === 1) {
          setTotalPages((totalPages)=>totalPages-1);
          fetchDataByPage(currentPage-1); 

        } else {
          setTimeout(()=>{ 
            toast.success("Exam cancelled successfully,Tickets for this exam are Refunded")
          },100)
          setShowCancelModal(false);
          fetchDataByPage(currentPage); 
        }  
    } 
    else {
        toast.error(" Can't cancel the exam");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchExams('/examate/exam/exam-list/');
  };


  

const handleFilterChange = (selectedValue) => {
  console.log("selected value",selectedValue)
  const url = selectedValue ? `/examate/exam/exam-list/?status=${selectedValue}` : "/examate/exam/exam-list/";

  setCurrentPage(1); 
  fetchExams(url);
};
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

const fetchDataByPage = async (pageNumber) => {
  try {
    if(pageNumber==0){
      return
    }
    let url = currentUrl;
    if (url.includes("?")) {
      url += `&page=${pageNumber}`; 
    } else {
      url += `?page=${pageNumber}`; 
    }
    const response = await examListing(url, sortParams, searchTerm);
    const formattedExams = formatExams(response.data.results);
    setExams(formattedExams);
    setCurrentPage(pageNumber);


  } catch (error) {
    toast.error(error.message);
  }
};

const handleCloseCancelModal = () => {
  setExamToCancel(null);
  setShowCancelModal(false);
};

 
const renderTableContent = () => {
  return (
    <>
      {noExams ? (
        <div className="text-center py-4">
          <p style={{ color: "red" }}>No Exams found.</p>
        </div>
      ) : (
        <div className="custom-container">
          <div className="table-responsive">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "5%" }}>
                    #
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Exams&nbsp;
                      <MdFilterList
                        data-testid="exam-filter"
                        className="filter-icon"
                        onClick={() => handleSort("name")}
                      />{" "}
                    </div>
                  </th>

                  <th scope="col" style={{ width: "15%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Date&nbsp;
                      <MdFilterList
                        data-testid="date-filter"
                        className="filter-icon"
                        onClick={() => handleSort("scheduled_time")}
                      />
                    </div>
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Candidates&nbsp;
                      <MdFilterList
                        data-testid="students-filter"
                        className="filter-icon"
                        onClick={() => handleSort("candidate_count")}
                      />
                    </div>
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Duration&nbsp;
                      <MdFilterList
                        data-testid="duration-filter"
                        className="filter-icon"
                        onClick={() => handleSort("exam_duration")}
                      />
                    </div>
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Status&nbsp;
                      <MdFilterList
                        data-testid="status-filter"
                        className="filter-icon"
                        onClick={() => handleSort("status")}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={exam.id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      {/* Wrap the exam name in a Link component */}
                      <Link href={`/consumer/exam-detail?id=${exam.id}`}>
                        {exam.name}
                      </Link>
                    </td>
                    <td style={{ color: exam.scheduled_time ? 'inherit' : 'red' }}>
                      {exam.scheduled_time ? exam.scheduled_time : "Not provided"}
                    </td>
                    <td>{exam.candidate_count}</td>
                    <td>
                      {" "}
                      {exam.exam_duration &&
                        `${
                          convertMinutesToHoursMinutesSeconds(exam.exam_duration)
                            .hours
                        }h 
              ${
                          convertMinutesToHoursMinutesSeconds(exam.exam_duration).minutes
                        }m 
              ${String(
                          convertMinutesToHoursMinutesSeconds(exam.exam_duration).seconds
                        ).padStart(2, "0")}s`}
                    </td>
                    <td>{getStatusLabel(exam.status)}</td>
                    <td style={{ width: "10%" }}>
                      <FaTrash
                        size={20}
                        color="red"
                        data-testid={`delete${index+1}`}
                        onClick={() => handleDelete(exam.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td>
                      <div className="button-container">
    <Button data-testid={`cancel${index+1}`} variant="danger" size="sm" onClick={() => handleConfirmCancel(exam.id, exam.status)} disabled={exam.status !== 1}>
        {exam.status === 5 ? "Cancelled" : "  Cancel "}
    </Button>
    </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-items mt-3">
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={totalPages}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                onPageChange={fetchDataByPage}
              />
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={false} />
        </div>
      )}
    </>
  );
  };
  
  return (
    <>
      <div> 
              
        <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onApplyFilter={handleFilterChange} />
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="main-heading">Exams</h2>
          </Col>

          <Col md={6} sm={12} className="mt-3 mt-md-5">

            <div className="search-box">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
            <Button  data-testid="create-exam" onClick={openModal} variant="outline-primary" className="mt-4"style={{borderRadius:'1px'}}>
              + Create Exam
            </Button><Button onClick={openFilterModal} style={{borderRadius:'1px'}} className="mt-4"><FaFilter />Filter</Button>
           
          </Col>
            
        </Row>

      </div>
    
      {isLoading && (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    )}

    {!isLoading && renderTableContent()}
      <CreateExamModal fetchExam={fetchExams} url='/examate/exam/exam-list/' isOpen={isModalOpen} onClose={closeModal} />
      
      <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
        <Modal.Header closeButton>
          <Modal.Title>CONFIRM CANCEL</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Cancel this Exam?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleCancel(examToCancel)}>
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    
  );
};
export default ExamList;