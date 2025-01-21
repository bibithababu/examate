import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import Organization from "@/components/organization/organisation";
import { fetchConsumersDetails } from "@/services/ApiServices";
jest.mock("@/services/ApiServices", () => ({
  fetchConsumersDetails: jest.fn(),
}));

it("renders the organization ", () => {
  render(<Organization />);
});

test("renders organization data correctly", async () => {
  // Mock the response from fetchConsumersDetails
  const mockOrganizationData = [
    { id: 1, username: "Org1", date_joined: "2022-01-01" },
    { id: 2, username: "Org2", date_joined: "2022-02-01" },
    // Add more mock data as needed
  ];
  fetchConsumersDetails.mockResolvedValueOnce({
    data: { results: mockOrganizationData },
  });

  // Render the component
  const { getByText } = render(<Organization />);

  // Wait for the asynchronous data fetching to complete
  await waitFor(() => {
    expect(fetchConsumersDetails).toHaveBeenCalledTimes(2);
    // Assert that the component renders with the fetched data
    mockOrganizationData.forEach((user) => {
      expect(getByText(user.username)).toBeInTheDocument();
      expect(getByText(user.date_joined)).toBeInTheDocument();
    });
  });
});
