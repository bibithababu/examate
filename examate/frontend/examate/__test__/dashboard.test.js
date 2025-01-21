import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Dashboard from "@/components/dashboard/dashboard";
import { useRouter } from "next/navigation";

 jest.mock("next/navigation", () => ({
   useRouter: jest.fn(),
 }));

describe("Dashboard Component", () => {
  it("renders Dashboard component correctly", () => {
    render(<Dashboard />);
  });
});
