import { render, screen, fireEvent, act,waitFor ,mockPush} from '@testing-library/react';
import { useRouter } from 'next/router';
 // Adjust the path based on your project structure
import { login,googleLogin, deviceRegister } from '@/services/ApiServices';
import { getByLabelText } from '@testing-library/react';
import Login from '@/components/login/login';
import { GoogleOAuthProvider,useGoogleLogin } from '@react-oauth/google';
import { handleErrorResponse } from '@/middlewares/errorhandling';

import * as GoogleOAuth from '@react-oauth/google';
import axios from 'axios'
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';








// Mock the next/router module


jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'), 
  useTranslation: () => ({ t: key => key })
}));

jest.mock("axios")

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
    warning:jest.fn()
  },
}));

jest.mock('@/services/ApiServices', () => ({
      login: jest.fn(), 
      deviceRegister:jest.fn(),
      googleLogin: jest.fn(),
      Notifications: {
        requestPermission: jest.fn(),
      },
  }));
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
  }));

  jest.mock('@/middlewares/errorhandling', () => ({
    errorhandling: jest.fn(),
  }));



  jest.mock('@/middlewares/errorhandling', () => ({
    errorhandling: jest.fn(),
  }));




describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(
        JSON.stringify({
          deviceIdToken:"DeviceIdToken"
        })
      ),
    };
    Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
  });


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


  it('renders login form and handles submission', async () => {
    const { getByPlaceholderText, getByText} = render( <GoogleOAuthProvider clientId='28601681894-qa3fqh5mb2rs7kn9lcj4nb9foe3tbih5.apps.googleusercontent.com'>

    

    
    <Login/>
    </GoogleOAuthProvider>);

    // Mock the API call
    login.mockResolvedValue({
      data: {
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      },
    });

    // Fill in the form
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    // Submit the form
    fireEvent.click(getByText('Login'));
    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));


    // Ensure that the login function is called with the correct data
    expect(login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'testpassword',
    });
  });

  it('toggles password visibility', async () => {
    const { getByPlaceholderText, getByTestId } = render( <GoogleOAuthProvider clientId='28601681894-qa3fqh5mb2rs7kn9lcj4nb9foe3tbih5.apps.googleusercontent.com'>

    
    <Login/>
    </GoogleOAuthProvider>);

    // Mock the API call
    login.mockResolvedValue({
      data: {
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      },
    });

    // Fill in the form
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    // Ensure the password is initially hidden
    expect(getByPlaceholderText('Password').type).toBe('password');

    // Click on the eye icon to toggle password visibility
    fireEvent.click(getByTestId('toggle-button'));

    // Ensure the password is now visible
    expect(getByPlaceholderText('Password').type).toBe('text');
  });
  it('toggles password visibility reverse', async () => {
    const { getByPlaceholderText, getByTestId } = render( <GoogleOAuthProvider clientId='28601681894-qa3fqh5mb2rs7kn9lcj4nb9foe3tbih5.apps.googleusercontent.com'>

    
    <Login/>
    </GoogleOAuthProvider>);

    // Mock the API call
    login.mockResolvedValue({
      data: {
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      },
    });

    // Fill in the form
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    // Ensure the password is initially hidden
    expect(getByPlaceholderText('Password').type).toBe('password');

    // Click on the eye icon to toggle password visibility
    fireEvent.click(getByTestId('toggle-button'));

    // Ensure the password is now visible
    expect(getByPlaceholderText('Password').type).toBe('text');
    fireEvent.click(getByTestId('toggle-button'));
    expect(getByPlaceholderText('Password').type).toBe('password');
  });
  it('renders loading section when loading is true', async () => {
    const { getByText,queryByTestId, getByTestId,container} = render(<GoogleOAuthProvider><Login loading={true} /></GoogleOAuthProvider>);

    // Check if loading section is present
    const loadingSection = container.querySelector('.loading-section');

    // Assert: Check if loading section is not present
    expect(queryByTestId('loading-section'));

    // You can add more assertions based on the actual content or structure of your loading section
  });

  it('renders login form and enters invalid email', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    const { getByPlaceholderText, getByText,queryByTestId} = render(<GoogleOAuthProvider><Login/></GoogleOAuthProvider>);

    // Mock the API call

    // Fill in the form
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test' } });
    fireEvent.blur(getByPlaceholderText('Email'));

    // Wait for any asynchronous validation to complete
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
    // authentication.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));

    // Wait for the form submission to complete
  });
  it('entering a invalid password', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    const { getByPlaceholderText, getByText,queryByTestId} = render(<GoogleOAuthProvider><Login/></GoogleOAuthProvider>);

    // Mock the API call

    // Fill in the form
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '' } });
    fireEvent.blur(getByPlaceholderText('Password'));

    // Wait for any asynchronous validation to complete
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(screen.getByText('Please enter a password.')).toBeInTheDocument();
    });
    // authentication.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));

    // Wait for the form submission to complete
  });

  it('initiates Google login', async () => {
    
    const useGoogleLoginSpy = jest.spyOn(GoogleOAuth, 'useGoogleLogin');
   
    
    const { getByText } = render(
      <GoogleOAuthProvider clientId='your-client-id'>
        <Login />
      </GoogleOAuthProvider>
    );

    const signupButton = getByText('Continue with Google');
    expect(signupButton).toBeInTheDocument();


    userEvent.click(getByText('Continue with Google'));

    await waitFor(() => {
      expect(useGoogleLogin).toHaveBeenCalled();
    });
  });  


  it('call Google login APi', async () => {

    googleLogin.mockResolvedValueOnce({
      status: 201,
      data: { message: "Login successful",
             access:"access token",
            refresh:"refresh token",
          role:1 },
    });


    jest.mock('@react-oauth/google', () => ({
      useGoogleLogin: jest.fn(),
    }));

   
   
    const mockGoogleUserInfoApi = 'mock-google-user-info-api';
    axios.get = jest.fn().mockResolvedValue({ data: {} });
    const mockTokenResponse = { access_token: 'mock-access-token' };
    const useGoogleLoginSpy = jest.spyOn(GoogleOAuth, 'useGoogleLogin');
    useGoogleLoginSpy.mockImplementation(() => ({onSuccess:jest.fn(()=>{
     
    })}));
   
    

  

  
    
  
    
    const { getByText } = render(
      <GoogleOAuthProvider clientId='your-client-id'>
        <Login />
      </GoogleOAuthProvider>
    );

    const signupButton = getByText('Continue with Google');
    expect(signupButton).toBeInTheDocument();


    userEvent.click(getByText('Continue with Google'));

    await waitFor(() => {
      expect(useGoogleLogin).toHaveBeenCalled();
      expect(useGoogleLoginSpy).toHaveBeenCalledWith(expect.any(Object));
    
    
    });
   
  
  });  
 
  
 
 
})
