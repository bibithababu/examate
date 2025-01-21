import React from 'react';
import { render, screen, fireEvent , waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Question_list from '@/components/question-list/question-list';
import { questiontListing } from '@/services/ApiServices';// Adjust the import path accordingly

// Mock the API service functions used in your component
jest.mock('@/services/ApiServices', () => ({
  questiontDetail: jest.fn(),
  questiontListing: jest.fn(),
  deleteQuestion: jest.fn(),
}));
jest.mock('next/router', () => ({
  ...jest.requireActual('next/router'), // Use actual implementation for other functions
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Question_list Component', () => {
  
  test('renders without errors', async () => {
    render(<Question_list />);


  });

  // Add more test cases based on your component's functionality
  // ...

  // For example, you can test the click event on the "ADD QUESTION +" button
  test('opens modal when "ADD QUESTION +" button is clicked', async () => {
    render(<Question_list />);

    const addButton = screen.getByText('ADD QUESTION +');
    fireEvent.click(addButton);

    const modalHeader = await screen.findByText('ADD QUESTION +');
    
    expect(modalHeader).toBeInTheDocument();
  });
  test('handle filter button', async () => {
    // Arrange
    render(<Question_list/>);

    const filterButton = await screen.findByTestId('filter');
    fireEvent.click(filterButton);
    const modalHeader = await screen.findByText('Question filter');
    
    expect(modalHeader).toBeInTheDocument();
  });

  // test('handleQuestionClick opens question detail modal', async () => {
  //   questiontListing.mockResolvedValue({
  //     data: {
  //         count: 4,
  //         total_pages: 1,
  //         next : null,
  //         previous: null,
  //         results: [
  //             {
  //                 "id": 227,
  //                 "question_description": "what is ypur name"
  //             },
  //             {
  //                 "id": 229,
  //                 "question_description": "How can you swap the values of two numeric variables without using any other variables?"
  //             },
  //             {
  //                 "id": 230,
  //                 "question_description": "What variance is imposed on generic type parameters? How much control does Java give you over this?"
  //             },
  //             {
  //                 "id": 231,
  //                 "question_description": "What variance is imposed on generic type parameters? How much control does Java give you over this?"
  //             }
  //         ],
  //         page_size: 3
      
  //     },
  //   });
  //   // Arrange
  //   const { getByText, queryByText } = render(<Question_list/>);
  
  //   // Mocking the question data for simplicity
  //   const sampleQuestion = {
  //     "id": 227,
  //     "question_description": "what is ypur name"
  // }
  
  //   // Ensure that the question is present in the list
  //   expect(getByText(sampleQuestion.question_description)).toBeInTheDocument();
  
  //   // Act
  //   fireEvent.click(getByText(sampleQuestion.question_description)); // Click on the question
  
  // //   // Assert
  //   // Ensure that the question detail modal is opened with the correct question description
  //   await waitFor(() => {
  //     expect(getByText(sampleQuestion.question_description)).toBeInTheDocument();
  //   });
  
  //   // Close the modal
  //   fireEvent.click(queryByText('Close Modal Button')); // Replace with your modal close button's text or identifier
  // });

  test('handles pagination correctly', async () => {
    questiontListing.mockResolvedValue({
        data: {
          count: 4,
          total_pages: 1,
          next : null,
          previous: null,
          results: [
                {
                    "id": 227,
                    "question_description": "what is ypur name"
                },
                {
                    "id": 229,
                    "question_description": "How can you swap the values of two numeric variables without using any other variables?"
                },
                {
                    "id": 230,
                    "question_description": "What variance is imposed on generic type parameters? How much control does Java give you over this?"
                }
            ],
            "page_size": 3
        
        },
      });
    const{getByText}=render(<Question_list/>);


    const sampleQuestion = {
      "id": 227,
      "question_description": "what is ypur name"
  }
  await waitFor(() => {
    // Ensure that the question is present in the list
    expect(getByText(sampleQuestion.question_description)).toBeInTheDocument();
  });
    fireEvent.click(getByText(sampleQuestion.question_description)); // Click on the question
  
    // Assert
    // Ensure that the question detail modal is opened with the correct question description
    await waitFor(() => {
      expect(getByText(sampleQuestion.question_description)).toBeInTheDocument();
    });

    // Trigger pagination
    // Assert that the state has been updated correctly
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    // expect(screen.getByText('Page 2')).toHaveClass('active');

    // ... (you can add more assertions based on your component's behavior)
  });
  test('handles pagination correctly', async () => {
    questiontListing.mockResolvedValue({
        data: {
          count: 4,
          total_pages: 1,
          next : "http://localhost:8000/question/question-list/?page=2",
          previous: null,
          results: [
                {
                    "id": 227,
                    "question_description": "what is ypur name"
                },
                {
                    "id": 229,
                    "question_description": "How can you swap the values of two numeric variables without using any other variables?"
                },
                {
                    "id": 230,
                    "question_description": "What variance is imposed on generic type parameters? How much control does Java give you over this?"
                },
            ],
            "page_size": 3
        
        },
      });
    const{getByText}=render(<Question_list/>);
    await waitFor(() => {
        expect(screen.getByText("Next")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Next'));

  });

  test('handles clear filter button', async () => {
    questiontListing.mockResolvedValue({
        data: {
          count: 4,
          total_pages: 1,
          next : "http://localhost:8000/question/question-list/?page=2",
          previous: null,
          results: [
                {
                    "id": 227,
                    "question_description": "what is ypur name"
                },
                {
                    "id": 229,
                    "question_description": "How can you swap the values of two numeric variables without using any other variables?"
                },
                {
                    "id": 230,
                    "question_description": "What variance is imposed on generic type parameters? How much control does Java give you over this?"
                },
            ],
            "page_size": 3
        
        },
      });
    const{getByText}=render(<Question_list/>);
    await waitFor(() => {
        expect(screen.getByText("Clear Filter")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Clear Filter"));

  });
  it('should call handleSearch with the correct search key', async () => {
    const mockHandleSearch = jest.fn();
    render(<Question_list handleSearch={mockHandleSearch}/>)
    const searchInput = screen.getByPlaceholderText('Search...');
    userEvent.type(searchInput, 'testSearchKey');
    // expect(mockHandleSearch).toHaveBeenCalledWith('testSearchKey');

    // Verify that the handleSearch function is called with the correct search key
  });

  it('should call GetDraftedQuetsions and set the expected filter parameters', async () => {
    // Mock the fetchQuestions function
    const mockFetchQuestions = jest.fn();

    // Render the component with the mock function
    render(<Question_list GetDraftedQuetsions={mockFetchQuestions} />); // Pass fetchQuestions as a prop

    // Simulate clicking the button
    const draftedQuestionsButton = screen.getByTestId('drafted');
    fireEvent.click(draftedQuestionsButton);

  });

  // Add more test cases as needed
});