import { render, screen ,fireEvent,waitFor} from '@testing-library/react';
import FeedbackList from '@/components/Consumer/Feedbacklist/FeedbackList';
import {  toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import {  feedbackList } from '@/services/ApiServices';


jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));


jest.mock('@/services/ApiServices', () => ({
    feedbackList: jest.fn(() => Promise.resolve({
    data: {
      results: [
        {
          id: 1,
          candidate_name: 'John Doe',
          candidate_email: 'john.doe@example.com',
          rating: 3.5,
          feedback: 'This was a challenging exam, but the instructions were clear.'
        },
        {
            id: 2,
            candidate_name: 'David ',
            candidate_email: 'david@example.com',
            rating: 2.5,
            feedback: 'nice exam.'
          }
      ],
      total_pages: 2,
      page_size: 1
    }
  }))
}));
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
  }));
beforeEach(() => {

    jest.clearAllMocks();
  });
  
describe('FeedbackList Component', () => {
test('Renders feedback list with basic data', async () => {
    const mockSearchParams = {
        get: jest.fn().mockReturnValue('mockValue'),
      };
      useSearchParams.mockReturnValue(mockSearchParams);
    const { getByText } = render(<FeedbackList />);
    await waitFor(() => {
        expect(feedbackList).toHaveBeenCalled()
      })
    await expect(getByText('Feedbacks')).toBeInTheDocument();
    await expect(getByText('John Doe')).toBeInTheDocument();
    await expect(getByText('3.5')).toBeInTheDocument(); 
    await expect(screen.getByText(/This was a challenging/)).toBeInTheDocument();
  });

  test('Changes page on pagination click', async () => {
   render(<FeedbackList />);
    await waitFor(() => {
        expect(feedbackList).toHaveBeenCalled()
      })
      await waitFor(() => {
        expect(screen.getByText("Feedbacks")).toBeInTheDocument();
        expect(screen.getByText("Candidate Name")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Rating")).toBeInTheDocument();
        expect(screen.getByText("Comment")).toBeInTheDocument();
        expect(screen.getByText('Prev')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
      
      });
   
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Prev'))
   
    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(3);
    });
  });
  test('Opens modal on feedback click and displays details', async () => {
    render(<FeedbackList />);
    await waitFor(() => {
        expect(feedbackList).toHaveBeenCalled()
      })
      await waitFor(() => {
        expect(screen.getByText("Feedbacks")).toBeInTheDocument();
        expect(screen.getByText("Candidate Name")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Rating")).toBeInTheDocument();
        expect(screen.getByText("Comment")).toBeInTheDocument();
        expect(screen.getByText('Prev')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
      
      });
      await waitFor(() => {
        fireEvent.click(screen.getByTestId("dots1"));
      });
      expect(screen.getByText("Feedback")).toBeInTheDocument();
      expect(screen.getByText("Rating:")).toBeInTheDocument();
      expect(screen.getByText("This was a challenging exam, but the instructions were clear.")).toBeInTheDocument();
      expect(screen.getByText("Close")).toBeInTheDocument();
      await waitFor(() => {
      fireEvent.click(screen.getByText("Close"));
      });
  });

  it('handles error response correctly', async () => {
   
    feedbackList.mockRejectedValueOnce(
     'Some error message',
        );

    render(<FeedbackList />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Some error message");
  });
  });
})

