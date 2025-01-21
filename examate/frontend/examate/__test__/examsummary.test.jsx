import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExamSummary from  '@/components/exam-questions/examsummary';

describe('ExamSummary', () => {
  const questions = [
    {
      id: 1,
      question_description: 'Question 1',
      attempted: 1
    },
    {
      id: 2,
      question_description: 'Question 2',
      attempted: 0
    },
    {
      id: 3,
      question_description: 'Question 3',
      attempted: 1
    }
  ];

  const subject = 'Mathematics';
  const handleSubmitMock = jest.fn();

  test('renders summary ', () => {
    render(
      <ExamSummary
        questions={questions}
        subject={subject}
        handleSubmit={handleSubmitMock}
      />
    );

  });

});