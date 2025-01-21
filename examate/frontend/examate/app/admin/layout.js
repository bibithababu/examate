"use client";
import { Inter } from "next/font/google";

import "../globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "./admin.css";
import "font-awesome/css/font-awesome.min.css";
import PropTypes from "prop-types";
import ExamateLayout from "@/components/rootLayout/rootLayout";
import { TicketStatusProvider } from "@/context/ticketStatusContext";



const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => {

  const dashboardContent = [
    {
      label: "Dashboard",
      link: "/admin",
      icon: "fa fa-user-circle",
    },
    {
      label: "Add subjects",
      link: "/admin/addsubject",
      icon: "fa fa-pencil-square-o",
    },
    { label: "Organizations", link: "/admin/consumers", icon: "fa fa-user" },
    {
      label: "Questions",
      link: "/admin/question-list",
      icon: "fa fa-list-alt",
    },
    {
      label: "Tickets",
      link: "/admin/ticket-request",
      icon: "fa fa-list-alt",
    },
  ];



  return (
    // <AdminProtectedRoute>
 <TicketStatusProvider>
    <ExamateLayout dashboardContent={dashboardContent}>
      {children}
      </ExamateLayout>
      </TicketStatusProvider>
    
  );
};

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;
