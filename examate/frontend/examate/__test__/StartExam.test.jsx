import React from 'react';
import { render, screen , fireEvent,waitFor,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StartExam from '@/components/EndUser/StartExam/StartExam';
import Swal from 'sweetalert2';
import { scheduled_time } from '@/services/ApiServices';
import { useSearchParams,useRouter} from 'next/navigation';



jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

jest.mock('@/services/ApiServices', () => ({
  scheduled_time: jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ scheduled_time: '2024-02-07T12:00:00.000Z' }),
    })
  ),
}));
jest.mock('next/navigation', () => ({
  __esModule: true,
  useSearchParams: jest.fn(),
  useRouter: jest.fn(), // Add this line to mock useRouter
}));


describe('StartExam component', () => {

it('renders StartExam component', async () => {
  const mockSearchParams = {
    get: jest.fn().mockReturnValue('mockValue'),
  };
  useSearchParams.mockReturnValue(mockSearchParams);
  const { getByAltText, getByTestId } = render(<StartExam />);
  
  const startExamButton = getByTestId('start-exam');
  const examLogo = getByAltText('start exam logo');
  expect(startExamButton).toBeInTheDocument();
  expect(examLogo).toBeInTheDocument();
});

it('clicking on start exam button should navigate to exam timer if scheduled time is in the past', () => {
  const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

  // Mock fetchScheduledTime function to return a past scheduled time
  global.fetch = jest.fn().mockResolvedValueOnce({
    json: () => ({ scheduled_time: '2022-01-01T00:00:00Z' }),
  });

  render(<StartExam />);
  fireEvent.click(screen.getByTestId("start-exam"));
  expect(Swal.fire).not.toHaveBeenCalled();
  expect(mockRouter.push).toHaveBeenCalledWith(`/exam?id=mockValue&token=mockValue`);
});
test('start exam button click when scheduledTime is in the future', async () => {
    const mockCurrentTime = new Date();
    const mockScheduledTime = new Date(mockCurrentTime.getTime() + 60000); // Current time + 1 minute

    scheduled_time.mockResolvedValueOnce({ data: { scheduled_time: mockScheduledTime } });

    render(<StartExam />);
  
  await waitFor(() => {
    expect(scheduled_time).toHaveBeenCalled();      
  })
  const startExamButton = screen.getByTestId('start-exam');
  fireEvent.click(startExamButton);
  await waitFor(() => {
  expect(Swal.fire).toHaveBeenCalledWith({
    "icon": "warning",
    "text": `The exam will start at ${mockScheduledTime.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}. Please wait until then.`,
    "title": "Exam Not Started Yet!",
  });
});
});
});
  

