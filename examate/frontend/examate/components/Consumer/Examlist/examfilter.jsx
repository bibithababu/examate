import React, { useState } from 'react';
import { Modal, Button,Form,FormGroup,FormCheck } from 'react-bootstrap';

const FilterModal = ({ isOpen, onClose, onApplyFilter }) => {
    const [selectedValue, setSelectedValue] = useState(""); 

    const handleCheckboxChange = (event) => {
        setSelectedValue(event.target.value);
    }
    

    const handleApply = () => {
    onApplyFilter(selectedValue); 
    onClose(); 
  };
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filter By Exam Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <Form>
          <FormGroup>
            <FormCheck
              type="checkbox"
              label="All Exams"
              value=""
              checked={selectedValue === ""} 
              onChange={handleCheckboxChange}
               aria-label="Select all exam statuses"
            />
            <FormCheck
              type="checkbox"
              label="Drafted"
              value="0"
              checked={selectedValue === "0"} 
              onChange={handleCheckboxChange}
               aria-label="Filter by: Drafted"
            />
            <FormCheck
              type="checkbox"
              label="Confirmed"
              value="1"
              checked={selectedValue === "1"} 
              onChange={handleCheckboxChange}
            />
            <FormCheck
              type="checkbox"
              label="Completed"
              value="2"
              checked={selectedValue === "2"}
              onChange={handleCheckboxChange}
            />
            <FormCheck
              type="checkbox"
              label="Evaluated"
              value="3"
              checked={selectedValue === "3"} 
              onChange={handleCheckboxChange}
            />
            <FormCheck
              type="checkbox"
              label="Result Published"
              value="4"
              checked={selectedValue === "4"} 
              onChange={handleCheckboxChange}
            />
             <FormCheck
              type="checkbox"
              label="Cancelled Exams"
              value="5"
              checked={selectedValue === "5"} 
              onChange={handleCheckboxChange}
            />
          </FormGroup>
        </Form>
      </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleApply}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
