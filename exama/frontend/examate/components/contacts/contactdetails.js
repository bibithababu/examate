import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhoneAlt} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

const ContactDetails = () => {
  const emailAddress = "examate@gmail.com";
  const phoneNumber = "+1234567890";

  return (
    <Container className="text-center py-5">
      <h1 className="my-4">Get In Touch</h1>
      <Row>
        <Col md={6}>
        <FaLocationDot style={{color:'Darkblue'}} size='20%' />
          <h3>Address</h3>
          <p>123 Main Street, Anytown, CA 12345</p>
        </Col>
        <Col md={6}>
        <FaPhoneAlt style={{color:'Darkblue'}} size='20%'/>
          <h3>Phone</h3>
          <p>{phoneNumber}</p>
        </Col>
      </Row>
      <Row>
        <Col>
           <MdOutlineEmail style={{color:'Darkblue'}} size='20%'/>
          <h3>Email</h3>
          <p>
            <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactDetails;
