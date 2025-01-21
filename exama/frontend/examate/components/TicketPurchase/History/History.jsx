"use client";
import "./history.css"
import { format } from "date-fns";
import { useRouter } from "next/navigation"
import {  Modal, Button } from "react-bootstrap";
import { useState,useEffect } from "react";
import { ticketList } from "@/services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getStatusLabelTicket = (status) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Consumed";
    case 5:
      return "Rejected";
    default:
      return "Unknown Status";
  }
};
const formatTicket = (tickets) => {
  return tickets.map((ticket) => ({
    ...ticket,
    created_at: format(new Date(ticket.created_at), "dd-MMMM-yyyy"),
  }));
};


const History = ()=>{
    const [showModal, setShowModal] = useState(false);
    const [ticketCount, setTicketCount] = useState(1);
    const router = useRouter();
    const [tickets,setTickets]= useState([]);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState();
    const [loading, setLoading] = useState(true); 
    const [isToastDisplayed, setIsToastDisplayed] = useState(false);
    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await ticketList(page)
          console.log(response)
          const formatTickets=formatTicket(response.data.results);
          setPageSize(response.data.total_pages)
          setLoading(true);
          setTickets((prev) => [...prev, ...formatTickets])
        } catch (error) {
          toast.error(error);
        }
       finally {
        setLoading(false);
      }
      };
  
      fetchTickets();
    }, [page]);

  const handleIncrease = () => {
      setTicketCount(ticketCount + 1);
    };

  const handleDecrease = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };
  const handleBuyTicket = () => {
    toast.dismiss();
    router.push(`payment/?ticketCount=${ticketCount}`);
}
const handleOnLoadMore = () => {
  if (page >=pageSize)
  {
    setIsToastDisplayed(true); 
  }
  else
  {
        setPage((prev) => prev + 1);
       
  }
    };

    const handleMove=(examid)=>
{
  console.log("ticket link")
  router.push(`exam-detail?id=${examid}`)
}

    return(
      
      <div>
        <h1 className="main-heading">Ticket History</h1>
      <button className='buy-ticket-button'  data-testid="buy ticket"  onClick={() => setShowModal(true)}> Buy Ticket</button>
        
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div>
       {!loading && tickets && tickets.length > 0 && (
            <div className="custom-container">
              <div className="table-responsive">
                <table className="table">
          <thead>
            <tr>
              <th scope="col" style={{ width: "5%" }}>
                SL.No
              </th>
              <th scope="col" style={{ width: "10%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Ticket Id
                  </div>
              </th>
              <th scope="col" style={{ width: "10%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                   Ticket Type
                  </div>
              </th>
              <th scope="col" style={{ width: "10%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Purchase Date
                  </div>
              </th>
              <th scope="col" style={{ width: "10%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Exam
                  </div>
              </th>
              <th scope="col" style={{ width: "10%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Status
                  </div>
              </th>
              </tr>
            </thead>
            <tbody>
            {tickets.map((ticket, index) => (
              <tr key={1}>
                <td>{index+1}</td>
                <td>{ticket.id}</td>
                <td>{ticket.status === 2 ? "Exam Creation" : "Ticket Purchase"}</td>
                <td>{ticket.created_at}</td>
                <td><a style={{color:"blue",textDecorationLine:'underline',cursor:"pointer"}} onClick={() => handleMove(ticket.exam)}>{ticket.exam_name}</a></td>
                
                <td style={{ color: ticket.status === 0 ? "orange" : "green" }}>{getStatusLabelTicket(ticket.status)}</td>
              </tr>
            ))}
          </tbody>   
            </table>
            </div>
            <div>
            {!isToastDisplayed && (
          <button className='view-more'onClick={handleOnLoadMore}>
       View More
          </button>)}
        </div>
        </div>
        
       )}
        {!loading && (!tickets || tickets.length === 0) && (
        <div className="text-center py-4">
          <p style={{ color: "red" }}>No Transactions are done at.</p>
        </div>
      )}
        <Modal data-testid='modal' className="modal" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header className="custom-header">
          <Modal.Title>Buy Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <div>
          <button  onClick={handleDecrease}> - </button>
          <span >   {ticketCount}   </span>
          <button onClick={handleIncrease}> + </button>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button data-testid='get ticket' variant="success" onClick={handleBuyTicket}>
                Get Ticket
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      <ToastContainer position="top-right" autoClose={false} />
      </div>
    )
}
export default History;