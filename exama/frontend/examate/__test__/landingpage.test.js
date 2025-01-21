import React from "react";
import { render } from "@testing-library/react";
import LandingPage from "@/app/landingpage/page";

describe("graph Component", () => {
  it("renders graph component correctly", () => {
    render(<LandingPage />);
  });
});
