import Payment from "@/components/TicketPurchase/Payment/Payment";
import { buyTicket } from "@/services/ApiServices";
import {  toast } from 'react-toastify';
import { render, screen ,fireEvent,waitFor, getByTestId, getByLabelText,getByRole} from '@testing-library/react';
import { useRouter ,useSearchParams} from 'next/navigation';
import userEvent from '@testing-library/user-event';

jest.mock('@/services/ApiServices', () => ({
   
    buyTicket: jest.fn()
  }));
  jest.mock('react-toastify', () => ({
    ...jest.requireActual('react-toastify'),
    toast: {
      POSITION:{TOP_CENTER:jest.fn()},
      success: jest.fn(),
      error: jest.fn(),
      dismiss: jest.fn(),
    },
  }));

  jest.mock('next/navigation');
  jest.mock('next/navigation', () => ({
      useSearchParams: jest.fn(),
      useRouter: jest.fn(), 
    }));
    jest.mock('@/context/ticketStatusContext', () => ({
      useTicketStatus: jest.fn().mockReturnValue({
        ticketStatusCount: { approvedCount: 10 }, 
        updateTicketStatusCount: jest.fn(), 
      }),
    }));
  
    
  describe(' Payment Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders the form fields correctly', () => {
        render(<Payment/>);
        expect(screen.getByTestId('holder')).toBeInTheDocument();
        expect(screen.getByTestId('card')).toBeInTheDocument();
        expect(screen.getByTestId('expiry')).toBeInTheDocument();
        expect(screen.getByTestId('cvv')).toBeInTheDocument();
        expect(screen.getByTestId('pay')).toBeInTheDocument();
      });
      test('Required fields validation', async () => {
        const { getByTestId, getByText } = render(<Payment />);
    
        const submitButton = getByTestId('pay');
        fireEvent.click(submitButton);
        await waitFor(() => {
        expect(screen.getByText('Cardholder Name is required')).toBeInTheDocument();
        expect(screen.getByText('Card Number is required')).toBeInTheDocument();
        expect(screen.getByText('Expiry date is required')).toBeInTheDocument();
        expect(screen.getByText('CVV is required')).toBeInTheDocument();
    });

    });
 
  test('validates name field on form submission', async () => {
    render(<Payment/>);
    
    userEvent.type(screen.getByTestId('holder'),'organization454');
    fireEvent.click(screen.getByTestId('pay')); 
    
    const errorMessage = await screen.findByText('Cardholder Name must contain only letters');
    expect(errorMessage).toBeInTheDocument();
  
  });
  test('Card number validation', async () => {
    const { getByTestId, getByText } = render(<Payment />);

    const cardNumberInput = getByTestId('card');
    fireEvent.change(cardNumberInput, { target: { value: '12345' } }); 
    const submitButton = getByTestId('pay');
    fireEvent.click(submitButton);
    await waitFor(() => {
    expect(getByText('Card Number must be a 16-digit number')).toBeInTheDocument();
    })
   ;
});
test('cvv number validation', async () => {
  const { getByTestId, getByText } = render(<Payment />);

  const cardNumberInput = getByTestId('cvv');
  fireEvent.change(cardNumberInput, { target: { value: '12345' } }); 
  const submitButton = getByTestId('pay');
  fireEvent.click(submitButton);
  await waitFor(() => {
  expect(getByText('CVV must be a 3-digit number')).toBeInTheDocument();
  })
})
 ;
 test('displays error for required expiry format', async () => {
  const { getByTestId, findByText } = render(<Payment />);
  const expiryInput = getByTestId('expiry');
  fireEvent.change(expiryInput, { target: { value: '' } });
  fireEvent.blur(expiryInput);
  const submitButton = getByTestId('pay');
  fireEvent.click(submitButton);
  const errorMessage = await findByText('Expiry date is required');
  await waitFor(() => {
  expect(errorMessage).toBeInTheDocument();
  })
});
 test('displays error for invalid expiry format', async () => {
  const { getByTestId, findByText } = render(<Payment />);
  const expiryInput = getByTestId('expiry');
  fireEvent.change(expiryInput, { target: { value: '022023' } });
  fireEvent.blur(expiryInput);
  const submitButton = getByTestId('pay');
  fireEvent.click(submitButton);
  const errorMessage = await findByText('Expiry date must be in the future');
  await waitFor(() => {
 
  expect(errorMessage).toBeInTheDocument();
  })
});
test('displays error for invalid month', async () => {
  const { getByTestId, findByText } = render(<Payment />);
  const expiryInput = getByTestId('expiry');
  fireEvent.change(expiryInput, { target: { value: '13/2025' } });
  fireEvent.blur(expiryInput);
  const submitButton = getByTestId('pay');
  fireEvent.click(submitButton);
  const errorMessage = await findByText('Invalid month');
  await waitFor(() => {
  expect(errorMessage).toBeInTheDocument();
  })
});
test('displays error for missing year', async () => {
  const { getByTestId, findByText } = render(<Payment />);
  const expiryInput = getByTestId('expiry');
  fireEvent.change(expiryInput, { target: { value: '02/' } });
  fireEvent.blur(expiryInput);
  const submitButton = getByTestId('pay');
  fireEvent.click(submitButton);
  const errorMessage = await findByText('Expiry date must contain both month and year');
  await waitFor(() => {
  expect(errorMessage).toBeInTheDocument();
  })
});
test('displays modal after successful payment', async () => {
  const mockRouter = {
    push: jest.fn(),
  };
  useRouter.mockReturnValue(mockRouter);
  const mockSearchParams = {
    get: jest.fn().mockReturnValue('mockValue'),
  };
  useSearchParams.mockReturnValue(mockSearchParams);
  jest.mock('@/services/ApiServices', () => ({
    buyTicket: mockBuyTicket,
  }));

  const { getByTestId, findByText } = render(<Payment />);
  const payButton = getByTestId('pay');
  fireEvent.change(getByTestId('expiry'), { target: { value: '11/2027' } });
  fireEvent.blur(getByTestId('expiry'));
  fireEvent.change(getByTestId('holder'), { target: { value: 'Organization' } });
  fireEvent.blur(getByTestId('holder'));
  fireEvent.change(getByTestId('card'), { target: { value: '1234567890123456' } });
  fireEvent.blur(getByTestId('card'));
  fireEvent.change(getByTestId('cvv'), { target: { value: '456' } });
  fireEvent.blur(getByTestId('cvv'));

 
  fireEvent.click(payButton);

  await waitFor(() => {
    expect(getByTestId('modal')).toBeInTheDocument();
  });
  const modalTitle = await findByText('Payment Successful');
  expect(modalTitle).toBeInTheDocument();
  const okButton = getByTestId('modal ok');
  fireEvent.click(okButton);
  expect(mockRouter.push).toHaveBeenCalledWith(`history`);
});

});
 

    
    