
import React from 'react';
import '@testing-library/jest-dom'
import { render,screen,fireEvent } from '@testing-library/react';
import CreateQuestion from "@/components/createquestion/createquestion";

it('renders CreateQuestion component', () => {
    render(<CreateQuestion show={true} onHide={() => {}} />);
    const modalTitle = screen.getByText('Add Questions');
    expect(modalTitle).toBeInTheDocument();
  });

it('changes answer type when radio button clicked', () => {
    render(<CreateQuestion show={true} onHide={() => {}} />);
  
    const singleAnswerRadio = screen.getByLabelText('SA');
    const multipleAnswerRadio = screen.getByLabelText('MA');
    
    fireEvent.click(singleAnswerRadio);
    expect(singleAnswerRadio).toBeChecked();
    expect(multipleAnswerRadio).not.toBeChecked();
  
    fireEvent.click(multipleAnswerRadio);
    expect(multipleAnswerRadio).toBeChecked();
    expect(singleAnswerRadio).not.toBeChecked();
    
  });