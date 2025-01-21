"use client"
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { useRouter ,useSearchParams} from "next/navigation"
import {  Modal,Button } from "react-bootstrap";
import "./payment.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buyTicket } from '@/services/ApiServices';
import { handleErrorResponse } from '@/middlewares/errorhandling';
import { useTicketStatus } from '@/context/ticketStatusContext';

const Payment = () => {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams()
  const {updateTicketStatusCount} = useTicketStatus()


  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const onSubmit = (data) => {
    setShowModal(true);
  };
  const handleExpiryChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, ''); // Remove non-numeric characters
    value = value.replace(/^(\d{2})/, '$1/'); // Add "/" after the first two characters
    value = value.slice(0, 7); // Limit the length to 7 characters (MM/YYYY format)
    e.target.value = value; // Update the input value
  };

  const validateCardholderName = (value) => {
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return 'Cardholder Name must contain only letters';
    }
    return null;
  };

  const validateCardNumber = (value) => {
    if (!/^\d{16}$/.test(value)) {
      return 'Card Number must be a 16-digit number';
    }
    return null;
  };

  const validateExpiry = (value) => {

    // Split the value into month and year
    const [month, year] = value.split('/');

    // Check if both month and year are present
    if (!month || !year) {
      return 'Expiry date must contain both month and year';
    }

    // Convert month and year to integers
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);

    // Check if month is between 1 and 12
    if (expiryMonth < 1 || expiryMonth > 12) {
      return 'Invalid month';
    }

    // Check if year is valid 
    const currentYear = new Date().getFullYear();
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < (new Date().getMonth() + 1))) {
      return 'Expiry date must be in the future';
    }

    return null;
  };
  
  const validateCVV = (value) => {
    if (!/^\d{3}$/.test(value)) {
      return 'CVV must be a 3-digit number';
    }
    return null;
  };
  const handleHistory = ()=>{
    try{
        const ticket_count = searchParams.get('ticketCount') // Get the ticketCount from the query parameters
        if (ticket_count) {
          const response = buyTicket(ticket_count);
          console.log(response)
          updateTicketStatusCount()

        }
        router.push(`history`);
      }
    catch (error) {
        handleErrorResponse(error)
      }
}
  return (
    <div className="container p-0" >
      <div className="card px-4" >
        <p className="h8 py-3">Payment Details</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row gx-3">
            <div className="col-12">
              <div className="d-flex flex-column">
                <input data-testid='holder' {...register("cardholderName", { required: "Cardholder Name is required", validate: validateCardholderName })} className="form-control mb-3" type="text" placeholder="Cardholder Name" />
                {errors.cardholderName && <p className="text-danger">{errors.cardholderName.message}</p>}
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex flex-column">
                <input data-testid='card'  type="text" {...register("cardNumber", { required: "Card Number is required", validate: validateCardNumber })} className="form-control mb-3"  placeholder="Card Number"  />
                {errors.cardNumber && <p className="text-danger">{errors.cardNumber.message}</p>}
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-column">
                <label htmlFor="expiry date" className="form-label">Expiry</label>
                <input data-testid='expiry' type="text"{...register("expiry", { required: "Expiry date is required", validate: validateExpiry })} className="form-control mb-3"  placeholder="MM/YYYY"  onChange={handleExpiryChange}/>
                {errors.expiry && <p className="text-danger">{errors.expiry.message}</p>}
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-column">
                <label htmlFor="cvv" className="form-label">CVV</label>
                <input data-testid='cvv' {...register("cvv", { required: "CVV is required", validate: validateCVV })} className="form-control mb-3 pt-2 " type="password" placeholder="***" />
                {errors.cvv && <p className="text-danger">{errors.cvv.message}</p>}
              </div>
            </div>
            <div className="col-12">
              <button data-testid='pay' type="submit"  className="btn btn-primary mb-3">Pay</button>
            </div>
          </div>
        </form>
      </div>
     
      <Modal data-testid='modal' className="modal" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header className="custom-header">
          <Modal.Title> Payment Successful</Modal.Title>
        </Modal.Header>
          <Modal.Body >
            <div className="text-center">
            <img src='/images/payment.png' alt='payment' width='50%' />
            </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button  data-testid='modal ok' variant="success" onClick={handleHistory}>
                 OK
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-right" autoClose={false} />
    </div>
  );
};

export default Payment;
