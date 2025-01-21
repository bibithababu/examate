import { useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import Badge from 'react-bootstrap/Badge';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from "next/navigation";
import { useTicketStatus } from "@/context/ticketStatusContext";
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationDropdown from "../notification-box/notification-box";
import { useConsumer } from "@/context/consumerDetailsContext";
import { useMessageStatus } from "@/context/messageStatusContext";
import { handleErrorResponse } from "@/middlewares/errorhandling";
import { useReceiver } from "@/context/receiverContext";
import { ToastContainer } from 'react-toastify';
import { viewProfile } from "@/services/ApiServices";


const Navbar = ({ isToggled, handleToggle, handleLogout, userType, notificationsCount, notifications, updateNotificationCount }) => {

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { ticketStatusCount } = useTicketStatus();
  const { unRead, resetUnReadMessagesCount } = useMessageStatus();
  const { setClientValue } = useReceiver();
  const { setConsumerDetails } = useConsumer();

  const handleModalToggle = () => {

    setShowModal(!showModal);
  };


  const navigateToTicketHistoryPage = () => {
    router.push("history");
    handleModalToggle();

  };

  const handleContactUs = async () => {

    try {
      const response = await viewProfile();

      const clientId = response.data.id;
      setClientValue(clientId);
      const username = response.data.username;
      const profileImage = response.data.profile_image;
      setConsumerDetails(username, profileImage);
      resetUnReadMessagesCount();
      router.push('/consumer/chatroom');
    } catch (error) {
      console.log("Error in navbar", error);
      handleErrorResponse(error);
    }
  };

  return (

    <>
            <nav
      className="navbar navbar-expand navbar-dark position-fixed"
      style={{ backgroundColor: "#3883ce", padding: "0px" }}>

                <div className="container-fluid">
                    <a
          href="#menu-toggle"
          id="menu-toggle"
          className="navbar-brand"
          onClick={handleToggle}>

                        <span className="navbar-toggler-icon"></span>
                    </a>
                    <button
          className="navbar-toggler"
          type="button"
          data-testid="navbar-toggle-button"
          onClick={handleToggle}>

                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
          className={`collapse navbar-collapse ${isToggled ? "show" : ""}`}
          data-testid="navbarsExample02">

                        <div className="navbar-nav me-auto">
                            <span
              className="navbar-text"
              style={{
                color: "#ffff",
                fontFamily: "serif",
                fontSize: "20px" }}>


                                EXAMATE
                            </span>
                        </div>
                        
                        <ul className="navbar-nav navbarList col-md-11 col-sm-4">
                        {userType === "consumer" &&
              <li className="navbarItem me-4" data-testId="chat-icon" onClick={handleContactUs}>
                                        <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>

                   <FontAwesomeIcon icon={faCommentAlt} style={{ color: 'white', fontSize: '1.5rem' }} />
                                        <Badge bg="danger" style={{ position: "absolute", bottom: "0.2rem", left: "0.8rem", fontSize: "0.5rem" }}>
                                                {unRead.messagesCount}
                                            </Badge>

                                        </div>

                                    </li>}
                        <li className="navbarItem me-4">
                            <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>


                        <IoNotificationsOutline onClick={updateNotificationCount} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style={{ color: "white", fontSize: "1.5rem" }} />
                        <Badge bg="danger" onClick={updateNotificationCount} style={{ position: "absolute", bottom: "0.2rem", left: "0.8rem", fontSize: "0.5rem" }}>
                                            {notificationsCount === 0 ? undefined : notificationsCount}
                                        </Badge>
                                        </div>
                        </li>
                            {userType === "consumer" &&
              <li className="navbarItem me-4">
                                    <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>


                                        <FontAwesomeIcon data-testid="wallet-icon" icon={faWallet} onClick={handleModalToggle} style={{ color: "white", fontSize: "1.5rem" }} />


                                        <Badge bg="danger" style={{ position: "absolute", bottom: "0.2rem", left: "0.8rem", fontSize: "0.5rem" }}>
                                            {ticketStatusCount.approvedCount}
                                        </Badge>
                                    </div>

                                </li>}

                         
                            <li className="navbarItem">

                                <button
                className="text"
                data-testid="logout"
                style={{
                  textAlign: "left",
                  fontSize: "14px",
                  padding: "0",
                  background: "none",
                  border: "none",
                  cursor: "pointer" }}

                onClick={handleLogout}>

                                    <RiLogoutCircleRLine />
                                    <span style={{ marginLeft: "5px" }}>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Modal show={showModal} onHide={handleModalToggle} centered>
                <Modal.Header closeButton>
                    <Modal.Title>My Wallet  <FontAwesomeIcon icon={faWallet} style={{ color: "#85BB65", fontSize: "1.5rem" }} />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-borderless text-center ">
                        <tbody>
                            <tr>
                                <th style={{ width: "100px" }} className="">Pending</th>
                                <td style={{ width: "100px" }}>

                                    <Badge bg="danger">{ticketStatusCount.requestedCount}</Badge>

                                </td>
                            </tr>
                            <tr>
                                <th>Approved</th>
                                <td style={{ width: "100px" }}>

                                    <Badge bg="warning">{ticketStatusCount.approvedCount}</Badge>

                                </td>
                            </tr>
                            <tr>
                                <th>Consumed</th>
                                <td style={{ width: "100px" }}>

                                    <Badge bg="success">{ticketStatusCount.consumedCount}</Badge>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={navigateToTicketHistoryPage}>
                        View History
                    </Button>
                </Modal.Footer>
            </Modal>
            <NotificationDropdown notificationsCount={notificationsCount} notifications={notifications} />
            <ToastContainer position="top-right" autoClose={false} />
            
        </>);



};

Navbar.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired };


export default Navbar;