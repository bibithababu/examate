import { render, screen, waitFor,act, fireEvent, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {  toast } from 'react-toastify';
import ExamList from '@/components/Consumer/Examlist/Examlist';
import { examListing, deleteExamDetails ,cancelExam} from '@/services/ApiServices';

jest.useFakeTimers()
jest.mock('@/services/ApiServices');

const mockExamData = {
    id:1,name: 'Sample Exam',
    scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
    candidate_count: 100,
    exam_duration: 120, // in minutes
    status: 0,
};
const mockExamsData = [
    mockExamData,
    // Add more exams as needed
  ];

const mockExamListingResponse = {
  data: {
    results: mockExamsData,
    next: '/example-next-link',
    previous: '/example-previous-link',
    total_pages: 3,
    page_size: 10,
  },
};

jest.mock('react-toastify', () => ({
    ...jest.requireActual('react-toastify'),
    toast: {
      POSITION:{TOP_CENTER:jest.fn()},
      success: jest.fn(),
      error: jest.fn(),
      dismiss: jest.fn(),
    },
  }));

  jest.mock('@/components/createexammodal/CreateExamModal',() => ({
    __esModule: true,
    default: () => <h1>Create exam modal</h1>
  
  }));

beforeEach(() => {

  jest.clearAllMocks();
});

describe('ExamList Component', () => {
  
  it('renders the component with exams', async () => {
    examListing.mockResolvedValueOnce(mockExamListingResponse);

    render(<ExamList />);

    await waitFor(() => {
      expect(screen.getByText(mockExamsData[0].name)).toBeInTheDocument();
   
    });
  });


  it('handles search functionality', async () => {
    const mockExamData = [{
      id:1,name: 'SampleExam1',
      scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
      candidate_count: 100,
      exam_duration: 120, // in minutes
      status: 0},
      {
          id:2,name: 'SampleExam2',
          scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
          candidate_count: 10,
          exam_duration: 110, // in minutes
          status: 1
      
  }];
  const mockExamListingResponse = {
      data: {
        results: mockExamData,
        next: null,
        previous: null,
        total_pages: 1,
        page_size: 10,
      },
    };
    examListing.mockResolvedValueOnce(mockExamListingResponse);

    render(<ExamList />);

   
    const searchInput = screen.getByPlaceholderText('Search...');
    userEvent.type(searchInput, 'SampleExam2');

    await waitFor(() => {
      expect(searchInput.value).toBe('SampleExam2');
      expect(screen.getByText('SampleExam2')).toBeInTheDocument();
      
    });
  });


  it('handles sorting functionality  using name', async () => {
    const mockExamData = [{
        id:1,name: 'SampleExam1',
        scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
        candidate_count: 100,
        exam_duration: 120, // in minutes
        status: 0},
        {
            id:2,name: 'SampleExam2',
            scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
            candidate_count: 10,
            exam_duration: 110, // in minutes
            status: 1
        
    }];
    const mockExamListingResponse = {
        data: {
          results: mockExamData,
          next: null,
          previous: null,
          total_pages: 1,
          page_size: 10,
        },
      };
    examListing.mockResolvedValueOnce(mockExamListingResponse);

    render(<ExamList />);

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

    it('handles sorting functionality using date', async () => {
      const mockExamData = [{
          id:1,name: 'SampleExam1',
          scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
          candidate_count: 100,
          exam_duration: 120, // in minutes
          status: 0},
          {
              id:2,name: 'SampleExam2',
              scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
              candidate_count: 10,
              exam_duration: 110, // in minutes
              status: 1
          
      }];
      const mockExamListingResponse = {
          data: {
            results: mockExamData,
            next: null,
            previous: null,
            total_pages: 1,
            page_size: 10,
          },
        };
      examListing.mockResolvedValueOnce(mockExamListingResponse);
  
      render(<ExamList />);
  
      await waitFor(() => {
          expect(screen.getByText("SampleExam1")).toBeInTheDocument();
          expect(screen.getByText("SampleExam2")).toBeInTheDocument();
        });
       fireEvent.click(screen.getByTestId('date-filter'));
  
       await waitFor(() => {
          expect(screen.getAllByRole("row")).toHaveLength(3);
          expect(screen.getByText("SampleExam1")).toBeInTheDocument();
          expect(screen.getByText('SampleExam2')).toBeInTheDocument();
  
        });
      });
      it('handles sorting functionality using candidate count', async () => {
        const mockExamData = [{
            id:1,name: 'SampleExam1',
            scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
            candidate_count: 100,
            exam_duration: 120, // in minutes
            status: 0},
            {
                id:2,name: 'SampleExam2',
                scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
                candidate_count: 10,
                exam_duration: 110, // in minutes
                status: 1
            
        }];
        const mockExamListingResponse = {
            data: {
              results: mockExamData,
              next: null,
              previous: null,
              total_pages: 1,
              page_size: 10,
            },
          };
        examListing.mockResolvedValueOnce(mockExamListingResponse);
    
        render(<ExamList />);
    
        await waitFor(() => {
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
            expect(screen.getByText("SampleExam2")).toBeInTheDocument();
          });
         fireEvent.click(screen.getByTestId('students-filter'));
    
         await waitFor(() => {
            expect(screen.getAllByRole("row")).toHaveLength(3);
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
            expect(screen.getByText('SampleExam2')).toBeInTheDocument();
    
          });
        });
        it('handles sorting functionality using date', async () => {
          const mockExamData = [{
              id:1,name: 'SampleExam1',
              scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
              candidate_count: 100,
              exam_duration: 120, // in minutes
              status: 0},
              {
                  id:2,name: 'SampleExam2',
                  scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
                  candidate_count: 10,
                  exam_duration: 110, // in minutes
                  status: 1
              
          }];
          const mockExamListingResponse = {
              data: {
                results: mockExamData,
                next: null,
                previous: null,
                total_pages: 1,
                page_size: 10,
              },
            };
          examListing.mockResolvedValueOnce(mockExamListingResponse);
      
          render(<ExamList />);
      
          await waitFor(() => {
              expect(screen.getByText("SampleExam1")).toBeInTheDocument();
              expect(screen.getByText("SampleExam2")).toBeInTheDocument();
            });
           fireEvent.click(screen.getByTestId('date-filter'));
      
           await waitFor(() => {
              expect(screen.getAllByRole("row")).toHaveLength(3);
              expect(screen.getByText("SampleExam2")).toBeInTheDocument();
              expect(screen.getByText("SampleExam1")).toBeInTheDocument();
      
            });
          });
          it('handles sorting functionality using date', async () => {
            const mockExamData = [{
                id:1,name: 'SampleExam1',
                scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
                candidate_count: 100,
                exam_duration: 120, // in minutes
                status: 0},
                {
                    id:2,name: 'SampleExam2',
                    scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
                    candidate_count: 10,
                    exam_duration: 110, // in minutes
                    status: 1
                
            }];
            const mockExamListingResponse = {
                data: {
                  results: mockExamData,
                  next: null,
                  previous: null,
                  total_pages: 1,
                  page_size: 10,
                },
              };
            examListing.mockResolvedValueOnce(mockExamListingResponse);
        
            render(<ExamList />);
        
            await waitFor(() => {
                expect(screen.getByText("SampleExam1")).toBeInTheDocument();
                expect(screen.getByText("SampleExam2")).toBeInTheDocument();
              });
             fireEvent.click(screen.getByTestId('duration-filter'));
        
             await waitFor(() => {
                expect(screen.getAllByRole("row")).toHaveLength(3);
                expect(screen.getByText("SampleExam2")).toBeInTheDocument();
                expect(screen.getByText("SampleExam1")).toBeInTheDocument();
        
              });
            });
            it('handles sorting functionality using date', async () => {
              const mockExamData = [{
                  id:1,name: 'SampleExam1',
                  scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
                  candidate_count: 100,
                  exam_duration: 120, // in minutes
                  status: 0},
                  {
                      id:2,name: 'SampleExam2',
                      scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
                      candidate_count: 10,
                      exam_duration: 110, // in minutes
                      status: 1
                  
              }];
              const mockExamListingResponse = {
                  data: {
                    results: mockExamData,
                    next: null,
                    previous: null,
                    total_pages: 1,
                    page_size: 10,
                  },
                };
              examListing.mockResolvedValueOnce(mockExamListingResponse);
          
              render(<ExamList />);
          
              await waitFor(() => {
                  expect(screen.getByText("SampleExam1")).toBeInTheDocument();
                  expect(screen.getByText("SampleExam2")).toBeInTheDocument();
                });
               fireEvent.click(screen.getByTestId('status-filter'));
          
               await waitFor(() => {
                  expect(screen.getAllByRole("row")).toHaveLength(3);
                  expect(screen.getByText("SampleExam1")).toBeInTheDocument();
                  expect(screen.getByText('SampleExam2')).toBeInTheDocument();
          
                });
              });
                 
  
    it ('should delete an exam successfully when status is 204 and length is 1', async () => {

       
        const mockExamData = [{
            id:1,
            name: 'SampleExam1',
            scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
            candidate_count: 100,
            exam_duration: 120, // in minutes
            status: 0}];
          const mockExamListingResponse = {
            data: {
              results: mockExamData,
              next: null,
              previous: null,
              total_pages: 1,
              page_size: 10,
            },
          };
        examListing.mockResolvedValueOnce(mockExamListingResponse);
        deleteExamDetails.mockResolvedValueOnce({ status: 204 });
     render(<ExamList exams={[mockExamData[0]]} />);
        
        await waitFor(() => {
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('delete1'));

        
        expect(deleteExamDetails).toHaveBeenCalledWith(mockExamData[0].id);
        act(() => {
          jest.advanceTimersByTime(150)  
        });
      
    });  
    it ('should cancel an exam successfully when status is 200 and length is 1', async () => {

       
      const mockExamData = [{
          id:1,
          name: 'SampleExam1',
          scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
          candidate_count: 100,
          exam_duration: 120, // in minutes
          status: 1}];
        const mockExamListingResponse = {
          data: {
            results: mockExamData,
            next: null,
            previous: null,
            total_pages: 1,
            page_size: 10,
          },
        };
      examListing.mockResolvedValueOnce(mockExamListingResponse);
      cancelExam.mockResolvedValueOnce({ status: 200 });
   render(<ExamList exams={[mockExamData[0]]} />);
      
      await waitFor(() => {
          expect(screen.getByText("SampleExam1")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('cancel1'));
      await waitFor(() => {

        expect(screen.getByText('CONFIRM CANCEL')).toBeInTheDocument();
    });
     
    
  });  

   it('should delete an error toast when the status is not 204', async () => {

       
        const mockExamData = [{
            id:1,
            name: 'SampleExam1',
            scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
            candidate_count: 100,
            exam_duration: 120, // in minutes
            status: 0}];
          const mockExamListingResponse = {
            data: {
              results: mockExamData,
              next: null,
              previous: null,
              total_pages: 1,
              page_size: 10,
            },
          };
        examListing.mockResolvedValueOnce(mockExamListingResponse);
        deleteExamDetails.mockResolvedValueOnce({ status: 400 });
        render(<ExamList exams={[mockExamData[0]]} />);
        
        await waitFor(() => {
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('delete1'));

        
        expect(deleteExamDetails).toHaveBeenCalledWith(mockExamData[0].id);
       
    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(" Can't delete the exam");
      });
    });    
  
    it('should delete an error ', async () => {

       
        const mockExamData = [{
            id:1,
            name: 'SampleExam1',
            scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
            candidate_count: 100,
            exam_duration: 120, // in minutes
            status: 0}];
          const mockExamListingResponse = {
            data: {
              results: mockExamData,
              next: null,
              previous: null,
              total_pages: 1,
              page_size: 10,
            },
          };
        examListing.mockResolvedValueOnce(mockExamListingResponse);
        deleteExamDetails.mockRejectedValueOnce(new Error('Some error message'));
        render(<ExamList exams={[mockExamData[0]]} />);
        
        await waitFor(() => {
            expect(screen.getByText("SampleExam1")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('delete1'));

        
        expect(deleteExamDetails).toHaveBeenCalledWith(mockExamData[0].id);
       
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Some error message');
          });
    });    
    it('handles pagination', async () => {
        const mockExamData = [
          {
            id: 1,
            name: 'SampleExam1',
            scheduled_time: '2024-01-31T12:00:00Z',
            candidate_count: 100,
            exam_duration: 120,
            status: 0,
          },
          
        ];
    
        const mockExamListingResponse = {
          data: {
            results: mockExamData,
            next: '/examate/exam/exam-list/?page=2',
            previous: null,
            total_pages: 2,
            page_size: 10,
          },
        };
    
       
        examListing.mockResolvedValueOnce(mockExamListingResponse);
        render(<ExamList />);
        await waitFor(() => {
          expect(screen.getByText('SampleExam1')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Next'));
        await waitFor(() => {
          expect(screen.getByText('2')).toBeInTheDocument();
        });
      });

      it('opens and closes the modal when the "Create Exam" button is clicked', async () => {
        const mockExamData = [{
          id:1,name: 'SampleExam1',
          scheduled_time: '2024-01-31T12:00:00Z', // UTC formatted date string
          candidate_count: 100,
          exam_duration: 120, // in minutes
          status: 0},
          {
              id:2,name: 'SampleExam2',
              scheduled_time: '2024-02-28T12:00:00Z', // UTC formatted date string
              candidate_count: 10,
              exam_duration: 110, // in minutes
              status: 1
          
      }];
      const mockExamListingResponse = {
          data: {
            results: mockExamData,
            next: null,
            previous: null,
            total_pages: 1,
            page_size: 10,
          },
        };
      examListing.mockResolvedValueOnce(mockExamListingResponse);
  

        render(<ExamList />);
        
        await waitFor(() => {
            expect(screen.queryByText('Create Exam')).toBeNull();
        });
        fireEvent.click(screen.getByTestId('create-exam'));
        await waitFor(() => {
            expect(screen.getByText('Create exam modal')).toBeInTheDocument();
        });
      });
  

});
