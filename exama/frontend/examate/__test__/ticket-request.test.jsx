import React from 'react';
import { render, fireEvent, waitFor, screen ,act,} from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter} from 'next/navigation';
import TicketRequest from '@/components/ticket-request/ticket-request';
import { ticketRequestlist } from '@/services/ApiServices';

// Mock the API services
jest.mock('@/services/ApiServices', () => ({
  ticketRequestlist: jest.fn(),
  ticketApprove: jest.fn(() => Promise.resolve()),
  deleteTicketRequest: jest.fn(() => Promise.resolve()),
}));
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(), // Add this line to mock useRouter
  }));
  


describe('TicketRequest component', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('fetches ticket list on initial render', async () => {
    ticketRequestlist.mockResolvedValue({
        data: {"next":null,"previous":null,"count":0,"results":[]}
      });
    await act(async () => {
      render(<TicketRequest />);
    });
    expect(screen.getByText('No more requests found')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();

});

it('move to view history page', async () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    ticketRequestlist.mockResolvedValue({
        data: {"next":null,"previous":null,"count":0,"results":[]}
      });
    await act(async () => {
      render(<TicketRequest />);
    });
    fireEvent.click(screen.getByText('View history'));
});

  it('approves ticket on button click', async () => {
    // Mock ticket data
    ticketRequestlist.mockResolvedValue({
        data: {
        "next": "http://localhost:8000/tickets/ticket-request/?page=2",
        "previous": null,
        "count": 2,
        "results": [
            {
                "organisation": "nived",
                "count": 2,
                "tickets": [
                    1,
                    2
                ]
            }
        ]
    }
});
    // Render the component
    await act(async () => {
        render(<TicketRequest />);
      });
      await act(async () => {
    fireEvent.click(screen.getByText('APPROVE'));
});

  });

  it('rejects ticket on button click', async () => {
    // Mock ticket data
    ticketRequestlist.mockResolvedValue({
        data: {
        "next": "http://localhost:8000/tickets/ticket-request/?page=2",
        "previous": null,
        "count": 2,
        "results": [
            {
                "organisation": "nived",
                "count": 2,
                "tickets": [
                    1,
                    2
                ]
            }
        ]
    }
});
    // Render the component
    await act(async () => {
        render(<TicketRequest />);
      });
      await act(async () => {
    fireEvent.click(screen.getByTestId('reject-button'));
});
});

it('loads more list on button click', async () => {
    // Mock ticket data
    ticketRequestlist.mockResolvedValue({
        data: {
        "next": "http://localhost:8000/tickets/ticket-request/?page=2",
        "previous": null,
        "count": 2,
        "results": [
            {
                "organisation": "nived",
                "count": 2,
                "tickets": [
                    1,
                    2
                ]
            }
        ]
    }
});
    // Render the component
    await act(async () => {
        render(<TicketRequest />);
      });
      await act(async () => {
    fireEvent.click(screen.getByTestId('load-more-button'));
});

  });
//   it('deletes ticket on button click', async () => {
//     // Mock ticket data
//     const ticket = { id: 2, organisation: 'Org', count: 1 };
//     // Render the component
//     render(<TicketRequest />);
//     // Wait for the initial ticket list to load
//     await waitFor(() => expect(screen.getByText('No more requests found')).toBeInTheDocument());
//     // Mock the API response for ticket deletion
//     jest.spyOn(window, 'toast').mockImplementation();
//     // Click the delete button
//     fireEvent.click(screen.getByRole('button', { name: /delete/i }));
//     // Verify that the delete API service is called with the correct parameters
//     await waitFor(() => expect(window.deleteTicketRequest).toHaveBeenCalledWith({ ticket_ids: ticket.tickets, updatedStatus: 5 }));
//     // Verify that success toast message is shown
//     expect(window.toast).toHaveBeenCalledWith(expect.objectContaining({ autoClose: 2000 }));
//     // Verify that the ticket is removed from the list
//     await waitFor(() => expect(screen.queryByText('Org has requested 1 ticket')).not.toBeInTheDocument());
//   });


});

