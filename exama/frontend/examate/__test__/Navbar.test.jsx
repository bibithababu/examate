import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '@/components/navbar/Navbar';
import { TicketStatusProvider } from '@/context/ticketStatusContext';
import { getTicketStatusCounts,viewProfile } from '@/services/ApiServices';
import { useTicketStatus } from '@/context/ticketStatusContext';

jest.mock('@/context/ticketStatusContext', () => ({
    ...jest.requireActual('@/context/ticketStatusContext'),
    useTicketStatus: () => ({
      ticketStatusCount: {
        requestedCount:4,
        approvedCount:6,
        consumedCount:7
    },
      updateTicketStatusCount: jest.fn(),
      setTicketStatusCount:jest.fn()
    })
  }));

  jest.mock('@/context/receiverContext', () => ({
    useReceiver: jest.fn().mockReturnValue({
      clientId: 10 , 
      setClientValue: jest.fn(), 
    }),
  }));
  jest.mock('@/context/messageStatusContext', () => ({
    useMessageStatus: jest.fn().mockReturnValue({
      userId: 10 , 
      unRead:{
        messagesCount:10
      }
     
    }),
  }));

  jest.mock('@/context/consumerDetailsContext', () => ({
    useConsumer: jest.fn().mockReturnValue({
      consumerProfile: '1.jpg' ,
      adminProfile:'2.jpg' 
     
    }),
  }));


jest.mock("@/services/ApiServices", () => ({
    viewProfile:jest.fn(),
    getMessages: jest.fn(),
    updateMessagesReadStatus: jest.fn()

  }));


jest.mock("@/services/ApiServices", () => ({
  getTicketStatusCounts: jest.fn(),
  viewProfile:jest.fn(),
  getMessages: jest.fn(),
  updateMessagesReadStatus: jest.fn()

}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
  }),
}));



describe("Navbar component", () => {
  test("renders navbar with badge counts correctly", async () => {

    const mockHandleToggle = jest.fn()
    const mockHandleLogout = jest.fn()




    const { getByText, getByTestId } = render(
      <TicketStatusProvider >
        <Navbar isToggled={false}
          handleToggle={mockHandleToggle}
          handleLogout={mockHandleLogout}
          userType="consumer" />
      </TicketStatusProvider>
    )


    fireEvent.click(getByTestId("wallet-icon"))

    await waitFor(() => {
      expect(getByText('Pending').nextElementSibling.textContent).toBe("4");
      expect(getByText('Approved').nextElementSibling.textContent).toBe("6");
      expect(getByText('Consumed').nextElementSibling.textContent).toBe("7");

    });


  })

  test("renders navbar with chat click", async () => {
    const mockHandleToggle = jest.fn();
    const mockHandleLogout = jest.fn();

    viewProfile.mockResolvedValueOnce({ status: 201, data: { id: '123', username: 'testUser', profile_image: 'testImage' }});

    const { getByText, getByTestId } = render(
      <TicketStatusProvider >
        <Navbar isToggled={false} handleToggle={mockHandleToggle} handleLogout={mockHandleLogout} userType="consumer" />
      </TicketStatusProvider>
    );

    fireEvent.click(getByTestId('chat-icon'));

    await waitFor(() => {
      expect(getByText("No notifications found")).toBeInTheDocument();
    });
  });


  it('renders correctly and fetches ticket status counts', async () => {

    const mockedCounts = {
      requestedCount: 2,
      approvedCount: 3,
      consumedCount: 1
    };
    const ticketStatusContextValues = {
      ticketStatusCount: {
        requestedCount: 0,
        approvedCount: 0,
        consumedCount: 0
      },
      updateTicketStatusCount: getTicketStatusCounts()
    };

    const handleToggle = jest.fn();
    const handleLogout = jest.fn();
    const isToggled = false;
    const userType = 'consumer';

    const { getByTestId, getByText } = render(
      <TicketStatusProvider value={mockedCounts}>
        <Navbar
          isToggled={isToggled}
          handleToggle={handleToggle}
          handleLogout={handleLogout}
          userType={userType}
        />
      </TicketStatusProvider>
    );

    getTicketStatusCounts.mockResolvedValueOnce(mockedCounts);


    const walletIcon = getByTestId('wallet-icon');
    expect(walletIcon).toBeInTheDocument();

    await waitFor(() => {
      expect(getTicketStatusCounts).toHaveBeenCalled();
    })



  })
  it('renders correctly and fetches ticket status counts', async () => {
    const mockedCounts = {
      requestedCount: 4,
      approvedCount: 6,
      consumedCount: 7
    };


    const ticketStatusContextValues = {
      ticketStatusCount: {
        requestedCount: 5,
        approvedCount: 8,
        consumedCount: 9
      },
      updateTicketStatusCount: getTicketStatusCounts(),
      setTicketStatusCount: jest.fn(),
    };
    getTicketStatusCounts.mockResolvedValueOnce(mockedCounts);

    const handleToggle = jest.fn();
    const handleLogout = jest.fn();
    const isToggled = false;
    const userType = 'consumer';


    const { getByTestId, getByText } = render(
      <TicketStatusProvider value={ticketStatusContextValues}>
        <Navbar
          isToggled={isToggled}
          handleToggle={handleToggle}
          handleLogout={handleLogout}
          userType={userType}
        />
      </TicketStatusProvider>
    );




    const walletIcon = getByTestId('wallet-icon');
    expect(walletIcon).toBeInTheDocument();

    fireEvent.click(walletIcon);
    expect(getTicketStatusCounts).toHaveBeenCalled();
  });

})
