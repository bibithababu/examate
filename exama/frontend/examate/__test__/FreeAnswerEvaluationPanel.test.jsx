import React from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import FreeAnswerEvaluationPanel from "@/components/freeanswerevaluationpanel/FreeAnswerEvaluationPanel";
import { evaluationFinalSubmission, fetchCandidateFreeAnswersDetails } from "@/services/ApiServices";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


jest.mock('@/services/ApiServices', () => ({
  fetchCandidateFreeAnswersDetails: jest.fn(),
  evaluationFinalSubmission: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'candidate_id') {
        return 'test_candidate_id'
      }

    })
  }))
}))

jest.mock('next/navigation')
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION: { TOP_CENTER: jest.fn() },
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
    warning: jest.fn()
  },
}));


jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

// beforeEach(() => {
//   jest.clearAllMocks();
// });

describe('FreeAnswerEvaluationPanel', () => {

  test('component render', async () => {
    await act(async () => {
      render(<FreeAnswerEvaluationPanel />);
    });
    expect(screen.getByText('Evaluation Panel')).toBeInTheDocument()
    expect(screen.getByText('Question Description')).toBeInTheDocument()
    expect(screen.getByText('Candidate Answer')).toBeInTheDocument()
    expect(screen.getByText('Evaluation Panel')).toBeInTheDocument()

  })
  test('fetch free answer details', async () => {
    const mockResponse = {
      data: {
        results: [{
          id: 'test_id', question_mark: 5, question_description: 'Test question description', free_answer: 'Test answer', answer_key: 'Test answer key'
        }, {
          id: 'test_id2', question_mark: 5, question_description: 'Test question description2', free_answer: 'Test answer2', answer_key: 'Test answer key2'
        }],
        next: "next-link",
        previous: "previous-link"
      }
    }
    fetchCandidateFreeAnswersDetails.mockResolvedValue(mockResponse)
    await act(async () => {
      render(<FreeAnswerEvaluationPanel />);
    });
    expect(screen.getByText('Mark: 5')).toBeInTheDocument()
    expect(screen.getByText('Test question description')).toBeInTheDocument()
    expect(screen.getByText('Test answer')).toBeInTheDocument()
    expect(screen.getByText('Test answer key')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('previous-button'));
    fireEvent.click(screen.getByTestId('next-button'));

    fireEvent.click(screen.getByTestId('check-icon-button'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'The answer has been marked as correct',
        showConfirmButton: false,
        timer: 1500,
      });

    })

    fireEvent.click(screen.getByTestId('times-icon-button'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'The answer has been marked as incorrect',
        showConfirmButton: false,
        timer: 1500,
      });

    })
    fireEvent.click(screen.getByTestId('check-icon-button'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'The answer has been marked as correct',
        showConfirmButton: false,
        timer: 1500,
      });

    })


  })
  test('click times-icon first', async () => {
    const mockResponse = {
      data: {
        results: [{
          id: 'test_id', question_mark: 5, question_description: 'Test question description', free_answer: 'Test answer', answer_key: 'Test answer key'
        }, {
          id: 'test_id2', question_mark: 5, question_description: 'Test question description2', free_answer: 'Test answer2', answer_key: 'Test answer key2'
        }],
        next: "next-link",
        previous: "previous-link"
      }
    }
    fetchCandidateFreeAnswersDetails.mockResolvedValue(mockResponse)
    await act(async () => {
      render(<FreeAnswerEvaluationPanel />);
    });


    fireEvent.click(screen.getByTestId('times-icon-button'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'The answer has been marked as incorrect',
        showConfirmButton: false,
        timer: 1500,
      });

    })

    fireEvent.click(screen.getByTestId('check-icon-button'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'The answer has been marked as correct',
        showConfirmButton: false,
        timer: 1500,
      });

    })
    fireEvent.click(screen.getByTestId('times-icon-button'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'The answer has been marked as incorrect',
        showConfirmButton: false,
        timer: 1500,
      });

    })


  })

  test('click confirmation button in Swal dialog', async () => {
    const mockResponse = {
      data: {
        results: [{
          id: 'test_id', question_mark: 5, question_description: 'Test question description', free_answer: 'Test answer', answer_key: 'Test answer key'
        }],
        next: "next-link",
        previous: "previous-link"
      }
    };
    fetchCandidateFreeAnswersDetails.mockResolvedValue(mockResponse);

    await act(async () => {
      render(<FreeAnswerEvaluationPanel />);
    });


    fireEvent.click(screen.getByTestId('times-icon-button'));



    


    fireEvent.click(screen.getByText('Submit'));


    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    });


    await waitFor(() => {
     
      expect(evaluationFinalSubmission).toHaveBeenCalledWith([
        { candidate_answer_id: 'test_id', correct: false },

      ]);
    });

   

  });
 

  test('submission-error', async () => {
    jest.mock('sweetalert2', () => ({
      fire: jest.fn()
    }));
    
    const mockResponse = {
      data: {
        results: [{
          id: 'test_id', question_mark: 5, question_description: 'Test question description', free_answer: 'Test answer', answer_key: 'Test answer key'
        }],
        next: "next-link",
        previous: "previous-link"
      }
    };
    fetchCandidateFreeAnswersDetails.mockResolvedValue(mockResponse);
    evaluationFinalSubmission.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })

    await act(async () => {
      render(<FreeAnswerEvaluationPanel />);
    });


    fireEvent.click(screen.getByTestId('times-icon-button'));



   

    fireEvent.click(screen.getByText('Submit'));


    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    });




    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 });

    });

   

  });
  test('response status 204', async () => {
    const mockResponse = {
      status: 204,
    };
    fetchCandidateFreeAnswersDetails.mockResolvedValue(mockResponse);
    
    await act(async () => {
      render(<FreeAnswerEvaluationPanel />);
    });
  
    expect(useRouter().push).toHaveBeenCalledWith('evaluated-candidate-list');
  });

})
