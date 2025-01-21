import { Row, Col, Button } from "react-bootstrap";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pendingEvaluationList } from "@/services/ApiServices";
import "./pendingevaluation.css";
import Pagination from "../pagination/Pagination";
import { useRouter } from "next/navigation";

const formatExams = (examsData) => {
  return examsData.map((exam) => ({
    ...exam,
    scheduled_time: format(new Date(exam.scheduled_time), "dd-MMMM-yyyy"),
  }));
};

const PendingEvaluation = () => {
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState();
  const [pageSize, setPageSize] = useState(0);
  const [sortParams, setSortParams] = useState();
  const [loading, setLoading] = useState(true); 
  const currentUrl = "examate/exam/pending-evaluation-list/";
  const router = useRouter();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await pendingEvaluationList(
          currentUrl,
          sortParams,
          searchTerm
        );
        setLoading(true);
        console.log("pending exam", response);
        const formattedExams = formatExams(response.data.results);
        setExams(formattedExams);
        setTotalPages(response.data.total_pages);
        setPageSize(response.data.page_size);
      } catch (error) {
        toast.error(error);
      }finally {
        
          setLoading(false);
       
      }
    };

    fetchExams();
  }, [currentUrl, searchTerm, sortParams]);

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleSort = (field) => {
    toast.dismiss();
    const newKey = sortParams === field ? `-${field}` : field;
    setSortParams(newKey);
    setCurrentPage(1);
  };

  const fetchDataByPage = async (pageNumber) => {
    setCurrentPage(pageNumber);
    const response = await pendingEvaluationList(
      `${currentUrl}?page=${pageNumber}`,
      sortParams,
      searchTerm
    );
    const formattedExams = formatExams(response.data.results);
    setExams(formattedExams);
  };

  const handleEvaluate = (examid) => {
    router.push(`exam-detail?id=${examid}`);
  };

  return (
    <>
      <div>
        <Row
          className="justify-content-between align-items-center mb-3"
          style={{ marginLeft: "10%" }}
        >
          <Col md={5}>
            <h2 className="main-heading">Exams</h2>
          </Col>

          <Col md={7} sm={12}>
            <div className="search-box d-flex align-items-center">
              <FaSearch
                className="search-icon"
                style={{ marginRight: "5px" }}
              />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: "auto" }}
              />
            </div>
          </Col>
        </Row>
      </div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {!loading && exams.length > 0 && (
        <div className="custom-container mt-5" style={{ marginLeft: "10%" }}>
          <table className="table" style={{ width: "auto" }}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Exams&nbsp;
                    <MdFilterList
                      data-testid="exam-filter"
                      className="filter-icon"
                      onClick={() => handleSort("name")}
                    />{" "}
                  </div>
                </th>

                <th scope="col">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Date&nbsp;
                    <MdFilterList
                      data-testid="date-filter"
                      className="filter-icon"
                      onClick={() => handleSort("scheduled_time")}
                    />
                  </div>
                </th>
                <th scope="col">
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Candidates
                    <MdFilterList
                      data-testid="students-filter"
                      className="filter-icon"
                      onClick={() => handleSort("candidate_count")}
                    />
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={exam.id}>
                  <td style={{ fontFamily: "sans-serif", fontSize: "small" }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td style={{ fontFamily: "sans-serif", fontSize: "small" }}>
                    {exam.name}
                  </td>
                  <td style={{ fontFamily: "sans-serif", fontSize: "small" }}>
                    {exam.scheduled_time}
                  </td>
                  <td
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "small",
                      textAlign: "center",
                    }}
                  >
                    {exam.candidate_count}
                  </td>
                 
                  <td style={{ width: "10%" }}>
                    <Button
                      variant="custom-btn btn-1"
                      onClick={() => handleEvaluate(exam.id)}
                      style={{
                        padding: " 0.10rem 0.25rem",
                        fontSize: "smaller",
                        color: "white",
                      }}
                      data-testid="evaluate-button"
                    >
                      Evaluate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center">
            <div className="pagination-items mt-3">
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={totalPages}
                pageSize={1}
                setCurrentPage={setCurrentPage}
                onPageChange={fetchDataByPage}
              />
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={false} />
        </div>
     
      )}

{!loading && exams.length === 0 && (
        <div className="text-center py-4">
          <p style={{ color: "red" }}>No exams found.</p>
        </div>
      )}

    </>
  );
};
export default PendingEvaluation;
