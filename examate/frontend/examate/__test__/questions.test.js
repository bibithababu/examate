import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Questions from "@/components/questions/questions";
import { useRouter } from "next/navigation";
import { subjectListing } from "@/services/ApiServices";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/services/ApiServices", () => ({
  subjectListing: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("Questions Component", () => {
  it("renders Questions component correctly", () => {
    render(<Questions />);
  });

  test("fetches subjects and updates state on mount", async () => {
    const mockSubjects = [
      {
        id: 1,
        subject_name: "Math",
        question_count: 10,
        created_at: "2024-03-07T00:00:00.000Z",
      },
    ];
    subjectListing.mockResolvedValueOnce({ data: { results: mockSubjects } });

    render(<Questions />);

    const subjectName = await screen.findByText(/Math/i);
    const questionCount = await screen.findByText(/10/i);

    expect(subjectName).toBeInTheDocument();
    expect(questionCount).toBeInTheDocument();
  });

  test("handleAddQuestion function pushes the correct route on button click", () => {
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<Questions />);

    const button = screen.getByRole("button", {
      name: /Add Questions \+/i,
    });
    fireEvent.click(button);

    expect(mockRouter.push).toHaveBeenCalledWith("admin/question-list");
  });
});
