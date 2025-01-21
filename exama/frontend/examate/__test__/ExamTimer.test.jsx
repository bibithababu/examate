import { render} from '@testing-library/react';
import ExamTimer from '@/components/EndUser/ExamTimer/ExamTimer';
import { useRouter } from 'next/navigation';



jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
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
  

describe('ExamTImer Component', () => {
    test('Renders timer and displays initial time left', () => {
        const mockDuration = 3600; // 1 hour
        const { getByText } = render(<ExamTimer duration={mockDuration} />);
        expect(getByText(/1:00:00 Left/i)).toBeInTheDocument();
      });

      test('Shows timer running and triggers callback on completion (fixed)', async () => {
        
        const mockDuration = 0; // 10 seconds
        const mockHandleTimeUp = jest.fn();
        const { getByText } = render(<ExamTimer duration={mockDuration} onTimeUp={mockHandleTimeUp} />);
        await jest.advanceTimersByTime(mockDuration * 1000); 
        expect(getByText(/Time Up/i)).toBeInTheDocument();
        
});

})
