import React from "react";
import { render,fireEvent,waitFor,getByTestId ,getByText,screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import AddSubject from "@/components/Addsubjects/AddSubjects";
import { subjectAdding,subjectListing,subjectDeleting ,searchBySubject} from "@/services/ApiServices";
import { toast } from 'react-toastify'; 
import userEvent from "@testing-library/user-event";

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

jest.mock('@/services/ApiServices', () => ({
  ...jest.requireActual('@/services/ApiServices'),
  subjectAdding: jest.fn(),
  subjectListing: jest.fn(),
  subjectDeleting:jest.fn(),
  searchBySubject:jest.fn(),
}));

describe('AddSubject component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders AddSubject component correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AddSubject />);
    expect(getByText('Subjects')).toBeInTheDocument();
    expect(getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(getByText('Add subject +')).toBeInTheDocument();
  });

  it('fetches subjects on component mount and delete a subject', async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, subject_name: 'React', question_count: 0, exam_count: 0 },
          { id: 2, subject_name: 'Java', question_count: 0, exam_count: 0 },
        ],
        next: null,
        previous: null,
        total_pages: 1,
        page_size: 10,
      },
    };
    subjectListing.mockResolvedValueOnce(mockData);

    const { getByText } = render(<AddSubject />);
    await waitFor(() => {
      expect(subjectListing).toHaveBeenCalledWith('/examate/subjects/list/');
      expect(getByText('React')).toBeInTheDocument();
      expect(getByText('Java')).toBeInTheDocument();
    });
    const deleteButton = screen.getByTestId('delete1'); 
    fireEvent.click(deleteButton);
    expect(subjectDeleting).toHaveBeenCalledWith(1); 
  });

  it('adds a subject when the "Add" button is clicked', async () => {
    const mockResponse = { success: true };
    subjectAdding.mockResolvedValueOnce(mockResponse);

    const { getByText, getByPlaceholderText } = render(<AddSubject />);
    const addButton = getByText('Add subject +');
    fireEvent.click(addButton);

    const subjectInput = getByPlaceholderText('Enter subject name');
    fireEvent.change(subjectInput, { target: { value: 'New Subject' } });

    const addSubjectButton = getByText('Add');
    fireEvent.click(addSubjectButton);

    await waitFor(() => {
      expect(subjectAdding).toHaveBeenCalledWith({ subject_name: 'New Subject' });
      expect(toast.success).toHaveBeenCalledWith('Subject added successfully!');
    });
  });
  it('handles error when subject name is empty on adding', async () => {
    const mockResponse = { success: false, message: 'Please enter a subject name.' };
    subjectAdding.mockRejectedValueOnce(new Error(mockResponse.message));
  
    const { getByText } = render(<AddSubject />);
    const addButton = getByText('Add subject +');
    fireEvent.click(addButton);
  
    const addSubjectButton = getByText('Add');
    fireEvent.click(addSubjectButton);
    await waitFor(() => {
      expect(subjectAdding).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Please enter a subject name.")
    });
  });


  it('displays search results when a search term is entered', async () => {
    const mockSearchResults = {
      data: {
        results: [{ id: 1, subject_name: 'Search Result 1' }, { id: 2, subject_name: 'Search Result 2' }],
      },
    };
  searchBySubject.mockResolvedValueOnce(mockSearchResults);

  const { getByPlaceholderText, getByText } = render(<AddSubject />);
  const searchInput = getByPlaceholderText('Search...');
  fireEvent.change(searchInput, { target: { value: 'SearchTerm' } });

  await waitFor(() => {
    expect(searchBySubject).toHaveBeenCalledWith('SearchTerm');
    expect(getByText('Search Result 1')).toBeInTheDocument();
    expect(getByText('Search Result 2')).toBeInTheDocument();
  });
});
  it('handles no search results found', async () => {
    searchBySubject.mockRejectedValueOnce(new Error('No Subject found'))

    const { getByPlaceholderText } = render(<AddSubject />);
    const searchInput = getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'InvalidSearchTerm' } });

  await waitFor(() => {
    expect(searchBySubject).toHaveBeenCalledWith('InvalidSearchTerm');
    expect(screen.getByText('No subjects found.')).toBeInTheDocument();
    
  });
});


});






