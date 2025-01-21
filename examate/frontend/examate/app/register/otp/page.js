"use client"
import OtpForm from '@/components/OtpForm/OtpForm'
import { requireRegisterTokenAuthentication } from '@/middlewares/authmiddleware'
import React from 'react'


const page = () => {
  return (
    <OtpForm />
  )
}

export default requireRegisterTokenAuthentication(page)
