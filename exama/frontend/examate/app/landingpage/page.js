"use client";
import React from "react";
import "./landingpage.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ContactDetails from "@/components/contacts/contactdetails";


export default function LandingPage() {
  return (
    <div style={{ overflow:'auto' }}>
      <main>
        <Header />

        <main className="benefits-container">
          <ContactDetails />
        </main>

        <Footer />
      </main>
    </div>
  );
}
