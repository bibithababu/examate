"use client"

import CheckoutForm from '@/components/paymentdetails/paymentdetails'
import React from 'react'

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";




const page = () => {
  const stripePromise = loadStripe("pk_test_51P7846SEIva9P6yJeYIk7Nm6joBzoJ1Ms4kKhXnUsZjjK6f1oTyrjg8QE3ci0tW3n6inTfeSZ2WhmMuaeZgq9xeu00zTDRBZcn");
  console.log(process.env.NEXT_STRIPE_SECRET_KEY)
    return (
     
      <Elements stripe={stripePromise}>
<CheckoutForm/>
</Elements>

  )}
  
export default page