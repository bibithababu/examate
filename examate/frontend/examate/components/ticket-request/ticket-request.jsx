"use client"
import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import "./ticket-request.css"
import { Col,Row } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";
import { ticketRequestlist,ticketApprove,deleteTicketRequest } from '@/services/ApiServices';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import TableLoader from '../TableLoader/table-loader';

const TicketRequest = () => {
    const [ticketList, setTicketList] = useState([]);
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [loading,setLoading]= useState(<TableLoader/>);
    

    const handleOnLoadMore = () => {
        setPage((prev) => prev + 1);
      };
    const fetchTicketList = async () => {
        setLoading(<TableLoader/>);
        try {
            const response = await ticketRequestlist(page);
            console.log("response ",response)
            const results = response?.data?.results;
            setLoading(response?.data?.next===null?<p className="text-danger">No more requests found</p>:<button className="btn btn-light" data-testid="load-more-button" onClick={handleOnLoadMore}>Load more...</button>)
            if (results) {
                setTicketList(prev => [...prev, ...results]);
            } else {
                console.error('Invalid response format:', response);
            }
     } catch (error) {
            console.error('Error fetching ticket list:', error);
        }
    };

    useEffect(() => {
        fetchTicketList();
    }, [page]); 


    
    const handleApproveButton = async (ticket) => {
        try{
            const data = {
                ticket_ids: ticket.tickets,
                updatedStatus: 1, 
            };
            const response = await ticketApprove(data);
            console.log(response)
            toast.success("Ticket request approved", { autoClose: 2000 });
            const approvedTicket = ticket
            setTicketList(prevList => {
                return prevList.filter(ticket => ticket !== approvedTicket);
            });
        }
        catch(error)
        {
            console.log(error)
        }
    }
    
    const handleDeleteButton = async (ticket) =>{
        try{
            const data = {
                ticket_ids: ticket.tickets,
                updatedStatus: 5, 
            };
            const response = await deleteTicketRequest(data);
            console.log(response)
            toast.success("Ticket request rejected", { autoClose: 2000 });
            const deletedTicket = ticket
            setTicketList(prevList => {
                return prevList.filter(ticket => ticket !== deletedTicket);
            });
        }
        catch(error)
        {
            console.log(error)
        }
    }
    const handleButtonClick = () => {
        router.push('/admin/ticket-history');
    };
    
console.log("loading : ",loading)
    return (
        <div>
           <ToastContainer/>
           <Row className="d-flex justify-content-around">
            <Col>
            <h2 className="main-heading">Ticket requests</h2>  
            </Col>
            <Col className="d-flex justify-content-end">
            <button type="button" className="btn btn-link" onClick={handleButtonClick}>View history</button> 
            </Col>
            </Row>          
            <Stack gap={3}>
                {ticketList?.map(ticket => (
                    <Card key={ticket.id} className='request-card' border='primary' body>
                        <Row className="justify-content-md-center">
                            <Col xs="12" sm="8" md="8" lg="8" xl="8" xxl="10">
                                <h5>{ticket.organisation} has requested {ticket.count} ticket</h5>
                            </Col>
                            <Col xs="10" md="2" lg="2" xl="2" xxl="1">
                                <button className="btn btn-success" onClick={()=>handleApproveButton(ticket)}>APPROVE</button>
                            </Col>
                            <Col xs="2" md="2" lg="2" xl="2" xxl="1">
                                <button className='btn btn-light' data-testid="reject-button" onClick={()=>handleDeleteButton(ticket)}>
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="1 1 20 20" fill="none" stroke="#ff0000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                        </svg>
                                    </span>
                                </button>
                            </Col>
                        </Row>
                    </Card>
                ))}
                 <div className='d-flex justify-content-center'>
           {loading}
          </div>
            </Stack>
        </div>
    );
}


export default TicketRequest;