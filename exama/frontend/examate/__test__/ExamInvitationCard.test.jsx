import React from "react";
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExamInvitationCard from "@/components/examinvitationcard/ExamInvitationCard";
import { addCandidateName, fetchExamDetailsByToken } from "@/services/ApiServices";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; 

jest.mock("@/services/ApiServices", () => ({
    fetchExamDetailsByToken:jest.fn(),
    addCandidateName: jest.fn(),
  }));
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
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

  jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));


  describe('ExamInvitationCard',()=>{
    test('renders and interacts with the card',async ()=>{
        fetchExamDetailsByToken.mockResolvedValue({
            status: 200,
            data: {
              name: 'Sample Exam',
              organization_name: 'Sample Organization',
              scheduled_time: '2025-01-20T12:00:00Z',
              exam_duration: 60,
              subjects: [{ subject_name: 'Subject 1' }],
              instructions: ['Instruction 1', 'Instruction 2'],
            },
          })

          addCandidateName.mockResolvedValue({
            status:200,
            data:{
                message:"Name Added successfully"
            }
          })
        await act(async () => {
            render(<ExamInvitationCard token="sampleToken" />);
          });
        await waitFor(()=>{
            expect(screen.getByText('Sample Exam', { selector: '.card-title.exam-title' })).toBeInTheDocument();
            expect(screen.getByText('Sample Organization has invited you to attend this exam')).toBeInTheDocument()
            expect(screen.getByText('60 minutes')).toBeInTheDocument()
            expect(screen.getByText('Subject 1')).toBeInTheDocument()
        })

        act(() => {
            fireEvent.click(screen.getByText('Go to Exam'));
          });

        expect(screen.getByText("Let's Sign You in")).toBeInTheDocument();
        expect(screen.getByPlaceholderText('name')).toBeInTheDocument();

        act(() => {
            fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John Wick' } });
            fireEvent.click(screen.getByText('Submit'));
          });

        await waitFor(() => {
            expect(screen.getByText('Instructions')).toBeInTheDocument();
           
            fireEvent.click(screen.getByLabelText('I have carefully read and understand the instructions provided, and I hereby accept and agree to abide by them.'));
          });

        await waitFor(()=>{
            expect(screen.getByLabelText('I have carefully read and understand the instructions provided, and I hereby accept and agree to abide by them.')).toBeChecked();
            expect(screen.getByText('Agree and Continue')).toBeEnabled();
        })
        fireEvent.click(screen.getByText('Agree and Continue'));
        await waitFor(() => {
            expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
          });


                                         
    })

    test("Name is already added",async()=>{
        const mockName = 'John Doe';
        const mockToken = 'mockToken';
        addCandidateName.mockResolvedValue({
          status: 202,
          data: {
            name: 'John Wick',
          },
        })

        await act(async () => {
            render(<ExamInvitationCard token={mockToken} />);

          });

          act(() => {
            fireEvent.click(screen.getByText('Go to Exam'));
          });

          expect(screen.getByText("Hi John Wick")).toBeInTheDocument();
        
    })

    test("Name is already added and its updating",async()=>{
      const mockName = 'John Doe';
      const mockToken = 'mockToken';
      addCandidateName.mockResolvedValue({
        status: 200,
        data: {
          message: 'Name Updated successfully',
        },
      })

      await act(async () => {
          render(<ExamInvitationCard token={mockToken} />);

        });

        act(() => {
          fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John Wick' } });
          fireEvent.click(screen.getByText('Submit'));
        });

       
       await waitFor(()=>{
        expect(toast.success).toHaveBeenCalledWith("Name Updated successfully", { 'autoClose': 2000 });
       })
      
      
  })

    test('Error in fetching exam details',async ()=>{
      fetchExamDetailsByToken.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
      await act(async () => {
        render(<ExamInvitationCard token="Sample token" />);

      });
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 });
    });
    })

  test('Internal Server error',async ()=>{
    fetchExamDetailsByToken.mockRejectedValueOnce("Server error")
    await act(async () => {
      render(<ExamInvitationCard token="Sample token" />);

    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network unable to connect to the server", { 'autoClose': 2000 });
  });
  })

  test('Error handling in onSubmit', async () => {
    addCandidateName.mockRejectedValueOnce('Error message');
  
    const mockToken = 'mockToken';
  
    await act(async () => {
      render(<ExamInvitationCard token={mockToken} />);
    });
  
    userEvent.type(screen.getByPlaceholderText('name'), 'John Doe');
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network unable to connect to the server", { 'autoClose': 2000 });
  });
  });

  test('Error handling in onSubmit by entering name', async () => {
    addCandidateName.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
  
    const mockToken = 'mockToken';
  
    await act(async () => {
      render(<ExamInvitationCard token={mockToken} />);
    });
  
    userEvent.type(screen.getByPlaceholderText('name'), 'John Doe');
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 });
  });
  });


  test('Network error', async () => {
    addCandidateName.mockRejectedValueOnce('Network error')
  
    const mockToken = 'mockToken';
  
    await act(async () => {
      render(<ExamInvitationCard token={mockToken} />);
    });
  
    userEvent.type(screen.getByPlaceholderText('name'), 'John Doe');
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network unable to connect to the server", { 'autoClose': 2000 });
  });
  });
  })


