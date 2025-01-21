import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import "./header.css";
import { Row, Col } from "react-bootstrap";

const Header = () => {
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="blue"
        variant="dark"
        style={{ width: "100%" }}
      >
        <Container>
          <Navbar.Brand as={Link} href="/">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontsize: "20px",
                fontFamily: "fantasy",
              }}
            >
              <img
                src="/cap2.png"
                alt="EXAMATE"
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                }}
              />
              <span style={{ marginRight: "10px" }}> EXAMATE</span>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main
        style={{
          background: "linear-gradient(to bottom, rgb(38, 69, 160), #00a9ff)",
          width: "100%",
        }}
      >
        <Container className="py-5">
          <Row>
            <Col md={6}>
              <h1
                className="display-4"
                style={{ fontSize: "80px", color: "white",marginTop:'10%'}}
              >
                Online Exam Software With Excellent Support
              </h1>
              <p className="lead" style={{ color: "white" }}>
                Online Exam Software with Excellent Support provides a
                comprehensive platform for conducting exams remotely. It offers
                a user-friendly interface for both administrators and examinees,
                facilitating seamless exam scheduling, creation, and
                administration.
              </p>
            </Col>
            <Col md={6}>
              <img
                src="examatee.webp"
                alt="online exam"
                className="img-fluid"
                style={{ width: "100%", height: "auto" }}
              />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Header;
