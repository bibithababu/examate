import React, { useEffect } from 'react';
import { render, act,waitFor} from '@testing-library/react';
import { TicketStatusProvider,useTicketStatus } from '@/context/ticketStatusContext';
import { getTicketStatusCounts } from '@/services/ApiServices';
import {  toast } from 'react-toastify';

jest.mock('@/services/ApiServices');

jest.mock('react-toastify', () => ({
    ...jest.requireActual('react-toastify'),
    toast: {
      POSITION:{TOP_CENTER:jest.fn()},
      success: jest.fn(),
      error: jest.fn(),
      dismiss: jest.fn(),
      warning:jest.fn()
    },
  }));

describe('TicketStatusProvider', () => {
  beforeEach(() => {
    getTicketStatusCounts.mockClear();
  });

  test('updates ticket status count on mount', async () => {
    const mockData = {
      requested_count: 10,
      approved_count: 20,
      consumed_count: 30
    };
    getTicketStatusCounts.mockResolvedValueOnce({ data: mockData });

    let component;
    await act(async () => {
      component = render(
        <TicketStatusProvider>
          <MockChildComponent />
        </TicketStatusProvider>
      );
    });

   
    expect(component.getByText(/requested count:/i).textContent).toBe('Requested count: 10');
    expect(component.getByText(/approved count:/i).textContent).toBe('Approved count: 20');
    expect(component.getByText(/consumed count:/i).textContent).toBe('Consumed count: 30');
  });
  test('handles error when updating ticket status count', async () => {
   
    getTicketStatusCounts.mockRejectedValueOnce("API error");
  
    await act(async () => {
      render(
        <TicketStatusProvider>
          <MockChildComponent />
        </TicketStatusProvider>
      );
    });
  
   
    await waitFor(()=>{
        expect(toast.error).toHaveBeenCalledWith('Network unable to connect to the server',{"autoClose": 2000});
       })    
  });

  test('handles response error when updating ticket status count', async () => {
   
    getTicketStatusCounts.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } });

  
    await act(async () => {
      render(
        <TicketStatusProvider>
          <MockChildComponent />
        </TicketStatusProvider>
      );
    });
  
   
    await waitFor(()=>{
        expect(toast.error).toHaveBeenCalledWith('Mocked error',{"autoClose": 2000});
       })    
  });

  
});



const MockChildComponent = () => {
    const { ticketStatusCount, updateTicketStatusCount } = useTicketStatus()

  useEffect(()=>{
     updateTicketStatusCount()
  },[])

  return (
    <div>
      <p>Requested count: {ticketStatusCount.requestedCount}</p>
      <p>Approved count: {ticketStatusCount.approvedCount}</p>
      <p>Consumed count: {ticketStatusCount.consumedCount}</p>
    </div>
  );
};
