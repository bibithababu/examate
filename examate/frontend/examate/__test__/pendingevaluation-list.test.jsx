import React from 'react';
import { render, screen ,waitFor,fireEvent, getByTestId} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PendingEvaluation from '@/components/pedingevaluationlist/pendingevaluation';
import { pendingEvaluationList } from '@/services/ApiServices'; 
import { useRouter } from 'next/navigation';


jest.mock('@/services/ApiServices', () => ({
  pendingEvaluationList: jest.fn(),
}));

  jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

 const mockResponseData = {
      data: {
        results: [
          { id: 1, name: 'Exam 1', scheduled_time: '2024-02-20', candidate_count: 10, status: 1 },
          { id: 2, name: 'Exam 2', scheduled_time: '2024-02-21', candidate_count: 15, status: 1 },
          { id: 3, name: 'Exam 3', scheduled_time: '2024-02-22', candidate_count: 20, status: 1 },
        ],
        next: null,
        previous: null,
        total_pages: 1,
        page_size: 3,
      },
    };

   
describe('PendingEvaluation component', () => {
    beforeEach(() => {
    
        pendingEvaluationList.mockReset();
    });

    it('renders without crashing', async () => {
    
   
        pendingEvaluationList.mockResolvedValueOnce(mockResponseData);

     render(<PendingEvaluation />);

    
        await screen.findByText('Exam 1');
        await screen.findByText('Exam 2');
        await screen.findByText('Exam 3');
        
   
        expect(pendingEvaluationList).toHaveBeenCalledWith(
            'examate/exam/pending-evaluation-list/',
            undefined,
            undefined
        );
    });

    it('handles search functionality', async () => {
        pendingEvaluationList.mockResolvedValueOnce(mockResponseData);

        render(<PendingEvaluation />);

   
        const searchInput = screen.getByPlaceholderText('Search...');
        userEvent.type(searchInput, 'example search term');

        await waitFor(() => {
            expect(searchInput.value).toBe('example search term');
            expect(screen.getByText(mockResponseData.data.results[0].name)).toBeInTheDocument();
      
        });
   
    });
    
    it('handles sorting functionality  using name', async () => {
        const mockExamData = [{
            id: 1, name: 'SampleExam1',
            scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
            candidate_count: 100,
            exam_duration: 120, // in minutes
            status: 0
        },
        {
            id: 2, name: 'SampleExam2',
            scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
            candidate_count: 10,
            exam_duration: 110, // in minutes
            status: 1
        
        }];
        const mockResponseData = {
            data: {
                results: mockExamData,
                next: null,
                previous: null,
                total_pages: 1,
                page_size: 10,
            },
        };
        pendingEvaluationList.mockResolvedValueOnce(mockResponseData);

        render(<PendingEvaluation />);

        await waitFor(() => {
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
            expect(screen.getByText("SampleExam2")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('exam-filter'));

        await waitFor(() => {
            expect(screen.getAllByRole("row")).toHaveLength(3);
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
            expect(screen.getByText('SampleExam2')).toBeInTheDocument();

        });
    });
    
    it("handleEvaluate navigates to evaluated candidate list page with correct exam id", async () => {
       
        const mockResponseData = {
            data: {
                results: [
                { id: 1, name: 'Exam 1', scheduled_time: '2024-02-20', candidate_count: 10, status: 1 },
                
                ],
                next: null,
                previous: null,
                total_pages: 1,
                page_size: 3,
            },
            };
        pendingEvaluationList.mockResolvedValueOnce(mockResponseData);

           const { getByRole }=render(<PendingEvaluation />);

    
        await screen.findByText('Exam 1');
        expect(pendingEvaluationList).toHaveBeenCalledWith(
            'examate/exam/pending-evaluation-list/',
            undefined,
            undefined
        );
 

  await waitFor(() => {
    const evaluateButton = getByRole("button", { name: "Evaluate" });
    fireEvent.click(evaluateButton);
  });


});

   
});
    
