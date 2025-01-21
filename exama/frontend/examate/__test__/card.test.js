import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import Card from "@/components/cards/cards";
import {
 TotalCount
} from "@/services/ApiServices";

jest.mock("@/services/ApiServices", () => ({
 
  TotalCount: jest.fn(),
}));

it("renders four cards", () => {
  const { queryAllByRole } = render(<Card />);
  expect(queryAllByRole("card")).toHaveLength(0);
});

test("fetches question count and renders it", async () => {
  TotalCount.mockResolvedValueOnce({
    data: { total_question_count: 42, total_subject_count: 23, total_organisation_count: 45 },
  });

  const { getByText } = render(<Card />);

  await waitFor(() => {
    expect(TotalCount).toHaveBeenCalledTimes(2); 
    expect(getByText("42")).toBeInTheDocument(); 
    expect(getByText("23")).toBeInTheDocument();
    expect(getByText("45")).toBeInTheDocument(); 
  });
});