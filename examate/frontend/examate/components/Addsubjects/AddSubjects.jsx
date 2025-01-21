"use client";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./addsubject.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaTrash } from "react-icons/fa";
import CreateQuestion from "../createquestion/createquestion";

import {
  subjectListing,
  searchBySubject,
  subjectAdding,
  subjectDeleting,
} from "@/services/ApiServices";

const AddSubject = () => {
  const [newSubject, setNewSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nextLink, setNextLink] = useState("");
  const [previousLink, setPreviousLink] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true); 
  const[pageSize,setPageSize]=useState(0)
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("/examate/subjects/list/");

  const fetchSubjects = async (url) => {
    try {
      const response = await subjectListing(url);
      setCurrentUrl(url);
      setLoading(true);
      setSubjects(response.data.results);
      setNextLink(response.data.next);
      setPreviousLink(
        response.data.previous === null ? url : response.data.previous
      );
      setTotalPages(response.data.total_pages);
      setLength(response.data.results.length);
      setPageSize(response.data.page_size);

     
     
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubjects(currentUrl);
  }, []);

 

  const handleDelete = async (id) => {

    toast.dismiss();
    try {
      const response = await subjectDeleting(id);
      if (response.status == 204) {
        if (length == 1) {
          fetchSubjects(previousLink);
          setCurrentPage((previousPage) => previousPage - 1);
        } else {
          
          fetchSubjects(currentUrl);
        }
        toast.success("subject deleted successfully");
      } else {
        toast.error("Failed to delete subject ");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error(error.message)
    }
  };
  const handleAddSubject = async () => {
    toast.dismiss();
    if (newSubject.trim() === "") {
      toast.error("Please enter a subject name.");
      return;
    }
    try {
      const subjectData = { subject_name: newSubject };
      await subjectAdding(subjectData);
      fetchSubjects(currentUrl);
      setNewSubject("");
      setShowModal(false);
      if (currentPage === 0) {
        setCurrentPage((previousPage) => previousPage + 1);
      }
      toast.success("Subject added successfully!");
    } catch (error) {
      toast.error("Failed to add subject." + error.message);
    }
  };
  const handleSearch = async (searchTerm) => {
    toast.dismiss();
    try {
      const response = await searchBySubject(searchTerm);
  
      
      setSubjects(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(1);
    } catch (error) {
      if (error) {
        setSubjects([]);
      }
    }
  };
  const handlePagination = async (url, page) => {
    toast.dismiss();
    fetchSubjects(url);
    setCurrentPage(page);
  };

  return (
    <div className="full-width-container ">
      <h2 className="main-heading">Subjects</h2>
      <Row className="align-items-center">
        <Col md={6}>
          <div className="search-box">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  fetchSubjects(currentUrl);
                } else {
                  handleSearch(e.target.value);
                }
              }}
            />
            <FaSearch className="search-icon" />
          </div>
        </Col>
        <Col md={6}>
          <div className="button-position">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setShowModal(true)}
            >
              Add subject +
            </button>
          </div>
        </Col>
      </Row>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {!loading && subjects && subjects.length > 0 && (
        <div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "5%" }}>
                    #
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Subject
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    No. of questions
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    No. of exams
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={subject.id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{subject.subject_name}</td>
                    <td>{subject.question_count}</td>
                    <td>{subject.exam_count}</td>
                    <td style={{ width: "5%" }}>
                    
                      <button
                        type="button"
                        className="btn btn-outline-primary button-width"  
                        onClick={() => setShowCreateQuestionModal(true)}
                      >
                        Add Questions +
                      </button>
                      
                    </td>
                    

                    <td style={{ width: "10%" }}>
                      <FaTrash
                        size={20}
                        color="red"
                        data-testid={`delete${index+1}`}
                        onClick={() => handleDelete(subject.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-container text-center">
            <ul className="pagination">
              <li
                className={`page-item ${
                  previousLink === currentUrl ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    handlePagination(previousLink, currentPage - 1)
                  }
                  disabled={previousLink === currentUrl}
                >
                  Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    totalPages === 1 || currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                   type="button"
                    className="page-link"
                    onClick={() =>
                      handlePagination(
                        `/examate/subjects/list/?page=${index + 1}`,
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
                <li className={`page-item ${nextLink ? "" : "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => handlePagination(nextLink, currentPage + 1)}
                  disabled={!nextLink}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {!loading && (!subjects || subjects.length === 0) && (
        <div className="text-center py-4">
          <p style={{ color: "red" }}>No subjects found.</p>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Add Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter subject name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddSubject}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={false} />
      <CreateQuestion
        show={showCreateQuestionModal}
        onHide={() => setShowCreateQuestionModal(false)}
        data={subjects.id}
      />
    </div>
  );
};
export default AddSubject;
