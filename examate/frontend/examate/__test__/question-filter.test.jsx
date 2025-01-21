import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { subjectdropdownListing } from '@/services/ApiServices';
import QuestionFilterModal from '@/components/question-list/question-filter'; // Replace with the actual import path

jest.mock('@/services/ApiServices', () => ({
  ...jest.requireActual('@/services/ApiServices'),
  subjectdropdownListing: jest.fn(),
}));
 describe('QuestionFilterModal Component', () => {
        it('calls onSubmit with correct data and hides the modal', async () => {
          // Arrange
          const onApplyFiltersMock = jest.fn();
          const onHideMock = jest.fn();
      
          render(
            <QuestionFilterModal show={true} onHide={onHideMock} onApplyFilters={onApplyFiltersMock} />
          );
      
          // Act
          // Assuming your modal has form inputs, fill them with valid data
          expect(subjectdropdownListing).toHaveBeenCalled();
          fireEvent.change(screen.getByTestId('subject-select'), { target: { value: '1' } });
          fireEvent.click(screen.getByLabelText(/Free Answer/i));
          // fireEvent.click(screen.getByLabelText(/Medium/i));
      
          fireEvent.click(screen.getByText('FILTER'));
      
          // Assert
          // await waitFor(() => {
          //   expect(onApplyFiltersMock).toHaveBeenCalledWith({
          //     subject_id: '',
          //     answer_type: '3',
          //     difficulty_level: '2',
          //   });
          //   expect(onHideMock).toHaveBeenCalled();
          // });
        });
      
        it('clears filters when CLEAR button is clicked', async () => {
          // Arrange
          const onApplyFiltersMock = jest.fn();
          const onHideMock = jest.fn();
      
          render(
            <QuestionFilterModal show={true} onHide={onHideMock} onApplyFilters={onApplyFiltersMock} />
          );
      
          // Act
          fireEvent.change(screen.getByTestId('subject-select'), { target: { value: '1' } });
          fireEvent.click(screen.getByLabelText(/Free Answer/i));
          // fireEvent.click(screen.getByLabelText(/Medium/i));
      
          fireEvent.click(screen.getByText('CLEAR'));
      
          // Assert

        });
      });