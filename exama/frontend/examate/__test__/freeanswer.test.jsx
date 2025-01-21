import React from 'react';
import '@testing-library/jest-dom'
import { render,screen,fireEvent,waitFor,act} from '@testing-library/react';
import AddFreeAnswerQuestion from '@/components/freeanswer/freeanswer';
import { toast } from 'react-toastify';
import { createquestion, subjectdropdownListing,updateQuestion } from '@/services/ApiServices';
import userEvent from '@testing-library/user-event';

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
    warning:jest.fn(),
    info:jest.fn()
  },
}));


jest.mock('@/services/ApiServices', () => ({
  createquestion: jest.fn(),
  updateQuestion:jest.fn(),
  subjectdropdownListing: jest.fn(() => Promise.resolve({ data: { results: [{  id: 1, subject_name: 'Subject A' }] } })),
}));





describe('AddFreeAnswer component', () => {
  
  


  it('updates difficulty level when selected', () => {
    render(<AddFreeAnswerQuestion formData={{}} />);
  
    
  
    
    const mediumDifficultyRadio = screen.getByLabelText('Medium');
    fireEvent.click(mediumDifficultyRadio);
  
    
    expect(screen.getByLabelText('Medium')).toBeChecked();
    expect(screen.getByLabelText('Easy')).not.toBeChecked();
  });


  
})



  it('handleDifficultyChange updates difficulty level in state', () => {
      const { getByLabelText } = render(<AddFreeAnswerQuestion />);
      
      const easyRadio = getByLabelText('Easy'); 
      fireEvent.click(easyRadio);
      
      expect(easyRadio).toBeChecked();
    
      const mediumRadio = getByLabelText('Medium'); 
      fireEvent.click(mediumRadio);
    
      expect(mediumRadio).toBeChecked();
    
      const hardRadio = getByLabelText('Hard'); 
      fireEvent.click(hardRadio);
    
      expect(hardRadio).toBeChecked();
   
   
    });

describe("AddFreeAnswer Component", () => {
 
  it("renders AddSingleAnswer component correctly", async () => {
    subjectdropdownListing.mockResolvedValueOnce({  data: { subject_name: 'Subject A' } });
    
      
    render(<AddFreeAnswerQuestion />);
    
    expect(subjectdropdownListing).toHaveBeenCalled()

    const subjectDropdown = screen.getByTestId("select-subject");
    expect(subjectDropdown).toBeInTheDocument();


    const easyRadioButton = screen.getByLabelText("Easy");
    const mediumRadioButton = screen.getByLabelText("Medium");
    const hardRadioButton = screen.getByLabelText("Hard");
    expect(easyRadioButton).toBeInTheDocument();
    expect(mediumRadioButton).toBeInTheDocument();
    expect(hardRadioButton).toBeInTheDocument();

  
    const marksInput = screen.getByPlaceholderText("Enter mark....");
    expect(marksInput).toBeInTheDocument();
    const questionDescriptionTextarea = screen.getByPlaceholderText("Add Your Question");
    expect(questionDescriptionTextarea).toBeInTheDocument();

    const submitButton = screen.getByText('Save');
    expect(submitButton).toBeInTheDocument();


  });



  it("handles input changes correctly", async () => {
    subjectdropdownListing.mockResolvedValueOnce({  data: { subject_name: 'Subject A' } });
    createquestion.mockResolvedValueOnce({data:{message:"Free answer question created successfully"}})
    
    const { getByTestId } = render(<AddFreeAnswerQuestion />);

  
    const dropdown = screen.getByRole('combobox', { name: /Select an option/i });
    fireEvent.change(dropdown, { target: { value: '1' } });
    fireEvent.click(screen.getByTestId("difficulty"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("marks"), { target: { value: 5 } });
    fireEvent.change(screen.getByTestId("question_description"), { target: { value: "Test question" } });
    
    userEvent.click(screen.getByLabelText('Easy'));

    expect(screen.getByTestId("difficulty")).toBeChecked();
    expect(screen.getByTestId("marks")).toHaveValue(5);
    expect(screen.getByTestId("question_description")).toHaveValue("Test question");
   
   
  });





  it('should populate input fields with data on update button click', async () => {
    updateQuestion.mockResolvedValueOnce({data:{message:"Updated successfully"}})
    const mockData = {
      id: 1,
      subject_id: 'subject_id_1',
      marks: 10,
      question_description: 'Sample question description',
      difficulty_level: '1',
      options:[
        {
          "options": "a",
          "is_answer": false
        },
        {
          "options": "g",
          "is_answer": false
        },
        {
          "options": "gsrtg",
          "is_answer": false
        },
        {
          "options": "fgdfg",
          "is_answer": true
        }
      ],
      answer: [
       {answer:"Sample answer"}
      ],
    };
    render(
      <AddFreeAnswerQuestion
        formData={{answer_type:1}}
        data={mockData}
        isUpdate={true}
       
      />
    );

    expect(screen.getByTestId('marks')).toHaveValue(mockData.marks);
    expect(screen.getByTestId('question_description')).toHaveValue(mockData.question_description);
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(updateQuestion).toHaveBeenCalled()
    });


  });

  it('should populate input fields with data on update button clickm and show error', async () => {
    updateQuestion.mockRejectedValueOnce('Mocked error')
    const mockData = {
      id: 1,
      subject_id: 'subject_id_1',
      marks: 10,
      question_description: 'Sample question description',
      difficulty_level: '1',
      options:[
        {
          "options": "a",
          "is_answer": false
        },
        {
          "options": "g",
          "is_answer": false
        },
        {
          "options": "gsrtg",
          "is_answer": false
        },
        {
          "options": "fgdfg",
          "is_answer": true
        }
      ],
      answer: [
        {answer:"Sample answer"}
       ],
    };
    render(
      <AddFreeAnswerQuestion
        formData={{answer_type:1}}
        data={mockData}
        isUpdate={true}
       
      />
    );

    expect(screen.getByTestId('marks')).toHaveValue(mockData.marks);
    expect(screen.getByTestId('question_description')).toHaveValue(mockData.question_description);
    fireEvent.click(screen.getByText('Update'));
  


  });

  test('displays validation errors on Save button click', async () => {
    render(<AddFreeAnswerQuestion />);

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
    
      expect(screen.getByText('Please select a subject.')).toBeInTheDocument();
      expect(screen.getByText('Question description is required')).toBeInTheDocument();
    });


})

test('displays validation errors on publish button click', async () => {
  render(<AddFreeAnswerQuestion />);

  fireEvent.click(screen.getByText('Publish'));
  await waitFor(() => {
  
    expect(screen.getByText('Please select a subject.')).toBeInTheDocument();
    expect(screen.getByText('Question description is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a difficulty level.')).toBeInTheDocument();
    expect(screen.getByText('Please enter the mark.')).toBeInTheDocument();
    expect(screen.getByText('Question description is required')).toBeInTheDocument();
   
  });


})

// test('submits the form successfully', async () => {
//   await act(async() =>{
//     render(<AddSingleAnswer />);
//   }) 

 
//   userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
//     fireEvent.click(screen.getByLabelText('Easy'));
//     fireEvent.change(screen.getByTestId('marks'), { target: { value: '5' } });
  
//     const input = screen.getAllByRole('textbox')[0]

//     await waitFor(async() => {
//       await userEvent.type(input, 'helloworld')
//       fireEvent.change(screen.getByTestId('delete-button'), { target: { value: 'Option 1' } });
  
//     fireEvent.click(screen.getByTestId('add-button'));
  
//     userEvent.type(screen.getByTestId('delete-button'), 'Option 2');
//     fireEvent.click(screen.getByTestId('add-button'));
  
//     fireEvent.click(screen.getByTestId('option-checkbox-0'));
   
//     })
  
    
 
 
//   await waitFor(() => {
//     fireEvent.click(screen.getByText('Save'));
//     expect(screen.getByText('Question created successfully')).toBeInTheDocument();
//   });
// })


it('handle successfull question drafted', async() => {

    createquestion.mockResolvedValueOnce({data:{message:"Question drafted successfully"}})
    await act(async() =>{
      render(<AddFreeAnswerQuestion />);
    })
  
  const input = screen.getAllByRole('textbox')[0]
  
  
  await waitFor(async()=>{
    await userEvent.type(input, 'helloworld')
    userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
    fireEvent.change(screen.getByTestId('marks'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Save'));
    expect(toast.success).toHaveBeenCalledWith("Question drafted successfully")
    
  }) 
  screen.debug(input)
  
  
   
  
  
  })
  

it('handle error in question drafted', async() => {

  createquestion.mockRejectedValue(new Error("Question draft failed"))
  await act(async() =>{
    render(<AddFreeAnswerQuestion />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  fireEvent.click(screen.getByText('Save'));
 
  
}) 

}) 

test('handle successfull question publish', async() => {

  createquestion.mockResolvedValueOnce({data:{message:"Question created successfully"}})
  await act(async() =>{
    render(<AddFreeAnswerQuestion />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloquestion')
  await userEvent.type(screen.getByTestId("answer"),"hello answer")
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  const input1 = screen.getByTestId('marks');
  await fireEvent.change(input1, {target:{value:42}});
  expect(input1).toHaveValue(42);

  userEvent.click(screen.getByTestId('difficulty'));
  expect(screen.getByTestId('difficulty')).toBeChecked();

  fireEvent.click(screen.getByText('Publish'));

  
}) 

})
 

test('handle question publish failure', async() => {

  createquestion.mockRejectedValue(new Error("Publish failed"))
  await act(async() =>{
    render(<AddFreeAnswerQuestion />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  await  fireEvent.change(screen.getByTestId('answer'), { target: { value: 'hello answer' } });
 

  const input1 = screen.getByTestId('marks');
  await fireEvent.change(input1, {target:{value:42}});
  expect(input1).toHaveValue(42);

  userEvent.click(screen.getByTestId('difficulty'));
  expect(screen.getByTestId('difficulty')).toBeChecked();

  fireEvent.click(screen.getByText('Publish'));
 
  
}) 

})




})
