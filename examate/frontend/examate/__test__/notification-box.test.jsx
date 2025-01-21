import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getNotificationsList } from '@/services/ApiServices';
import NotificationDropdown from '@/components/notification-box/notification-box';


jest.mock('@/services/ApiServices');


describe('NotificationDropdown component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders notifications successfully', async () => {
    const mockNotifications = [
      { id: 1, title: 'Notification 1', body: 'Notification body 1', created_at: new Date().toISOString(), status: 0 },
      { id: 2, title: 'Notification 2', body: 'Notification body 2', created_at: new Date().toISOString(), status: 1 },
    ];


    render(<NotificationDropdown notifications={mockNotifications} />);

    expect(screen.getByText('NOTIFICATIONS')).toBeInTheDocument();

    // Wait for notifications to be fetched and rendered
    const notification1Title = await screen.findByText('Notification 1');
    const notification2Title = await screen.findByText('Notification 2');

    expect(notification1Title).toBeInTheDocument();
    expect(notification2Title).toBeInTheDocument();
  });

  test('renders "No notifications found" when there are no notifications', async () => {
    getNotificationsList.mockResolvedValueOnce({ data: { results: [] } });

    render(<NotificationDropdown />);

    expect(await screen.findByText('No notifications found')).toBeInTheDocument();
  });


//   test('clicking on "more info" button navigates to correct page', async () => {
//     const mockNotifications = [
//       { id: 1, title: 'Notification 1', body: 'Notification body 1', created_at: new Date().toISOString(), status: 0 },
//     ];
//     getNotificationsList.mockResolvedValueOnce({ data: { results: mockNotifications } });

//     const pushMock = jest.fn();
//     jest.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));

//     render(<NotificationDropdown />);

//     const moreInfoButton = await screen.findByText('more info');
//     fireEvent.click(moreInfoButton);

//     expect(pushMock).toHaveBeenCalledWith('/');
//   });

  // Add more test cases as needed for other functionalities
});
