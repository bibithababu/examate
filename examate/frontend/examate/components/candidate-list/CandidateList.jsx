import React, { useState, useEffect } from "react";
import "../Consumer/Examlist/exam-list.css";
import "./candidate-list.css";
import AddCandidate from "./addcandidate";
import TableLoader from "../TableLoader/table-loader";
import { Pagination,Row } from "react-bootstrap";

import {
  candidateListing,
  candidateInvite,
  candidateList,
  CandidateDelete,
} from "@/services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CandidateList = ({examid}) => {
  const CANDIDATE_LIST_ENDPOINT = `examatecandidates/candidateslist/${examid}/`;
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const pagination = {
    nextLink: "",
    previousLink: "",
    currentLink: "",
  };
  const [paginationLinks, setPaginationLinks] = useState(pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [sortingParams, setSortingParams] = useState("");
  const [isloading, setIsloading] = useState();
  const [pageSize, setPageSize] = useState();
  const invitestatus = { 0: "invite", 1: "resend" };


  useEffect(() => {
    // Simulate fetching candidate data from the backend
    fetchCandidates(CANDIDATE_LIST_ENDPOINT);
  }, [searchParam, sortingParams]);

  const fetchCandidates = async (url) => {
   
    try {
      const response = await candidateListing(url, searchParam, sortingParams);
      setPaginationLinks({
        nextLink: response.data.next,
        previousLink: response.data.previous,
        currentLink: url,
      });
      setTotalPages(response.data.total_pages);
      setCandidates(response.data.results);
      setPageSize(response.data.page_size);
      setNoofcandidates(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvite = async (candidateId) => {
   
    setIsloading(candidateId);
    const data = { candidateId: [candidateId], examid };

    try {
      await candidateInvite(data);
      fetchCandidates(paginationLinks.currentLink);
    } catch (error) {
      console.log("in handle invite", error);
    } finally {
      setIsloading(null);
    }

    // Simulate an invitation by updating the invited status
    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, invited: true } : candidate
    );

    setCandidates(updatedCandidates);
  };

  const handledelete = async (id) => {

    try {
      await CandidateDelete(
        `/examatecandidates/candidates/delete/${id}/`
      );
      if (candidates.length == 1) {
        fetchCandidates(paginationLinks.previousLink);
        setCurrentPage(currentPage - 1);
      } else {
        fetchCandidates(paginationLinks.currentLink);
      }
      toast.info("candidate has been deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddCandidate = () => {
    console.log("handle");
    setShowModal(true);
  };
  const handlePagination = async (url, page) => {
    fetchCandidates(url);
    setCurrentPage(page);
  };
  const handleSearch = (key) => {
    console.log("search", key);
    setSearchParam(key);
  };
  const handleSort = (key) => {
    const newKey = sortingParams === key ? `-${key}` : key;
    setSortingParams(newKey);
    setCurrentPage(1);
  };
  let active = currentPage;
  let items = [3];
  console.log(items)
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }

  const handleInviteAll = async (examid) => {
    setIsloading(true);
    try {
      const response = await candidateList(examid);
      const candidates = response.data.results;

      const candidateIds = candidates.map((candidate) => candidate.id);
      await sendInvitationEmail(candidateIds, examid);

      fetchCandidates(CANDIDATE_LIST_ENDPOINT);
    } catch (error) {
      console.log("errror in invite all", error.status);
    } finally {
      setIsloading(false);
    }
  };
  const sendInvitationEmail = async (candidateIds, examid) => {
    const data = {
      candidateId: candidateIds,
      examid: examid,
    };

    try {
      const response = await candidateInvite(data);
      console.log(
        "Invitation emails sent successfully to all candidates",
        response.status
      );
    } catch (error) {
      if (error.response.status == 400);
      toast.info("No more candiadate to invite");
    }
  };

  return (
    <Row className="row">
    <div className="container  " style={{ width: "90%" }}>
      <ToastContainer />
      <div className="row align-items-center gy-3" style={{ marginTop: "50px" }}>
        <div className="col-md-6">
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search"
              type="search"
              className="input"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          {isloading === true ? (
            <div className="inviteloader">
              <div className="box-load1"></div>
              <div className="box-load2"></div>
              <div className="box-load3"></div>
            </div>
          ) : (
            <div>
              {/* {candidate.status===0?( */}
              <button
                className="invite"
                data-testid="invitebutton"
                onClick={() => handleInviteAll(examid)}
              >
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Invite all</span>
              </button>
            </div>
          )}
        </div>
        <div className="col-md-3 px-3">
          <button
            type="button"
            data-testid="add-candidate-button"
            className="btn btn-success"
            onClick={() => handleAddCandidate()}
          >
            <span className="button__text">ADD CANDIDATES</span>

          </button>
        </div>
      </div>
      {candidates ? (
        <div>
          {" "}
          <table className="table" style={{ marginTop: "2%" }}>
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th
                  style={{ width: "50%" }}
                  onClick={() => handleSort("email")}
                >
                  Email
                </th>
                <th
                  style={{ width: "15%" }}
                  onClick={() => handleSort("status")}
                >
                  Invitation Status
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td style={{ width: "1%" }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td style={{ width: "10%" }}>{candidate.email}</td>
                  <td style={{ width: "1%" }}>
                    {isloading === candidate.id ? (
                      <div className="inviteloader">
                        <div className="box-load1"></div>
                        <div className="box-load2"></div>
                        <div className="box-load3"></div>
                      </div>
                    ) : (
                      <div>
                        {/* {candidate.status===0?( */}
                        <button
                          className="invite"
                          data-testid={`invitebutton${candidate.id}`}
                          onClick={() => handleInvite(candidate.id)}
                        >
                          <div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                              >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                  fill="currentColor"
                                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <span>{invitestatus[candidate.status]}</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      className="deletebtn"
                      data-testid={`delete-button${candidate.id}`}
                      disabled={candidate.status === 1}
                      title={
                        candidate.status === 1
                          ? "Cannot delete invited candidate "
                          : ""
                      }
                      onClick={() => handledelete(candidate.id)}
                    >
                      <svg
                        viewBox="0 0 15 17.5"
                        height="17.5"
                        width="15"
                        xmlns="http://www.w3.org/2000/svg"
                        className="deleteicon"
                      >
                        <path
                          transform="translate(-2.5 -1.25)"
                          d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                          id="Fill"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row d-flex justify-content-center">
            <Pagination className="d-flex justify-content-center">
              <Pagination.Prev
                onClick={() =>
                  handlePagination(
                    paginationLinks.previousLink,
                    currentPage - 1
                  )
                }
                disabled={!paginationLinks.previousLink}
              >
                Prev
              </Pagination.Prev>

              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() =>
                    handlePagination(
                      `${CANDIDATE_LIST_ENDPOINT}?page=${index + 1}`,
                      index + 1
                    )
                  }
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              {totalPages > 5 && (
                <>
                  {currentPage > 3 && <Pagination.Ellipsis />}
                  {currentPage <= 3 && totalPages > 5 && (
                    <Pagination.Item disabled>...</Pagination.Item>
                  )}
                  {currentPage <= 3 && (
                    <Pagination.Item>{totalPages - 1}</Pagination.Item>
                  )}
                  {currentPage <= 3 && (
                    <Pagination.Item>{totalPages}</Pagination.Item>
                  )}
                  {currentPage <= 3 && <Pagination.Ellipsis />}
                </>
              )}

              <Pagination.Next
                onClick={() =>
                  handlePagination(paginationLinks.nextLink, currentPage + 1)
                }
                disabled={!paginationLinks.nextLink}
              >
                Next
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      ) : (
        <TableLoader />
      )}

      <AddCandidate
        show={showModal}
        exam_id={examid}
        onHide={() => handleCloseModal()}
        onAddCandidate={() => fetchCandidates(CANDIDATE_LIST_ENDPOINT)}
      />
    </div>
    </Row>
  );
};
export default CandidateList;
