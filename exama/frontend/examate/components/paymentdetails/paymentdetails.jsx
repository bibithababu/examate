import React, { useState, useEffect } from "react";
import { useStripe, useElements,CardElement, } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useRouter ,useSearchParams} from "next/navigation"
import { PaymentCheckout,PaymentConfirmation,buyTicket } from "@/services/ApiServices";
import './paymentdetails.css';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { handleErrorResponse } from '@/middlewares/errorhandling';
import { useTicketStatus } from '@/context/ticketStatusContext';


const CheckoutForm = () => {
    const [clientSecret, setClientSecret] = useState("");
    const { register, handleSubmit, formState: { errors },reset} = useForm();
    const [ticketId, setTicketId] = useState(null);
    const [paymentId,setPaymentId]=useState(null)
    const [customerName, setCustomerName] = useState("");
    const {updateTicketStatusCount} = useTicketStatus()
  
    const stripe = useStripe();
    const elements = useElements();
    const router=useRouter();

    const searchParams = useSearchParams()
    const ticketCount = searchParams.get('ticketCount');
    const totalPayment=ticketCount*100;
    const validateCardholderName = (value) => {
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          return 'Cardholder Name must contain only letters';
        }
        return null;
      };
    

    useEffect(() => {
        createPaymentIntent();
    }, []);

    const createPaymentIntent = async () => {
        try {
            const response = await PaymentCheckout(ticketCount);
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            console.error("Error creating payment intent:", error);
        }
    };


    const handleHistory = async ()=>{
        try{
           
            const ticket_count = searchParams.get('ticketCount') 
            if (ticket_count) {
               
              const response = await buyTicket(ticket_count);              
              setTicketId(response.data.ticket_id);
              updateTicketStatusCount()
                              
            }
           
          }
        catch (error) {
            handleErrorResponse(error)
          }
    }

    const onSubmit = async (data) => {
        
        if (!stripe || !elements) {
           
            return;
        }
       
        
        const result = await stripe.confirmCardPayment(clientSecret, {
            
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name:data.cardholderName,
                    address:{
                        "city":data.city,
                        "country":"US",
                        "line1":data.addressLine,
                        "state":data.state
                    },
                },
            }
        });
        if (result.error) {
            toast.error(result.error.message)
           
            setPaymentId(result.error.payment_intent.id)
            
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                toast.success("payment successfull") 
              await handleHistory()
              setTimeout(()=>{
                router.push(`history`);

              },2000)

             
                
                setPaymentId(result.paymentIntent.id)
             
                setCustomerName(data.cardholderName)              
                            
            }
            else{
                toast.error("payment not successfull")
            }
        }
        
        reset();        
        }

        const handleCardConfirmPayment = async(payment_id,paymentstatus) => {
                     
            try {
              
                const payment_inputs = {
                    payment_method:'card',ticket_id:ticketId,
                    amount:totalPayment,payment_id:payment_id,
                    user:customerName
                             
                }            
                await PaymentConfirmation(payment_inputs);
               
            } catch (error) {
               
                toast.error("Unable to retrieve the payment data.");
                        
            }
        };

        useEffect(() => {
            if(paymentId!=null){
            handleCardConfirmPayment(paymentId);
            }
        }, [paymentId]);
     
    return (    
        <div className="container p-0 " style={{width:'40rem'}} >
            <ToastContainer/>
        <div className="card px-4" >
            
          <p style={{textAlign:'center',fontFamily:'serif',color:'#0d6efd',fontSize:'20px',marginTop:'1rem'}}>Payment Details</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row gx-3">
              <div className="col-12">
              <div className="input-container">
  <input placeholder="Enter Name" {...register("cardholderName", { required: "Cardholder Name is required", validate: validateCardholderName })} className="input-field" type="text"/>
  <label htmlFor="input-field" className="input-label">Name</label>
  <span className="input-highlight"></span>
 
</div><div className="m-3">
{errors.cardholderName && <p className="error-message">{errors.cardholderName.message}</p>}</div>
                
              </div>
              <div className="col-12">
              <div className="input-container">
  <input placeholder="Enter Address" {...register("addressLine", { required: "Address Line is required" })} className="input-field" type="text"/>
  <label htmlFor="input-field" className="input-label">Address Line</label>
  <span className="input-highlight"></span>
  
</div><div className="m-3">{errors.addressLine && <p className="error-message">{errors.addressLine.message}</p>}</div>
                
              </div>
           
              <div className="col-6">
              <div className="input-container">
  <input placeholder="Enter State"  {...register("state", { required: "State is required" })} className="input-field" type="text"/>
  <label htmlFor="input-field" className="input-label">State</label>
  <span className="input-highlight"></span>
</div><div className="m-3">
  {errors.state && <p className="error-message">{errors.state.message}</p>}</div>
                
              </div>
              <div className="col-6">
              <div className="input-container">
  <input placeholder="Enter City" {...register("city", { required: "City is required" })} className="input-field" type="text"/>
  <label htmlFor="input-field" className="input-label">City</label>
  <span className="input-highlight"></span>
</div>
<div className="m-3">
  {errors.city && <p className="error-message">{errors.city.message}</p>}</div>
                
              </div>
              <div className="col-9"style={{marginLeft:"1rem",marginTop:"2rem"}}>
              <CardElement /></div>
              <div className="col-12 d-flex justify-content-center " style={{marginTop:"2rem"}}>
                <button data-testid='pay' type="submit"  className="btn btn-primary mb-3" style={{width:'8rem',alignItems:'right'}}>Pay ${totalPayment}</button>
              </div>
            </div>
          </form>
          
        </div>
        </div>
        
    )
};


export default CheckoutForm;

