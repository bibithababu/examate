import React,{useState,useEffect} from 'react';
import { ticketHistory } from '@/services/ApiServices';
import "./ticket-request.css";
import { FaAngleLeft,FaAngleRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const TicketHistory = () => {
    const [ticketList,setTicketList] = useState();
    const [searchParam,setSearchParam]= useState();
    const [sortParam,setSortParam] = useState();
    const [page,setPage] = useState(1);
    const [totolPages,setTotalPages] = useState()
    const router = useRouter();

    const fetchTicketHistory = async () => {
        try {
            const response = await ticketHistory(searchParam,sortParam,page) // Replace 'ticketHistory' with your actual API endpoint
            setTicketList(response.data.results)
            setTotalPages(response.data.total_pages) // Assuming your API returns the data directly
        } catch (error) {
            console.error('Error fetching ticket history:', error);
            return null; // Handle errors gracefully, return null or throw an error as needed
        }
    };
        useEffect(() => {
            fetchTicketHistory();
        }, [searchParam,sortParam,page]); 

        const handleInputChange = (e) => {
            setPage(1)
            setSearchParam(e.target.value);  
          };
          const handlepagination = (e) => {
            console.log("inside pagination : ",e)
            setPage(e.target.value);
          };
          const handleButtonClick = () => {
            router.push('/admin/ticket-request');
        };    
    return (
        <div>
            <div className="row d-flex justify-content-between">
                <div className='col-sm-12 col-md-6'>
            <h2 className="main-heading">Tickets history</h2>
            <button type="button" className="btn btn-link" onClick={handleButtonClick} >View Requests</button> 
            </div>
            
            <div className="col-sm-12 col-md-6 d-sm-flex p-2 bd-highlight flex-row-reverse bd-highlight align-items-end">
            <div className="search-box "> {/* Add col-12 class here */}

    <input type="text" 
    className="form-control" 
    placeholder="Search organisation..." 
    onChange={handleInputChange}
    aria-describedby="filter-button" />

  </div>
  </div>
  </div>
            <div className="table-responsive">
            <table className="table table-bordered align-middle">
    <thead>
        <tr className="table-primary">
            <th onClick={() => setSortParam('-id')}>Ticket ID</th>
            <th onClick={() => setSortParam('created_at')}>Created At</th>
            <th>Organisation</th>                    
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        {ticketList && ticketList.length > 0 ? (
            // Render table rows if ticketList is not empty
            ticketList.map(ticket => (
                <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.created_at}</td>
                    <td>{ticket.organisation}</td>                           
                    <td>{ticket.status}</td>
                </tr>
            ))
        ) : (
            // Render "No data found" message if ticketList is empty
            <tr>
                <td colSpan="5" className="text-center">No data found</td>
            </tr>
        )}
    </tbody>
</table>
            </div>
            <div className='d-flex justify-content-end d-grid gap-2'>
            <p className="fw-normal">page</p>
            <select className="form-select form-select-sm " data-testid='select-box' value={page} onChange={handlepagination} style={{ width: '90px', height: '40px' }} aria-label="Default select example">

  {[...Array(totolPages).keys()].map((page) => (
    <option key={page + 1} value={page + 1}>{page + 1}</option>
  ))}
</select>
<p className="fw-normal">of {totolPages}</p>
            <button type="button" data-testid='prev-button' disabled={page===1} onClick={()=>setPage(page-1)} className="btn btn-outline-secondary btn-sm"><FaAngleLeft /> </button>
            <button type="button" data-testid='next-button' disabled={page===totolPages} onClick={()=>setPage(page+1)} className="btn btn-outline-secondary btn-sm"><FaAngleRight/> </button>
            </div>
        </div>
    );
};

export default TicketHistory;
