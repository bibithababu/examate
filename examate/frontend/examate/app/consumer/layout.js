"use client";
import { Inter } from "next/font/google";
import ExamateLayout from "@/components/rootLayout/rootLayout";
import { TicketStatusProvider } from "@/context/ticketStatusContext";
import { MessageStatusProvider } from "@/context/messageStatusContext";




const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {

 
 



  const dashboardContent = [
    {
      label: "Dashboard",
      link: "/consumer/dashboard",
      icon: "fa fa-user-circle",
    },
    { label: " Exam List", link: "/consumer/examlist", icon: "fa fa-list-alt" },
    {
      label: "Pending Evaluation",
      icon: "fa fa-pencil-square-o",
      link: "/consumer/pendingevaluation-list",
    },
    {
      label: "Ticket History",
      icon: " fa fa-history",
      link: "/consumer/history",
    },
    { label: "Profile", icon: "fa fa-user" , link: "/consumer/profile",},
  ];

  return (
    // <AdminProtectedRoute>
  <TicketStatusProvider>
    <MessageStatusProvider>
    <ExamateLayout dashboardContent={dashboardContent} userType="consumer">
      {children}
      </ExamateLayout>
      </MessageStatusProvider>
      </TicketStatusProvider>
   
  );
}
