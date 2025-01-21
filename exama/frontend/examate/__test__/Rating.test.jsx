
import React from 'react';
import { render, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import RatingComponent from '@/components/EndUser/Rating/Rating';
import {  toast } from 'react-toastify';
import { feedback } from '@/services/ApiServices';
import Swal from 'sweetalert2';

// Mock the API service function
jest.mock('@/services/ApiServices', () => ({
  feedback: jest.fn(),
}));
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      query: { exam_id: '1' },
      push: jest.fn(),
    }),
    useSearchParams: jest.fn(() => new URLSearchParams('exam_id=1')),
  }));
  
describe('RatingComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', () => {
    const { getByText } = render(<RatingComponent />);
    expect(getByText('Rate Your Experience With Us')).toBeInTheDocument();
  });

  test('submits rating and comment warning', async () => {
    const { getByTestId, getByPlaceholderText } = render(<RatingComponent />);
    const ratingSubmitButton = getByTestId('rating-submit');
    const commentInput = getByPlaceholderText('Enter any comments...');

    fireEvent.change(commentInput, { target: { value: 'This is a test comment.' } });
    fireEvent.click(ratingSubmitButton);
      expect(Swal.fire).toHaveBeenCalledWith({
        "icon": "warning",
        "title": "Kindly give feedback it will help us to improve!",
      });
    });

    test('submits rating and comment successfully', async () => {
      // Mocking the resolved value for feedback API call
      
      const { getByTestId,getByPlaceholderText } = render(<RatingComponent />);
      const starIcon = document.getElementsByClassName('icon')[0];
      fireEvent.click(starIcon);
     
      const commentInput = getByPlaceholderText('Enter any comments...');
      fireEvent.change(commentInput, { target: { value: 'Good experience overall.' } });
      const submitButton = getByTestId('rating-submit');
      fireEvent.click(submitButton);
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: "Thank you",
        showConfirmButton: false,
        timer: 1500
      }); 
    })
    });

});  