"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import {
deleteUserAccount,
fetchConsumersDetails,

searchbyName,
switchUserAccountStatus } from
"@/services/ApiServices";
import SearchBox from "../Searchbox/SearchBox";
import "./consumerlist.css";
import { handleErrorResponse } from "@/middlewares/errorhandling";
import Pagination from "../pagination/Pagination";
import { useReceiver } from "@/context/receiverContext";
import { useRouter } from "next/navigation";
import { useConsumer } from "@/context/consumerDetailsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Badge from 'react-bootstrap/Badge';
import { useMessageStatus } from "@/context/messageStatusContext";


function ConsumersList() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState({
    nextLink: "",
    previousLink: "" });


  const [sortingVariables, setSortingVariables] = useState({
    username: "asc",
    email: "asc",
    address: "asc" });


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUsersEmpty, setIsUsersEmpty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [noUser, setNoUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { setClientValue } = useReceiver();
  const { setConsumerDetails, setAdminDetails} = useConsumer();
  const { unRead } = useMessageStatus();

  const router = useRouter();


  const ORGANIZATION_USERS_ENDPOINT = "/examate/organization/users";
  const ORGANIZATION_SEARCH_ENDPOINT = "/examate/organization/searchuser";

  const fetchData = async (url, sortingParams) => {
    try {

      const response = await fetchConsumersDetails(url, sortingParams);
      setUsers(response.data.results);

      setOriginalUsers(response.data.results);
      setPaginationLinks({
        nextLink: response.data.next,
        previousLink: response.data.previous });

      setTotalPages(response.data.total_pages);


      if (response.data.results.length === 0) {
        setIsUsersEmpty(true);
      }

    } catch (error) {

      handleErrorResponse(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    const sortingParams = {
      sort_by: sortBy,
      ascending: sortOrder === "asc" };

    fetchData(ORGANIZATION_USERS_ENDPOINT, sortingParams);


  }, [unRead]);

  useEffect(() => {

  }, [currentPage]);

  const updatingUser = (id) => {
    const updatedUser = users.map((user) =>
    user.id === id ? { ...user, status: user.status === 0 ? 1 : 0 } : user);

    setUsers(updatedUser);
  };

  const changeUserStatus = async () => {
    setShowChangeStatusModal(false);
    updatingUser(updateUserId);
    try {
      const response = await switchUserAccountStatus(updateUserId);
      toast.success(response.data.message, { autoClose: 2000 });
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleFetchData = async () => {
    const sortingParams = {
      sort_by: sortBy,
      ascending: sortOrder === "asc" };

    await fetchData(ORGANIZATION_USERS_ENDPOINT, sortingParams);
  };


  const handleSearchApi = async (name) => {
    try {
      const response = await searchbyName(`${ORGANIZATION_SEARCH_ENDPOINT}/?search=${name}`);
      setSearchTerm(name);
      setUsers(response.data.results);
      if (response.data.results.length === 0) {
        setNoUser(true);
      } else {
        setNoUser(false);
      }

      setPaginationLinks({
        nextLink: response.data.next,
        previousLink: response.data.previous });

      setTotalPages(response.data.total_pages);



    } catch (error) {
      handleErrorResponse(error);
    }
  };


  const handlePagination = async (url, page) => {
    const sortingParams = {
      sort_by: sortBy,
      ascending: sortOrder === "asc" };


    fetchData(url, sortingParams);
    setCurrentPage(page);
  };

  const handleUserAccountDelete = async (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const handleUserStatus = async (id) => {
    setUpdateUserId(id);
    setShowChangeStatusModal(true);
  };

  const handleCloseUserStatusModal = () => {
    setUpdateUserId(null);
    setShowChangeStatusModal(false);
  };

  const handleConfirmDelete = async () => {

    try {
      const response = await deleteUserAccount(deleteUserId);
      setShowDeleteModal(false);

      if (users.length === 1 && currentPage === 1) {
        setIsUsersEmpty(true);
      }
      if (users.length === 1) {
        await fetchData(
        `${ORGANIZATION_USERS_ENDPOINT}?page=${currentPage - 1}&ascending=${sortOrder === "asc"
        }&sort_by=${sortBy}`);


      } else {
        await fetchData(
        `${ORGANIZATION_USERS_ENDPOINT}?page=${currentPage}&ascending=${sortOrder === "asc"
        }&sort_by=${sortBy}`);

      }

      toast.success(response.data.message, { autoClose: 2000 });
      if (users.length === 1 && paginationLinks.previousLink) {
        handlePagination(paginationLinks.previousLink, currentPage - 1);
      } else if (currentPage > 1 && !paginationLinks.previousLink) {
        handlePagination(`${ORGANIZATION_USERS_ENDPOINT}?page=${currentPage - 1}`, currentPage - 1);
      }

    } catch (error) {
      toast.error(error.response.data.message, { autoClose: 2000 });
    }
  };
  const fetchDataByPage = async (pageNumber) => {
    const sortingParams = {
      sort_by: sortBy,
      ascending: sortOrder === "asc" };

    if (searchTerm == "") {
      await fetchData(`${ORGANIZATION_USERS_ENDPOINT}?page=${pageNumber}`, sortingParams);
    } else {
      const response = await searchbyName(`${ORGANIZATION_SEARCH_ENDPOINT}/?search=${searchTerm}&page=${pageNumber}`);
      setUsers(response.data.results);
      if (response.data.results === 0) {
        setNoUser(true);
      } else {
        setNoUser(false);
      }

      setPaginationLinks({
        nextLink: response.data.next,
        previousLink: response.data.previous });

      setTotalPages(response.data.total_pages);
    }

    setCurrentPage(pageNumber);
  };


  const handleCloseDeleteModal = () => {
    setDeleteUserId(null);
    setShowDeleteModal(false);
  };

  const handleSort = (sortingVariable) => {
    const newSortOrder = sortingVariables[sortingVariable] === "asc" ? "desc" : "asc";
    setSortBy(sortingVariable);
    setSortOrder(newSortOrder);

    setSortingVariables((prevSortVariables) => ({
      ...prevSortVariables,
      [sortingVariable]: newSortOrder }));


    const sortingParams = {
      sort_by: sortingVariable,
      ascending: newSortOrder === "asc" };

    fetchData(`${ORGANIZATION_USERS_ENDPOINT}?page=${currentPage}`, sortingParams);
  };

  const handleChat = (id, username, profileImage) => {
    console.log("Set Receiver id as", id);
    console.log("profile image of user", profileImage);


    const localStorage = window?.localStorage ?? null;


    if (localStorage) {
     


      if (!localStorage.getItem('admin')) {
        try {
          setAdminDetails();
        } catch (error) {
          handleErrorResponse(error);
        }
      }
    }

    setClientValue(id);
    setConsumerDetails(username, profileImage);
    router.push('/admin/chatroom');
  };





  let tableContent;
  if (loading) {
    tableContent =
    <tr>
        <td colSpan="7" className="text-center">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </td>
      </tr>;

  } else if (isUsersEmpty) {
    tableContent =
    <tr>
        <td colSpan="7" className="text-center text-danger ">
          No organizations are registered
        </td>
      </tr>;

  } else if (noUser) {
    tableContent =
    <tr>
        <td colSpan="7" className="text-center text-danger" data-testid="no-user-found">
          No User Found
        </td>
      </tr>;

  } else {
    tableContent = users.
    filter((user) => user.is_register === 1).
    map((user, index) =>
    <tr key={user.id}>
          <th scope="row">{index + 1}</th>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td className={user.address ? "inherit table-cell-address" : "text-danger not-wrapped "}>{user.address ? user.address : "Not Provided"}</td>
          <td className={user.contact_number ? "inherit" : "text-danger not-wrapped "}>{user.contact_number ? user.contact_number : "Not Provided"}</td>
     
      <td style={{ position: "relative" }}>
                 <div
               onClick={user.status === 1 ? () => handleChat(user.id, user.username, user.profile_image) : null}
                style={{ position: 'relative', cursor: user.status===1?'pointer':"not-allowed", display: 'inline-block' }}
              >
                <FontAwesomeIcon icon={faComment} style={{ color: 'blue', fontSize: '1.5rem', marginTop: '2px' }} />
                <Badge bg="danger" style={{ position: 'absolute', bottom: '0.1rem', left: '1.2rem', fontSize: '0.5rem' }}>
                  {user.unread_messages_count}
                </Badge>
              </div>
              </td>


          {}



          <td>
            <Button
        variant={user.status === 0 ? "success" : "danger"}
        onClick={() => handleUserStatus(user.id)}>

              {user.status === 0 ? "Unblock" : "Block"}
            </Button>
          </td>

          <td>
            <FaTrash
        name="Delete"
        className="trash-icon"
        style={{ color: "red" }}
        data-testid={`delete${index + 1}`}
        onClick={() => handleUserAccountDelete(user.id)} />

          </td>
        </tr>);

  }

  return (

    <>
      <div>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="main-heading">Organization list</h2>
          </Col>

          <Col md={6} sm={12} className="mt-3 mt-md-5">
            <SearchBox
            search={search}
            setSearch={setSearch}
            setNoUser={setNoUser}
            users={users}
            setUsers={setUsers}
            originalUsers={originalUsers}
            handleSearchApi={handleSearchApi}
            setSearchTerm={setSearchTerm}
            handleFetchData={handleFetchData}
            style={{ marginTop: "20px" }} />

          </Col>
        </Row>


      </div>
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sl.No</th>
              <th scope="col" className="d-flex align-items-center">
                <span>Name</span>
                <MdFilterList
                data-testid="name-filter"
                className="filter-icon ml-auto"
                onClick={() => handleSort("username")} />

              </th>
              <th scope="col">
                <span>Email</span>
                <MdFilterList
                data-testid="email-filter"
                className="filter-icon ml-auto"
                onClick={() => handleSort("email")} />

              </th>
              <th scope="col" className="d-flex align-items-center">
                <span>Address</span>
                <MdFilterList
                data-testid="address-filter"
                className="filter-icon ml-auto "
                onClick={() => handleSort("address")} />

              </th>
              <th scope="col">Contact</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>


          <tbody>
            {tableContent}
          </tbody>
        </table>


      </div>

      <div className=" mt-3">
        {noUser ? null :
        <div className="pagination-item">
            <Pagination

          currentPage={currentPage}
          totalCount={totalPages}
          pageSize={1}
          setCurrentPage={setCurrentPage}
          onPageChange={fetchDataByPage} />

          </div>}

      </div>



      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showChangeStatusModal} onHide={handleCloseUserStatusModal} data-testid="user-status-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Updation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserStatusModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={changeUserStatus}>
            Confirm Updation
          </Button>
        </Modal.Footer>
      </Modal>
    

    </>);


}

export default ConsumersList;
