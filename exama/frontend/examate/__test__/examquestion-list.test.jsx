import React from "react";
import { render,fireEvent,waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";

import ExamQuestions from "@/components/examquestionlist/examquestionlist";
import {
  examDetails,
  examQuestions,
  regenerateQuestions,
} from "@/services/ApiServices";
jest.mock('@/services/ApiServices', () => ({
  examDetails: jest.fn(),
  examQuestions: jest.fn(),
  regenerateQuestions: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => "mocked-exam-id"), 
  })),
}));

describe('ExamQuestions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ExamQuestions />);
  });
  it("handles subject click correctly", async () => {
    const mockedSubjectId = "mocked-subject-id";
    const mockedSubject = { id: mockedSubjectId };

    examDetails.mockResolvedValueOnce({ data: { subjects: [mockedSubject] } });
    examQuestions.mockResolvedValueOnce({ data: { questions: [], answers: [] } });

    const { findByTestId } = render(<ExamQuestions />);

  
    const subjectButton = await findByTestId(`subject-button-0`);

    fireEvent.click(subjectButton);

    await waitFor(() => {
      expect(examQuestions).toHaveBeenCalledWith(mockedSubjectId);
    });
  });
  
  it('regenerates questions correctly', async () => {
    const mockedSubject = { id: 'mocked-subject-id', subject: 'mocked-subject' };

    examDetails.mockResolvedValueOnce({ data: { subjects: [mockedSubject],status:1 } });
    examQuestions.mockResolvedValueOnce({ data: { questions: [], answers: [] } });
    

    const { findByTestId } = render(<ExamQuestions />);
    const subjectButton = await findByTestId(`subject-button-0`);

    fireEvent.click(subjectButton);

    
    const regenerateButton = await findByTestId("regenerate-button");
  
    fireEvent.click(regenerateButton);

    await waitFor(() => {
      expect(regenerateQuestions).toHaveBeenCalledWith('mocked-exam-id', mockedSubject.subject);
      expect(examQuestions).toHaveBeenCalledWith(mockedSubject.id);
    });
  });
});
