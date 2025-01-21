"use client"
import OtpForm from '@/components/OtpForm/OtpForm'
import { requireEmailAuthentication } from '@/middlewares/authmiddleware'

import React from 'react'


const page = () => {
  return (
   <OtpForm/>
  )
}

export default requireEmailAuthentication(page)

