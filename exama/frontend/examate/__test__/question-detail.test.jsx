import React from 'react';
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionDetailModal from '@/components/question-list/question-detail';  // Adjust the import path accordingly
import { ApproveQuestion, deleteQuestion } from '@/services/ApiServices';

jest.mock('@/services/ApiServices', () => ({
  ApproveQuestion: jest.fn(),
  deleteQuestion: jest.fn(),
}));

describe('QuestionDetailModal Component', () => {
  const questionDetails = {
    id: 1,
    question_description: 'Test Question',
    marks: 2,
    is_drafted: true,
    options: [{ options: 'Option 1', is_answer: true }, { options: 'Option 2', is_answer: false }],
    answer: [{ answer: 'Correct Answer' }],
  
    difficulty_level_display: 'Easy',
  };

  const onClose = jest.fn();

  beforeEach(async () => {
    await act(async () => {
      render(<QuestionDetailModal questionDetails={questionDetails} onClose={onClose} />);
    });
  });

  test('renders question details', () => {
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Option 1 (Correct Answer)')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Correct Answer')).toBeInTheDocument();
    expect(screen.getByText('Marks:')).toBeInTheDocument();
   
  
    
    expect(screen.getByText('Difficulty Level:')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  test('shows publish and delete buttons for drafted questions', () => {
    expect(screen.getByText('PUBLISH')).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('calls HandleApprove on publish button click', async () => {
    fireEvent.click(screen.getByText('PUBLISH'));

    await waitFor(() => expect(ApproveQuestion).toHaveBeenCalledWith(1));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('calls deleteQuestion on delete button click', async () => {
    fireEvent.click(screen.getByText('DELETE'));

    await waitFor(() => expect(deleteQuestion).toHaveBeenCalledWith(1));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('calls handleCloseModal on close button click', () => {
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
  test('calls editquestion on edit button click', () => {
    fireEvent.click(screen.getByTestId('edit-button'));
  });
  test('when no question details', () => {
    render(<QuestionDetailModal questionDetails={!questionDetails} onClose={onClose} />);
  });
});
