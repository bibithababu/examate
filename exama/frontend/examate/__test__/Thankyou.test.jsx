import React from 'react';
import { render } from '@testing-library/react';
import ThankYouPage from '@/components/EndUser/ThankYou/ThankYou';

test('renders thank you message', () => {
  const { getByText } = render(<ThankYouPage />);
  const thankYouMessage = getByText(/Thank You for Your Feedback!/i);
  expect(thankYouMessage).toBeInTheDocument();
});

test('renders appreciation message', () => {
  const { getByText } = render(<ThankYouPage />);
  const appreciationMessage = getByText(/We appreciate you taking the time to provide us with your feedback./i);
  expect(appreciationMessage).toBeInTheDocument();
});