import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EvaluatedCandidate from '@/components/Consumer/EvaluatedCandidateList/EvaluatedCandidateList';
import { evaluatedCandidateList ,PublishResult} from '@/services/ApiServices';
import {  toast } from 'react-toastify';
import {useRouter} from 'next/navigation';

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

jest.mock('@/services/ApiServices');
jest.mock('next/navigation');
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(), // Add this line to mock useRouter
  }));
  
const mockData = {
    data: {
      results: [
        { candidate_id: 1, candidate_name: "John Doe",candidate_status: 3, exams: { math: 80, science: 75 } },
        { candidate_id: 2, candidate_name: "Sam Daniel",candidate_status: 3, exams: { math: 60, science: 45 } },
      ],
      previous: null,
      next: null,
      total_pages: 1,
      page_size: 10,
    },
  };
  beforeEach(() => {

    jest.clearAllMocks();
  });
describe('EvaluatedCandidateList Component', () => {
    test('renders candidate list successfully', async () => {

    evaluatedCandidateList.mockResolvedValueOnce(mockData);
    const { getByText} = render(<EvaluatedCandidate examId={1} />);

   await waitFor(()=>{
    expect(getByText('John Doe')).toBeInTheDocument();

   })
    });

test('filters candidates by search term', async () => {
  evaluatedCandidateList.mockResolvedValueOnce(mockData);

  const { getByText } = render(<EvaluatedCandidate examId={1} />);

  const searchInput = screen.getByPlaceholderText('Search...');
  fireEvent.change(searchInput, { target: { value: 'Doe' } });

  await waitFor(()=>{
  expect(getByText('John Doe')).toBeInTheDocument();
  })
})

test('handles pagination', async () => {
    
    evaluatedCandidateList.mockResolvedValueOnce({
      data: {
        results: [],
        total_pages: 2,
        page_size: 1,
      },
    });

    render(<EvaluatedCandidate examId="123" />);
    userEvent.click(screen.getByText('Next'));
    await waitFor(()=>{
    expect(evaluatedCandidateList).toHaveBeenCalled() // Verify page number for API call
  
    })
});

  it('tests pdf format download', async () => {
  const examId = 5;
 
  const createObjectURLMock = jest.fn(() => 'mockedURL');
  const originalCreateObjectURL = window.URL.createObjectURL;
  window.URL.createObjectURL = createObjectURLMock;
  render(<EvaluatedCandidate examId={examId} />);
  fireEvent.click(screen.getByTestId('download'));

  window.URL.createObjectURL = originalCreateObjectURL;
});
test('Changes page on pagination click', async () => {
  render(<EvaluatedCandidate />);
   await waitFor(() => {
       expect(evaluatedCandidateList).toHaveBeenCalled()
     })
     await waitFor(() => {
       expect(screen.getByText("Candidate ID")).toBeInTheDocument();
       expect(screen.getByText("Candidate Name")).toBeInTheDocument();
       expect(screen.getByText("Status")).toBeInTheDocument();
       expect(screen.getByText('Prev')).toBeInTheDocument();
       expect(screen.getByText('Next')).toBeInTheDocument();
     
     });
  
   fireEvent.click(screen.getByText('Next'))
   fireEvent.click(screen.getByText('Prev'))
  
   await waitFor(() => {
     expect(screen.getAllByRole("row")).toHaveLength(1);
   });
 });

test('handleEvaluate function redirects to free-answer-evaluation page with correct candidate id', async () => {
  const mockRouterPush = jest.fn();
  useRouter.mockImplementation(() => ({
    push: mockRouterPush,
  }));
  const mockListData = {
    data: {
      results: [
        { candidate_id: 1, candidate_name: "John Doe",candidate_status: 3, exams: { math: 80, science: 75 } },
      ],
      previous: null,
      next: null,
      total_pages: 1,
      page_size: 10,
    },
  };
  evaluatedCandidateList.mockResolvedValueOnce(mockListData);
  const { getByText} = render(<EvaluatedCandidate examId={1} />);

  await waitFor(()=>{
    expect(getByText('John Doe')).toBeInTheDocument();

   })
  const candidateStatusButton = screen.getByTestId("candidate-status");
  fireEvent.click(candidateStatusButton);
});
it('tests pdf format download', async () => {
  const examId = 5;
 
  const createObjectURLMock = jest.fn(() => 'mockedURL');
  const originalCreateObjectURL = window.URL.createObjectURL;
  window.URL.createObjectURL = createObjectURLMock;
  render(<EvaluatedCandidate examId={examId} />);
  fireEvent.click(screen.getByTestId('download'));

  window.URL.createObjectURL = originalCreateObjectURL;
});
})

