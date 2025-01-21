import React from "react";
import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressBar from "@/components/progress_bar/progress_bar";
import { subjectPopularityCount } from "@/services/ApiServices";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
jest.mock("@/services/ApiServices", () => ({
  subjectPopularityCount: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, subject_name: "Math", percentage: 70 },
        { id: 2, subject_name: "Science", percentage: 50 },
      ],
    })
  ),
}));

describe("Progressbar Component", () => {
  it("renders Progressbar component correctly", () => {
    render(<ProgressBar />);
  });
  test("Renders progress bar for each subject and displays Add Subject button", async () => {
    render(<ProgressBar />);

    const subjectRows = await screen.findAllByRole("row");
    expect(subjectRows.length).toBe(1);

    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();

    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBe(2);
  });

  test("handleAddQuestion function pushes the correct route on button click", () => {
    const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    const { getByTestId } = render(<ProgressBar />);

    const addSubjectButton = getByTestId("addsubject");
    expect(addSubjectButton).toBeInTheDocument();
    expect(addSubjectButton).toHaveTextContent("Add Subjects +");

    fireEvent.click(addSubjectButton);

    expect(useRouter).toHaveBeenCalled();

    expect(mockRouter.push).toHaveBeenCalledWith("admin/addsubject");
  });
});
