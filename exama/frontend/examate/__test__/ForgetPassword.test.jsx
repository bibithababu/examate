import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { default as ForgetPassword } from "@/components/Forgetpassword/ForgetPassword";
import "@testing-library/jest-dom";
import { forgetPassword } from "@/services/ApiServices";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

jest.mock("@/context/emailcontext", () => ({
  useEmail: jest.fn(() => ({
    setEmailValue: jest.fn(),
    email: "test@gmail.com",
  })),
}));


jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
    info:jest.fn()
  },}))

jest.mock("@/context/otpcontext", () => ({
  useOtp: jest.fn(() => ({
    otp: "mockedOtpValue",
    setOtpValue: jest.fn(),
    setOtpExpirationTime: jest.fn(),
  })),
}));

jest.mock("@/services/ApiServices", () => ({
  ...jest.requireActual("@/services/ApiServices"),
  forgetPassword: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("ForgetPassword component", () => {
 
  test("component render", () => {
    render(<ForgetPassword />);
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email for a password reset OTP")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send OTP" })
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Sign in")).toBeInTheDocument();
  });


  test("component render and show successmessage", async() => {
    const { getByText, getByPlaceholderText, getByRole } = render(<ForgetPassword />);
    forgetPassword.mockResolvedValueOnce({
      status: 201,
      data: { message: "Password reset OTP sent successfully" },
    });
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email for a password reset OTP")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send OTP" })
    ).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Email"),{target:{value:"test@gmail.com"}})
    fireEvent.click(screen.getByText("Send OTP"))
    await waitFor(()=>{
      expect(getByText("Password reset OTP sent successfully")).toBeInTheDocument();
    })
    await waitFor(() => {
      expect(getByText("Password reset OTP sent successfully")).toHaveClass('text-success');
    });
  
  });

  test("submits the form and calls forgetPassword", async () => {
    const handleOnSubmitMock = jest.fn();
    render(<ForgetPassword />);
    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));

    await waitFor(() => {
      expect(handleOnSubmitMock).toHaveBeenCalled();
    });
  });

  test("submits the form only with valid data", () => {
    render(<ForgetPassword />);
    const handleOnSubmitMock = jest.fn();
    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    expect(handleOnSubmitMock).toHaveBeenCalled();
  });

  test("submits the form and call forgetpassword", () => {
    render(<ForgetPassword />);
    const handleOnSubmitMock = jest.fn();
    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    expect(handleOnSubmitMock).toHaveBeenCalled();
    expect(forgetPassword).toHaveBeenCalledWith({ email: "test@gmail.com" });
  });

  test("submits the form with invalid email address", async () => {

    
    render(<ForgetPassword />);
    const handleOnSubmitMock = jest.fn();
    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid email" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    expect(handleOnSubmitMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address.")
      ).toBeInTheDocument();
    });
  });

  test("submits the form and updates state on successful response", async () => {
    forgetPassword.mockResolvedValueOnce({
      status: 201,
      data: { message: "Password reset OTP sent successfully" },
    });
    const handleOnSubmitMock = jest.fn();
    render(<ForgetPassword />);
    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    await waitFor(() => {
      expect(
        screen.getByText("Password reset OTP sent successfully")
      ).toBeInTheDocument();
    });
    expect(handleOnSubmitMock).toHaveBeenCalled();
  });

  test("timer updates correctly on successful response", async () => {
    forgetPassword.mockResolvedValueOnce({
      status: 201,
      data: {
        message: "Password reset OTP sent successfully",
        expiration_time: "2023-12-19T04:38:52.640410Z",
      },
    });

    render(<ForgetPassword />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    await waitFor(() => {
      expect(
        screen.getByText("Password reset OTP sent successfully")
      ).toBeInTheDocument();
    });
  });

  test("submits the form and handles error response", async () => {
    forgetPassword.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
    const handleOnSubmitMock = jest.fn();
    render(<ForgetPassword />);

    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 });
    });

    expect(handleOnSubmitMock).toHaveBeenCalled();
  });



  test("submits the form and handles error response in swal", async () => {
    forgetPassword.mockRejectedValueOnce({ response: { data: { message: 'Mocked error',errorCode:"E10112" } } })
    const handleOnSubmitMock = jest.fn();
    render(<ForgetPassword />);

    screen.getByRole("form").onsubmit = handleOnSubmitMock;
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled()
    });

    expect(handleOnSubmitMock).toHaveBeenCalled();
  });

  test("submits the form and calls forgetPassword", async () => {
    const handleOnSubmitMock = jest.fn();
    render(<ForgetPassword />);
    forgetPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    await waitFor(() => {
      expect(screen.getByText("Sending OTP")).toBeInTheDocument();
    });
  });
});
