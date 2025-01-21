import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CandidateList from '@/components/candidate-list/CandidateList';
import { candidateListing, candidateInvite } from '@/services/ApiServices';
import { useSearchParams } from 'next/navigation';

jest.mock('@/services/ApiServices');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(), // Add this line to mock useRouter
}));

describe('CandidateList', () => {
  it('renders candidate list and handles invite and invite all', async () => {

    // Mock the data returned from the API
    const mockCandidates = [
      { id: 1, email: 'candidate1@example.com', status: 0 },
      { id: 2, email: 'test2@example.com', status: 0 },
      { id: 2, email: 'test2@example.com', status: 0 }
    ];

    const mockPaginationLinks = {
      nextLink: 'mockNextLink',
      previousLink: 'mockPreviousLink',
      currentLink: 'mockCurrentLink',
    };

    candidateListing.mockResolvedValue({
      data: {
        results: mockCandidates,
        next: mockPaginationLinks.nextLink,
        previous: mockPaginationLinks.previousLink,
        total_pages: 2,
        page_size: 10,
      },
    });

    // Render the component
    render(<CandidateList examid={'mockValue'} />);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(candidateListing).toHaveBeenCalled();
    });

    // Assert that the candidates are rendered
    expect(screen.getByText('candidate1@example.com')).toBeInTheDocument();


    // Mock the invite API call
    candidateInvite.mockResolvedValue({});

    // Click the invite button
   fireEvent.click(screen.getByTestId(`invitebutton1`), { target: { id: 1 } });

    // Wait for the invite to be processed
    await waitFor(() => {
      expect(candidateInvite).toHaveBeenCalledWith({ candidateId: [1], examid:"mockValue"});
    });

    // Assert that the invitation status is updated

  });
  it('invites a candidate when handleInvite is called', async () => {
    // Mock the candidateListing API call
    candidateListing.mockResolvedValue({
      data: {
        next: null,
        previous: null,
        currentLink: 'examatecandidates/candidateslist/2/',
        total_pages: 1,
        results: [
          { id: 1, email: 'test1@example.com', status: 0 },
          { id: 2, email: 'test2@example.com', status: 0 },
        ],
        page_size: 10,
      },
    });
    await waitFor(() => {
      expect(candidateListing).toHaveBeenCalled();
    });


    // Render the component
    render(<CandidateList examid={'mockValue'} />);

    // Mock the candidateInvite API call
    candidateInvite.mockResolvedValue({});

    // Click the Invite button for a specific candidate
    fireEvent.click(screen.getByTestId('invitebutton'), { target: { id: 1 } });

    // Wait for the API call to be made
    // await waitFor(() => {
    //   expect(candidateInvite).toHaveBeenCalledWith({
    //     candidateId: [1],
    //     examid: 2,
    //   });
    // });

    // Ensure that the candidate status is updated in the UI
  });
  it('delete a candidate', async () => {
    // Mock the candidateListing API call
    candidateListing.mockResolvedValue({
      data: {
        next: null,
        previous: null,
        currentLink: 'examatecandidates/candidateslist/2/',
        total_pages: 1,
        results: [
          { id: 1, email: 'test1@example.com', status: 0 },
          { id: 2, email: 'test2@example.com', status: 0 },
        ],
        page_size: 10,
      },
    });

    // Render the component
    render(<CandidateList examid={'mockValue'} />);
    await waitFor(() => {
      expect(candidateListing).toHaveBeenCalled();
    });


    // Click the Invite button for a specific candidate
    fireEvent.click(screen.getByTestId('delete-button1'), { target: { id: 1 } });

  });
  it('click add candidate button', async () => {

    render(<CandidateList examid={'mockValue'} />);
    await waitFor(() => {
      expect(candidateListing).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByTestId('add-candidate-button'));
  });
  it('updates searchParam state when user searches', () => {
    // Render the component
    render(<CandidateList examid={'mockValue'} />);

    // Mock user input
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test@example.com' } });

    // Ensure that searchParam state is updated correctly
    expect(searchInput.value).toBe('test@example.com');
  });
});
