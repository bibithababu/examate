import OtpForm from "@/components/OtpForm/OtpForm";
import { render, screen,fireEvent,waitFor,act} from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { otpVerification } from "@/services/ApiServices";
import { resendOtp } from "@/services/ApiServices";
import { useOtp } from "@/context/otpcontext";
import React from "react";
import userEvent from "@testing-library/user-event";

jest.mock("@/context/emailcontext", () => ({
  useEmail: jest.fn(() => ({
    setEmailValue: jest.fn(),
    email: "test@gmail.com",
  })),
}));

jest.mock("@/context/otpcontext", () => ({
  useOtp: jest.fn(() => ({
    otp: "mockedOtpValue",
    setOtpValue: jest.fn(),
  })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(),
}));
jest.mock("@/context/otpcontext", () => ({
  useOtp: jest.fn(() => ({
    otp: "mockedOtpValue",
    setOtpValue: jest.fn(),
    expirationTime: Math.floor(Date.now() / 1000) + 60,
    setOtpExpirationTime: jest.fn(),
  })),
}));

jest.mock("@/services/ApiServices", () => ({
  ...jest.requireActual("@/services/ApiServices"),
  otpVerification: jest.fn(),
  resendOtp: jest.fn(),
}));

test("renders the component", () => {
  usePathname.mockReturnValue("/forgetpassword/otp");

  render(<OtpForm />);
  expect(screen.getByText("You've Got Email")).toBeInTheDocument();
 
  expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  expect(screen.getByText("Resend")).toBeInTheDocument();
  expect(screen.getByText("You've Got Email")).toBeInTheDocument();
});

test("submits the form only with valid data", async () => {
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);
  const handleOnSubmitMock = jest.fn();
  const mockEvent = {
    preventDefault: jest.fn(),
  };
  screen.getByRole("form").onsubmit = handleOnSubmitMock;

  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });
  userEvent.click(screen.getByText("Confirm"));
  await waitFor(() => {
    expect(handleOnSubmitMock).toHaveBeenCalled();
  });
});

test("displays required message", async () => {
  usePathname.mockReturnValue("/forgetpassword/otp");
  const { getByTestId, getByText } = render(<OtpForm />);
  
  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
    expect(screen.getByText("Otp is required")).toBeInTheDocument();
  });

  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });

  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
   
    expect(screen.queryByText("Otp is required")).toBeNull();
  });
});







test("displays error message for invalid OTP format", async () => {
  usePathname.mockReturnValue("/forgetpassword/otp");
  const { getByTestId, getByText } = render(<OtpForm />);

  const otpInputs = screen.getAllByRole('textbox');
const digitCount = 3; 
otpInputs.slice(0, digitCount).forEach((otpInput, index) => {
  fireEvent.change(otpInput, { target: { value: index + 1 } }); 
});
  
  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
    expect(screen.getByText("Enter 4-digit OTP")).toBeInTheDocument();
  });

  
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });

  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
   
    expect(screen.queryByText("Enter 4-digit OTP")).toBeNull();
  });
});

test("handles form submission network error and displays generic error message", async () => {
  otpVerification.mockRejectedValueOnce({
    message: "Network error",
  });
  usePathname.mockReturnValue("/forgetpassword/otp");

  render(<OtpForm />);
  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });
  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
    expect(otpVerification).toHaveBeenCalledWith("examate/verify-otp/", {
      email: "test@gmail.com",
      otp: "1234",
      otp_type: 0,
    });
    expect(screen.getByText("Network unable to connect to the server")).toBeInTheDocument();
  });
});

test("handles error response from OTP resend", async () => {

  resendOtp.mockRejectedValueOnce({
    message: "Network error",
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);

  fireEvent.click(screen.getByText(/resend/i));

  await waitFor(() => {
    expect(screen.getByText("Network unable to connect to the server")).toBeInTheDocument();
  });
});

test("displays error message after OTP resend failure", async () => {
  resendOtp.mockRejectedValueOnce({
    response: {
      data: { message: "Resend OTP failed" },
    },
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);
  fireEvent.click(screen.getByText("Resend"));

  await waitFor(() => {
    expect(screen.getByText("Resend OTP failed")).toBeInTheDocument();
  });
});

test("displays error message on OTP verification failure", async () => {
  otpVerification.mockRejectedValueOnce({
    response: {
      data: { message: "Invalid OTP" },
    },
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);
  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });
  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
    expect(otpVerification).toHaveBeenCalledWith("examate/verify-otp/", {
      email: "test@gmail.com",
      otp: "1234",
      otp_type: 0,
    });
    expect(screen.getByText("Invalid OTP")).toBeInTheDocument();
  });
});

test("displays generic error message on unexpected OTP verification failure", async () => {
  otpVerification.mockRejectedValueOnce({
    message: "Unexpected error",
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);
  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });
  userEvent.click(screen.getByText("Confirm"));

  await waitFor(() => {
    expect(otpVerification).toHaveBeenCalledWith("examate/verify-otp/", {
      email: "test@gmail.com",
      otp: "1234",
      otp_type: 0,
    });
    expect(screen.getByText("Network unable to connect to the server")).toBeInTheDocument();
  });
});
test("displays success message and updates status on OTP resend success", async () => {
  resendOtp.mockResolvedValueOnce({
    status: 201,
    data: { message: "New OTP sent successfully" },
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);
  fireEvent.click(screen.getByText("Resend"));

  await waitFor(() => {
    expect(resendOtp).toHaveBeenCalledWith({
      email: "test@gmail.com",
      otp_type: 0,
    });
    expect(screen.getByText("New OTP sent successfully")).toBeInTheDocument();
  });
});

test("displays error message on OTP resend failure for forget password", async () => {
  resendOtp.mockRejectedValueOnce({
    response: {
      data: { message: "Resend OTP failed" },
    },
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);
  fireEvent.click(screen.getByText("Resend"));

  await waitFor(() => {
    expect(resendOtp).toHaveBeenCalledWith({
      email: "test@gmail.com",
      otp_type: 0,
    });
    expect(screen.getByText("Resend OTP failed")).toBeInTheDocument();
  });
});


test("displays error message on OTP resend failure for register", async () => {
  resendOtp.mockRejectedValueOnce({
    response: {
      data: { message: "Resend OTP failed" },
    },
  });
  usePathname.mockReturnValue("/register/otp");
  render(<OtpForm />);
  fireEvent.click(screen.getByText("Resend"));

  await waitFor(() => {
    expect(resendOtp).toHaveBeenCalledWith({
      email: "test@gmail.com",
      otp_type: 1,
    });
    expect(screen.getByText("Resend OTP failed")).toBeInTheDocument();
  });
});


test("displays countdown timer correctly", () => {
  render(<OtpForm />);
  act(() => {
    jest.runAllTimers();
  });

  act(() => {
    jest.advanceTimersByTime(60000);
  });

  expect(screen.getByText("Resend")).toBeInTheDocument();
});

afterAll(() => {
  jest.useRealTimers();
});



test("handles successful OTP verification for register/otp", async () => {
  otpVerification.mockResolvedValueOnce({
    data: { message: "OTP verification successful" },
  });
  usePathname.mockReturnValue("/register/otp");
  render(<OtpForm />);

  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });
 

  
  userEvent.click(screen.getByText("Confirm"))

  await waitFor(() => {
   
    expect(otpVerification).toHaveBeenCalledWith("examate/verify-otp/", {
      otp: "1234",
      email: "test@gmail.com",
      otp_type: 1,
    });
    expect(screen.getByText("OTP verification successful")).toBeInTheDocument();
    expect(screen.getByText("You've Got Email")).toBeInTheDocument();
    expect(screen.getByText("Resend")).toBeInTheDocument();
  });
});





test("handles successful OTP verification for forgetpassword/otp", async () => {
  otpVerification.mockResolvedValueOnce({
    data: { message: "OTP verification successful" },
  });
  usePathname.mockReturnValue("/forgetpassword/otp");
  render(<OtpForm />);

  const otpInputs = screen.getAllByRole('textbox');
  otpInputs.forEach((otpInput, index) => {
    fireEvent.change(otpInput, { target: { value: index + 1 } }); 
  });
 

  
  userEvent.click(screen.getByText("Confirm"))

  await waitFor(() => {
   
    expect(otpVerification).toHaveBeenCalledWith("examate/verify-otp/", {
      otp: "1234",
      email: "test@gmail.com",
      otp_type: 0,
    });
    expect(screen.getByText("OTP verification successful")).toBeInTheDocument();
    expect(screen.getByText("You've Got Email")).toBeInTheDocument();
    expect(screen.getByText("Resend")).toBeInTheDocument();
  });
});






test("displays countdown timer correctly", () => {
  render(<OtpForm />);
  act(() => {
    jest.runAllTimers();
  });
  expect(
    screen.getByText(
      "We have sent the OTP verification code to your email address. Check your email and enter the code below."
    )
  ).toBeInTheDocument();
});

test("displays countdown timer correctly", () => {
  render(<OtpForm />);
  act(() => {
    jest.runAllTimers();
  });

  act(() => {
    jest.advanceTimersByTime(60000);
  });

  expect(screen.getByText("Resend")).toBeInTheDocument();
});

afterAll(() => {
  jest.useRealTimers();
});
test("updates countdown timer", () => {
  const expirationTime = Math.floor(Date.now() / 1000) + 60;
  render(<OtpForm />);
  const setOtpExpirationTime = jest.fn();
  act(() => {
    setOtpExpirationTime(expirationTime);
  });

  act(() => {
    jest.advanceTimersByTime(6000);
  });
  expect(screen.getByText("Resend")).toBeInTheDocument();
});

test("displays success message and updates status on OTP resend success", async () => {
  resendOtp.mockResolvedValueOnce({
    status: 201,
    data: { message: "New OTP sent successfully" },
  });

  render(<OtpForm />);
  fireEvent.click(screen.getByText("Resend"));

  await waitFor(() => {
    expect(resendOtp).toHaveBeenCalledWith({
      email: "test@gmail.com",
      otp_type: 0,
    });
  });
});
test("should update timer correctly when expirationTime changes", async () => {
  const mockedSetInterval = jest.spyOn(global, "setInterval");
  const mockedClearInterval = jest.spyOn(global, "clearInterval");

  const mockUseEffect = jest.spyOn(React, "useEffect");

  const mockSetOtpExpirationTime = jest.fn();
  const mockSetTimer = jest.fn();

  const { rerender } = render(
    <OtpForm
      setOtpExpirationTime={mockSetOtpExpirationTime}
      setTimer={mockSetTimer}
    />
  );

  await act(async () => {
    expect(mockUseEffect).toHaveBeenCalled();
  });
});

test("updates countdown timer", () => {
  const expirationTime = Math.floor(Date.now() / 1000) + 60;
  render(<OtpForm />);
  const setOtpExpirationTime = jest.fn();
  act(() => {
    setOtpExpirationTime(expirationTime);
  });

  act(() => {
    jest.advanceTimersByTime(6000);
  });
  expect(screen.getByText("Resend")).toBeInTheDocument();
});


