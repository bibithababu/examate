"use client"
import NewPassword from '@/components/Newpassword/NewPassword'
import { requireOtpAuthentication } from '@/middlewares/authmiddleware'
import React from 'react'

const page = () => {
  return (
      <NewPassword/>
  )
}

export default requireOtpAuthentication(page)
