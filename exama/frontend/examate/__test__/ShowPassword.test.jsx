import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordToggle from "@/components/Showpassword/Showpassword";

describe("PasswordToggle component", () => {
  test("toggles password visibility from false to true", () => {
    const setShowPasswordMock = jest.fn();
    render(
      <PasswordToggle
        showPassword={false}
        setShowPassword={setShowPasswordMock}
        showConfirmPassword={false}
        setShowConfirmPassword={jest.fn()}
      />
    );

    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(setShowPasswordMock).toHaveBeenCalledWith(true);
  });
  test("toggles password visibility from true to false", () => {
    const setShowPasswordMock = jest.fn();
    render(
      <PasswordToggle
        showPassword={true}
        setShowPassword={setShowPasswordMock}
        showConfirmPassword={true}
        setShowConfirmPassword={jest.fn()}
      />
    );

    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(setShowPasswordMock).toHaveBeenCalledWith(false);
  });

  test("toggles confirm password visibility from true to false", () => {
    const setConfirmShowPasswordMock = jest.fn();
    render(
      <PasswordToggle
        showPassword={true}
        isConfirmPassword={true}
        setShowPassword={jest.fn()}
        showConfirmPassword={true}
        setShowConfirmPassword={setConfirmShowPasswordMock}
      />
    );

    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(setConfirmShowPasswordMock).toHaveBeenCalledWith(false);
  });

  test("toggles confirm password visibility from false to true", () => {
    const setConfirmShowPasswordMock = jest.fn();
    render(
      <PasswordToggle
        showPassword={false}
        isConfirmPassword={true}
        setShowPassword={jest.fn()}
        showConfirmPassword={false}
        setShowConfirmPassword={setConfirmShowPasswordMock}
      />
    );

    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(setConfirmShowPasswordMock).toHaveBeenCalledWith(true);
  });
});
