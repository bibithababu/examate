
import React, { useState, useEffect } from 'react';
import { FaSearch} from "react-icons/fa";
import { Button,Row } from 'react-bootstrap';
import "./evaluated-candidate.css";
import { evaluatedCandidateList,downloadMarkList ,PublishResult} from "@/services/ApiServices";
import Pagination from "@/components/pagination/Pagination";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

const EvaluatedCandidate = ({examId}) => {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm,setSearchTerm]=useState( );
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const router = useRouter();
    const [pageSize, setPageSize] = useState(0);
    const [loading,setLoading] = useState()
    const [noCandidate,setNoCandidate]=useState(false)

    let statusMessage = ""
   
    const getStatusMessage=(status) => {

      switch (status)
      
      {
        case 0:statusMessage='Added';
        break;
        case 1:statusMessage='Invited';
        break;
        case 2:statusMessage='Attended';
        break;
        case 3:statusMessage='Submitted';
        break;
        case 4:statusMessage='Evaluated';
        break;
        case 5:statusMessage='Published';
        break;
      }return statusMessage;
    }
    useEffect(() => {
      const fetchCandidates = async () => {
        try {
          
          const response = await evaluatedCandidateList(examId,searchTerm)
          setCandidates(response.data.results);
          setTotalPages(response.data.total_pages);
          setPageSize(response.data.page_size);
          setNoCandidate(false)
        } catch (error) {
          if (error?.response?.data?.errorCode === "E63002") {  
            setNoCandidate(true);
          }
          
          
        }
      };
      
      fetchCandidates();
    }, [searchTerm]);

   const handleEvaluate = (candidateId) => {
      router.push(`free-answer-evaluation?candidate_id=${candidateId}`);
    };

    const handleSearch = async (searchTerm) => {
      setSearchTerm(searchTerm);
    };

    const fetchDataByPage = async (pageNumber) => {
      try {
        setCurrentPage(pageNumber);
        const response = await evaluatedCandidateList( `${examId}/?page=${pageNumber}`,searchTerm);
        setCandidates(response.data.results);
      } 
      catch (error) {
        toast.error("Issue in fetching evaluated list")
      }
    };
   

    const handlePublish = async () =>{
      setLoading(true)
      const filteredCandidates = candidates.filter(candidate => candidate.candidate_status === 4);
      const candidateIds = filteredCandidates.map(candidate => candidate.candidate_id);
      try{
        await PublishResult(candidateIds)
        toast.success("Exam result published successfully", { autoClose: 2000 });
      }
      catch(error)
      {
        toast.error(error,{ autoClose: 2000 });
      }
      finally{
        setLoading(false)
      }
    }
      const handleDownload = async () => {
    try {
        const response = await downloadMarkList(examId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
        const url = window.URL.createObjectURL(blob);
      
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `mark_list_exam_${examId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        toast.error(error.message);
    }
};

  
    return(
      <div>
      <ToastContainer/>
      <div>
      <h2 className="main-heading">Exam Candidates</h2>
      <Row className="row gy-2">
      <div className="col-sm-12 col-md-6 col-lg-8">
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
          </div>
          
            <div className="col-sm-12 col-md-3 col-lg-2 d-flex justify-content-lg-end"><button type="button" disabled={candidates.filter(candidate => candidate.candidate_status === 4).length === 0 || loading} onClick={handlePublish} className="btn btn-primary">PUBLISH</button></div>
           <div className="col-sm-12 col-md-3 col-lg-2"><button type="button" disabled={candidates.filter(candidate => candidate.candidate_status === 4).length === 0||loading} onClick={handleDownload} className="btn btn-primary" data-testid="download">DOWNLOAD</button></div>
          </Row>
          {noCandidate ? (
           <div className="text-center py-4">
           <p style={{ color: "red" }}>No candidates found.</p>
         </div>
        ) : (
          <div>
      <table className="table">
        <thead>
          <tr>
          <th scope="col" style={{ width: "20%" }}>Candidate ID</th>
          <th scope="col" style={{ width: "20%" }}>Candidate Name</th>
          <th scope="col" style={{ width: "20%" }}>Status</th>
            {candidates.length > 0 &&
                Object.keys(candidates[0].exams).map((subject, index) => (
                              <th scope="col" style={{ width: "10%" }}key={index++}>{subject}</th>
                          ))}
          </tr>
        </thead>
        <tbody>
                  {candidates.map(candidate => (
                      <tr key={candidate.candidate_id}>
                          <td>{candidate.candidate_id}</td>
                          <td>{candidate.candidate_name ?? candidate.candidate_email}</td>
                          <td>
                          <Button data-testid={"candidate-status"} variant="success" size="sm"onClick={() => handleEvaluate(candidate.candidate_id)} disabled={candidate.candidate_status !== 3}>
                                  {getStatusMessage(candidate.candidate_status)}

                              </Button>

                          </td>                     
                          {Object.entries(candidate.exams).map(([subject, marks]) => (
        <td key={subject}>{marks}</td>
      ))}                      
                      </tr>
                  ))}
              </tbody>
      </table>
           
<div className="text-center">
<div className="pagination-items mt-3 d-flex justify-content-center">
  <Pagination
    className="pagination-bar "
    currentPage={currentPage}
    totalCount={totalPages}
    pageSize={pageSize}
    setCurrentPage={setCurrentPage}
    onPageChange={fetchDataByPage}
  />
</div>
</div>
</div>
)}
</div>
</div>
     
        
    );
}; 
export default EvaluatedCandidate;
