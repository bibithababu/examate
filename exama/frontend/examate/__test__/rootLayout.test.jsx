import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExamateLayout from '@/components/rootLayout/rootLayout';
import { getMessaging } from 'firebase/messaging';
import { getNotificationsCount } from '@/services/ApiServices';


jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(),
  })),
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
    updateUnReadMessageCount:jest.fn(),
    setUserIdValue:jest.fn()
   
  }),
}));

jest.mock('@/context/consumerDetailsContext', () => ({
  useConsumer: jest.fn().mockReturnValue({
    setConsumerDetails:jest.fn()
   
  }),
}));

//   jest.mock('@/context/messageStatusContext', () => ({
//     useMessageStatus: jest.fn().mockReturnValue({
//       userId: 10 , 
//       unRead:{
//         messagesCount:10
//       }
     
//     }),
//   }));


jest.mock("@/services/ApiServices", () => ({
  viewProfile:jest.fn(),
  getMessages: jest.fn(),
  updateMessagesReadStatus: jest.fn(),
  getNotificationsCount:jest.fn().mockResolvedValue({
    response:{
      data:{
        count:6
      }
    }
  })

}));




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



describe('ExamateLayout component', () => {
  const dashboardContent = [
    { label: 'Dashboard', link: '/dashboard', icon: 'fa fa-dashboard' },
    { label: 'Profile', link: '/profile', icon: 'fa fa-user' },
    // Add more dashboard content as needed
  ];

  it('renders properly', () => {
    const { getByText, getByTestId } = render(
      <ExamateLayout dashboardContent={dashboardContent} userType="admin" >
        <div>Mock Child Component</div>
      </ExamateLayout>
    );

    expect(getByText('EXAMATE')).toBeInTheDocument();
    expect(getByText('Logout')).toBeInTheDocument();
    expect(getByTestId('logout')).toBeInTheDocument();
    expect(getByText('Mock Child Component')).toBeInTheDocument();
  },10000);

  it('toggles sidebar visibility when navbar toggle button is clicked', () => {
    const { getByTestId, getByText } = render(
      <ExamateLayout dashboardContent={dashboardContent}>
        <div>Mock Child Component</div>
      </ExamateLayout>
    );

    fireEvent.click(getByTestId('navbar-toggle-button'));

    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();

    fireEvent.click(getByTestId('navbar-toggle-button'));

  });

  it('logs out when logout button is clicked', () => {
    const { getByTestId } = render(
      <ExamateLayout dashboardContent={dashboardContent}>
        <div>Mock Child Component</div>
      </ExamateLayout>
    );

    fireEvent.click(getByTestId('logout'));

    // Check if localStorage is cleared and router is pushed to login page
  });
});
