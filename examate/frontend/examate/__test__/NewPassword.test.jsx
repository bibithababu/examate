import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewPassword from "@/components/Newpassword/NewPassword";
import { useEmail } from "@/context/emailcontext";
import { resetPassword } from "@/services/ApiServices";
import { useRouter } from "next/navigation";
import PasswordToggle from "@/components/Showpassword/Showpassword";

jest.mock("@/context/emailcontext", () => ({
  useEmail: jest.fn(() => ({
    email: "test@gmail.com",
    resetStatus: "active",
    setEmailValue: jest.fn(),
  })),
}));

jest.mock("@/context/otpcontext", () => ({
  useOtp: jest.fn(() => ({
    otp: "",
    setOtpValue: jest.fn(),
  })),
}));

jest.mock("@/services/ApiServices", () => ({
  resetPassword: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("NewPassword component", () => {
  test("renders the component", () => {
    render(<NewPassword />);
    expect(screen.getByText("Create New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" })
    ).toBeInTheDocument();
  });

  test("submits the form with valid data", async () => {
    resetPassword.mockResolvedValueOnce({
      status: 200,
      data: { message: "Password reset successfully" },
    });
    render(<NewPassword />);
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password@123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Password@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(
        screen.getByText("Password reset successfully")
      ).toBeInTheDocument();
    });
  });

  test("submits the form with invalid data", async () => {
    render(<NewPassword />);
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password321" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });
});

test("submits the form with password mismatch", async () => {
  render(<NewPassword />);
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await waitFor(() => {
    expect(
      screen.getByText(
        "This password is too short. It must contain at least 8 characters.Include one Uppercase and special characters among @,#,$,%"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Confirm Password is required")
    ).toBeInTheDocument();
  });
});

test("handles some error  from API", async () => {
  resetPassword.mockRejectedValueOnce(new Error("Some error"));
  render(<NewPassword />);
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "Password@123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "Password@123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await waitFor(() => {
    expect(screen.getByText("Network unable to connect to the server")).toBeInTheDocument();
  });
});


test("handles error response from API", async () => {
  resetPassword.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
  render(<NewPassword />);
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "Password@123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "Password@123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await waitFor(() => {
    expect(screen.getByText("Mocked error")).toBeInTheDocument();
  });
});

test("toggles password visibility", async () => {
  const showPassword = false;
  const setShowPassword = jest.fn();

  render(
    <PasswordToggle
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  );
  const toggleButton = screen.getByRole("button");

  fireEvent.click(toggleButton);
  expect(setShowPassword).toHaveBeenCalledWith(!showPassword);

  render(<NewPassword />);
  const passwordInput = screen.getByPlaceholderText("Password");
  fireEvent.click(toggleButton);
  expect(passwordInput).toHaveAttribute("type", "password");
});

test("toggles password visibility", async () => {
  render(<NewPassword />);
  const passwordInput = screen.getByPlaceholderText("Password");
  expect(passwordInput).toHaveAttribute("type", "password");
});

test("does not redirect when resetStatus is active", () => {
  render(<NewPassword />);

  expect(useEmail().resetStatus).toBe("active");
  expect(useEmail().setEmailValue).not.toHaveBeenCalled();
  expect(useRouter().push).not.toHaveBeenCalledWith("/forgetpassword");
});

test("redirects to /404 when resetStatus is inactive", () => {
  useEmail.mockReturnValue({
    email: "test@gmail.com",
    resetStatus: "inactive",
    setEmailValue: jest.fn(),
  });

  render(<NewPassword />);
  expect(useEmail().setEmailValue).not.toHaveBeenCalled();
  expect(useRouter().push).not.toHaveBeenCalled();
  expect(useEmail().resetStatus).toBe("inactive");
});
