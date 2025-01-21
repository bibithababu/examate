import React from 'react';
import { render, screen, fireEvent, waitFor ,act} from '@testing-library/react';
import TicketHistory from '@/components/ticket-request/ticket-history';
import { ticketHistory } from '@/services/ApiServices';
import { useRouter} from 'next/navigation';

// Mock the ticketHistory function
jest.mock('@/services/ApiServices', () => ({
  ticketHistory: jest.fn(),
}));
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(), // Add this line to mock useRouter
  }));

describe('TicketHistory component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it('renders TicketHistory component with no data', async () => {
    ticketHistory.mockResolvedValueOnce({ data: { results: [] } }); // Mock the API response
    render(<TicketHistory />);

    // Assert that "No data found" message is displayed
    expect(await screen.findByText('No data found')).toBeInTheDocument();
  });

  it('renders TicketHistory component with ticket data', async () => {
    const ticketData = [
      {
        id: 1,
        created_at: '2022-01-01',
        organisation: 'Org 1',
        status: 'Open',
      },
      {
        id: 2,
        created_at: '2022-01-02',
        organisation: 'Org 2',
        status: 'Closed',
      },
    ];
    ticketHistory.mockResolvedValueOnce({ data: { results: ticketData } }); // Mock the API response
    render(<TicketHistory />);

    // Assert that table rows are rendered with ticket data
    expect(await screen.findByText('Org 1')).toBeInTheDocument();
    expect(screen.getByText('Org 2')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('calls ticketHistory function with searchParam and sortParam', async () => {
    ticketHistory.mockResolvedValueOnce({ data: { results: [] } }); // Mock the API response
    render(<TicketHistory />);

    // Simulate user input
    const searchInput = screen.getByPlaceholderText('Search organisation...');
    fireEvent.change(searchInput, { target: { value: 'Org' } });

    // Assert that ticketHistory function is called with searchParam and sortParam
    expect(ticketHistory).toHaveBeenCalledWith('Org', undefined, 1);
  });

  it('renders TicketHistory component with pagination', async () => {

    ticketHistory.mockResolvedValueOnce({ 
        data: {
        "next": "http://localhost:8000/tickets/ticket-history/?page=2",
        "previous": null,
        "count": 3,
        "results": [
            {
                "id": 1,
                "status": "Requested",
                "organisation": "nived",
                "created_at": "07-03-2024 10:54:00",
                "exam": null
            }
        ]
    } }); // Mock the API response
    await act(async () => {
        render(<TicketHistory  />);
      });

    // Assert initial page and total pages

    // Simulate clicking next page button
    const nextPageButton = screen.getByTestId('next-button');
    fireEvent.click(nextPageButton);

    // Wait for the component to re-render with the next page data

    // Simulate clicking previous page button
    const prevPageButton = screen.getByTestId('prev-button');
    fireEvent.click(prevPageButton);

    const selectBox = screen.getByTestId('select-box'); // Adjust the label text according to your implementation
    fireEvent.change(selectBox, { target: { value: '2' } });
  });


});
