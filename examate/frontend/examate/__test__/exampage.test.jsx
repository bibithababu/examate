import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExamPage from '@/components/exam-questions/exampage';
import { examsubjectListing ,enduserservices} from '@/services/ApiServices';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


jest.mock('@/services/ApiServices');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(), // Add this line to mock useRouter
}));
describe('ExamPage', () => {
  test('render exam page ,navigates to next and previous questions and click submit', async() => {
    const mockSearchParams = {
      get: jest.fn().mockReturnValue('mockValue'),
    };
    useSearchParams.mockReturnValue(mockSearchParams);
    enduserservices.fetchdecodedcandidate.mockResolvedValue({
      data:{
        "candidate_id": 24,
        "candidate_name": "Nived",
        "exam_id": 32,
        "exam_name": "unit test",
        "status": 1
    }
    })

    examsubjectListing.mockResolvedValue({
        data: {
          "count": 2,
          "next": null,
          "previous": null,
          "results": [
              {
                  "id": 8,
                  "subject": "java",
                  "question_count": 3,
                  "time_duration": 3
              },
              {
                  "id": 9,
                  "subject": "python",
                  "question_count": 3,
                  "time_duration": 3
              }
          ]
      },
      });
      enduserservices.examquestionsListing.mockResolvedValue({
        data: {
          "count": 3,
          "next": null,
          "previous": null,
          "results": [
              {
                  "id": 1,
                  "question_description": "what is java?",
                  "answer_type": 3,
                  "options": []
              },
              {
                  "id": 4,
                  "question_description": "what about java",
                  "answer_type": 2,
                  "options": [
                      {
                          "id": 5,
                          "options": "a",
                          "is_answer": false
                      },
                      {
                          "id": 6,
                          "options": "b",
                          "is_answer": true
                      },
                      {
                          "id": 7,
                          "options": "c",
                          "is_answer": true
                      },
                      {
                          "id": 8,
                          "options": "d",
                          "is_answer": false
                      }
                  ]
              },
              {
                  "id": 3,
                  "question_description": "what is this?",
                  "answer_type": 1,
                  "options": [
                      {
                          "id": 1,
                          "options": "java",
                          "is_answer": true
                      },
                      {
                          "id": 2,
                          "options": "python",
                          "is_answer": false
                      },
                      {
                          "id": 3,
                          "options": "react",
                          "is_answer": false
                      },
                      {
                          "id": 4,
                          "options": "django",
                          "is_answer": false
                      }
                  ]
              }
          ]
      }
      });
      render(<ExamPage />);
      await waitFor(() => {
        expect(examsubjectListing).toHaveBeenCalled();
        expect(enduserservices.fetchdecodedcandidate).toHaveBeenCalled();
      });

    expect(screen.getByText('Q : what is java?')).toBeInTheDocument();
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(screen.getByText('Q : what about java')).toBeInTheDocument();
    screen.debug()
    const prevButton = screen.getByText('previous');
    fireEvent.click(prevButton);
    expect(screen.getByText('Q : what is java?')).toBeInTheDocument();
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await waitFor(() => {fireEvent.click(screen.getByText('Confirm Submission'));});
    fireEvent.click(screen.getByText('Yes'));


  });


});
