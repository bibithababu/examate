import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import ExamDetails from "@/components/exam-details/exam-details";
import { useRouter, useSearchParams } from "next/navigation";
import { examDetails } from "@/services/ApiServices";

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (param) => ({ id: 123 }[param]),
  }),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@/context/ticketStatusContext', () => ({
  useTicketStatus: jest.fn().mockReturnValue({
    ticketStatusCount: { approvedCount: 10 }, 
    updateTicketStatusCount: jest.fn(), 
  }),
}));


jest.mock("@/services/ApiServices", () => ({
  examDetails: jest.fn().mockResolvedValueOnce({
    data: {
      name: "Test Exam",
      scheduled_time: "2024-03-01T15:40:00.000Z",
      candidate_count: 5,
      subjects: [],
      status: 1,
    },
  }),
  
}));

describe("ExamDetails component", () => {
  test("renders exam details correctly", async () => {
    const mockExamData = {
      name: "Sample Exam",
      scheduled_time: "2024-02-08T10:00:00",
      subjects: [{ subjectname: "Math" }, { subjectname: "Science" }],
      status: 0,
    };
    const mockCount = 10;
    const mockExamId = "123";

    const useRouterMock = {
      push: jest.fn(),
    };
    jest
      .spyOn(require("next/router"), "useRouter")
      .mockReturnValue(useRouterMock);

    jest.mock("@/services/ApiServices", () => ({
      examDetails: jest.fn().mockResolvedValue({ data: mockExamData }),
    }));

    render(<ExamDetails examid={mockExamId} count={mockCount} />);

    expect(screen.getByTestId("exam-name")).toBeInTheDocument();
    expect(screen.getByTestId("scheduled-date-value")).toBeInTheDocument();
    expect(screen.getByTestId("scheduled-time-value")).toBeInTheDocument();
    expect(screen.getByTestId("count")).toBeInTheDocument();
    expect(screen.getByTestId("subject")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toBeInTheDocument();
  });

  it("calls router.push with the correct exam ID when handleViewQuestions is called", async () => {
    const mockvalue = 123;
    const { router } = render(<ExamDetails id={123} />);

    const viewQuestionLink = screen.getByText("View question!");

    await userEvent.click(viewQuestionLink);

    expect(useRouter().push).toHaveBeenCalledWith(
      `examquestion-list?id=${mockvalue}`
    );
  });

  it("opens the modal when handleEdit is called", async () => {
    render(<ExamDetails id={123} />);
    const editIcon = screen.getByTestId("edit-icon");
    userEvent.click(editIcon);

  });

  it("calls router.push with the correct exam ID when handleFeedback is called", async () => {
    const mockvalue = 123;
    const { router } = render(<ExamDetails id={123} />);

    const feedbacklink = screen.getByText("View feedback!");

    await userEvent.click(feedbacklink);

    expect(useRouter().push).toHaveBeenCalledWith(
      `feedback-list?id=${mockvalue}`
    );
  });
  
});
