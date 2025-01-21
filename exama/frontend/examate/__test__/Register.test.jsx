import { act } from 'react-dom/test-utils';
import { render, screen ,fireEvent,waitFor, getByTestId, getByLabelText,getByRole} from '@testing-library/react';
import { registration } from '@/services/ApiServices';
import RegistrationForm from '@/components/Register/Register';
import { useEmail } from '@/context/emailcontext';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';



jest.mock('@/services/ApiServices', () => ({
    ...jest.requireActual('@/services/ApiServices'),
    registration: jest.fn()
  }));
  

jest.mock('@/context/emailcontext', () => ({
    useEmail: jest.fn(() => ({
      email: 'test@gmail.com',
      setEmailValue: jest.fn(),
    })),
  }));
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  }));

  jest.mock('@/context/otpcontext', () => ({
    useOtp: jest.fn(() => ({
      otp: 'mockedOtpValue',
      setOtpValue: jest.fn(),
      setOtpExpirationTime: jest.fn(),
    })),
  }));

describe('RegistrationForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    registration.mockClear();
  });

  test('renders the form fields correctly', () => {
    render(<RegistrationForm/>);
    
    expect(screen.getByTestId('name')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('address')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('confirm')).toBeInTheDocument();
    expect(screen.getByTestId('register')).toBeInTheDocument();
  });

  test('validates name field on form submission', async () => {
    render(<RegistrationForm/>);
    
    const mockResponse={data:'Invalid Organization name'};
    registration.mockResolvedValueOnce(mockResponse)
    userEvent.type(screen.getByTestId('name'),'organization454');
    fireEvent.click(screen.getByText('Register')); 
    
    const errorMessage = await screen.findByText('Invalid organization name.');
    expect(errorMessage).toBeInTheDocument();
  
  });
  
  test('validates email field on form submission', async () => {
    render(<RegistrationForm/>);
    
    const mockResponse={data:'Please enter a valid email address.'};
    registration.mockResolvedValueOnce(mockResponse)
    userEvent.type(screen.getByTestId('email'),'tester@123.com');
    fireEvent.click(screen.getByText('Register')); 
    
    const errorMessage = await screen.findByText('Please enter a valid email address.');
    expect(errorMessage).toBeInTheDocument();
  
  });

  test('validates address field on form submission', async () => {
    render(<RegistrationForm />);
    
    const mockResponse={data:'Please enter a valid address.'};
    registration.mockResolvedValueOnce(mockResponse)
    userEvent.type(screen.getByTestId('address'),'879887');
    fireEvent.click(screen.getByText('Register')); 
    
    const errorMessage = await screen.findByText('Please enter a valid address.');
    expect(errorMessage).toBeInTheDocument();
  
  });

  test('validates contact field on form submission', async () => {
    render(<RegistrationForm />);
    
    const mockResponse={data:'Please enter a valid contact number.'};
    registration.mockResolvedValueOnce(mockResponse)
    userEvent.type(screen.getByTestId('contact'),'abcdefg');
    fireEvent.click(screen.getByText('Register')); 
    
    const errorMessage = await screen.findByText('Please enter a valid contact number.');
    expect(errorMessage).toBeInTheDocument();
  
  });
  test('validates password field on form submission', async () => {
    render(<RegistrationForm />);
    
    const mockResponse={data:'Please enter a valid password.The password should contain at least one lowercase letter,one uppercase letter,one digit,one special character among @, $, !, %, *, ?, or &password must consist of at least 8 characters long.'};
    registration.mockResolvedValueOnce(mockResponse)
    userEvent.type(screen.getByTestId('password'),'abcdefg');
    fireEvent.click(screen.getByTestId('register')); 
    
    const errorMessage = await screen.findByText('Please enter a valid password.The password should contain at least one lowercase letter,one uppercase letter,one digit,one special character among @, $, !, %, *, ?, or &password must consist of at least 8 characters long.');
    expect(errorMessage).toBeInTheDocument();
  
  });
  test('validates password field on form submission', async () => {
    render(<RegistrationForm/>);
   
    
    const mockResponse={data:'Passwords do not match'};
    registration.mockResolvedValueOnce(mockResponse)
    userEvent.type(screen.getByTestId('password'),'Abc@123')
    userEvent.type(screen.getByTestId('confirm'),'abcdefg');
    fireEvent.click(screen.getByText('Register')); 
    
    const errorMessage = await screen.findByText('Passwords do not match');
    expect(errorMessage).toBeInTheDocument();
  
  });

  test('submits the form successfully', async () => {
    registration.mockResolvedValueOnce({
      data: {
        message: 'Registered Successfully You got an OTP please verify that For complete the process.',
      },
    });

    const { getByTestId, getByText } = render(<RegistrationForm />);

    fireEvent.change(getByTestId('name'), { target: { value: 'organization' } });
    fireEvent.change(getByTestId('email'), { target: { value: 'organization@gmail.com' } });
    fireEvent.change(getByTestId('address'), { target: { value: 'organization address' } });
    fireEvent.change(getByTestId('contact'), { target: { value: '9898989898' } });
    fireEvent.change(getByTestId('password'), { target: { value: 'Organization@123' } });
    fireEvent.change(getByTestId('confirm'), { target: { value: 'Organization@123' } });

    fireEvent.submit(getByTestId('register')); // Use getByTestId to get the form element

    await waitFor(() => {
      expect(registration).toHaveBeenCalledWith({
        username: 'organization',
        email: 'organization@gmail.com',
        address: 'organization address',
        contact_number: '9898989898',
        password: 'Organization@123',
        confirm_password: 'Organization@123',
      });

    });
  });
  // test('displays error message on registration failure', async () => {
   
  
  //   const mockResponse = new Error('Username already exists')
  //   registration.mockRejectedValueOnce(mockResponse);
  //   render(<RegistrationForm />);

  //   fireEvent.change(screen.getByTestId('name'), { target: { value: 'AkshayaSolutions' } });
  //   fireEvent.change(screen.getByTestId('email'), { target: { value: 'akshayasolutions@gmail.com' } });
  //   fireEvent.change(screen.getByTestId('address'), { target: { value: 'AkshayaSolutions' } });
  //   fireEvent.change(screen.getByTestId('contact'), { target: { value: '9089786756' } });
  //   fireEvent.change(screen.getByTestId('password'), { target: { value: 'Akshaya@123' } });
  //   fireEvent.change(screen.getByTestId('confirm'), { target: { value: 'Akshaya@123' } });
    


  //   fireEvent.click(screen.getByTestId('register'));

  //   await waitFor(() => {
  //     expect(screen.getByText(`Registration Failed!${mockResponse.message}`)).toBeInTheDocument();
  //   });
  // });
  test('should toggle password visibility from hidden to visible and vice versa', () => {
    render(<RegistrationForm />);

  
    const passwordInput = screen.getByTestId('password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);

  
    expect(passwordInput).toHaveAttribute('type', 'text');

   
    fireEvent.click(toggleButton);

    
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  test('should toggle confirm password visibility from hidden to visible and vice versa', () => {
    render(<RegistrationForm />);

  
    const confirm_passwordInput = screen.getByTestId('confirm');
    expect(confirm_passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByTestId('confirm-toggle');
    fireEvent.click(toggleButton);

  
    expect(confirm_passwordInput).toHaveAttribute('type', 'text');

   
    fireEvent.click(toggleButton);

    
    expect(confirm_passwordInput).toHaveAttribute('type', 'password');
  });
  });


  
