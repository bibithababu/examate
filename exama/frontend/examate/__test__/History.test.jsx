import History from "@/components/TicketPurchase/History/History";
import { ticketList } from "@/services/ApiServices";
import React from 'react';
import {  toast } from 'react-toastify';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter} from 'next/navigation';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useSearchParams: jest.fn(),
    useRouter: jest.fn(), // Add this line to mock useRouter
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
  // Mocking ticketList function
  jest.mock('@/services/ApiServices', () => ({
    ticketList: jest.fn(() => Promise.resolve({ data: { results: [] } })),
  }));
  
  describe('History Component', () => {
    beforeEach(() => {

        jest.clearAllMocks();
      });
    it('renders without crashing', () => {
      render(<History />);
    });
    it('displays ticket list', async () => {
        const { getByText } = render(<History />);
        await waitFor(() => getByText('No Transactions are done at.'));
      });
      it('fetches tickets and renders them correctly', async () => {
        const mockTickets = [
          { id: 1, status: 0, created_at: '2024-03-13T12:00:00Z', exam_name: 'Example Exam' },
          { id: 2, status: 1, created_at: '2024-03-14T12:00:00Z', exam_name: 'Another Exam' },
          { id: 3, status: 2, created_at: '2024-03-13T12:00:00Z', exam_name: 'Demo Exam' },
          { id: 4, status: 3, created_at: '2024-03-14T12:00:00Z', exam_name: 'Test Exam' },
          { id: 5, status: 4, created_at: '2024-03-14T12:00:00Z', exam_name: 'Unknown  Exam'}, 
        ];
        ticketList.mockResolvedValueOnce({ data: { results: mockTickets } });
    
        const { getByText } = render(<History />);
        
        await waitFor(() => {
          expect(getByText('Example Exam')).toBeInTheDocument();
          expect(getByText('Another Exam')).toBeInTheDocument();
          expect(getByText('Demo Exam')).toBeInTheDocument();
          expect(getByText('Test Exam')).toBeInTheDocument();
          expect(getByText('Unknown Exam')).toBeInTheDocument();
        });
      });
    
      it('opens modal on Buy Ticket button click', async() => {
        const mockRouter = {
          push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);
        
        const { getByTestId } = render(<History />);
        fireEvent.click(getByTestId('buy ticket'));
        expect(getByTestId('modal')).toBeInTheDocument();
        expect(getByTestId('get ticket')).toBeInTheDocument();
        fireEvent.click(getByTestId('get ticket'));
        expect(mockRouter.push).toHaveBeenCalledWith(`payment/?ticketCount=1`);
        
      });
      it('updates ticket count on + and - buttons click', () => {
        const { getByText,getByTestId } = render(<History />);
        fireEvent.click(getByTestId('buy ticket'));
        fireEvent.click(getByText('+'));
        expect(getByText('2')).toBeInTheDocument();
        fireEvent.click(getByText('-'));
        expect(getByText('1')).toBeInTheDocument();
      });
     
      it('handles error response correctly', async () => {
   
         ticketList.mockRejectedValueOnce('Some error message',);
          render(<History />);
          await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Some error message");
            });
        })
})