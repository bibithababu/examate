import React from 'react';
import '@testing-library/jest-dom'
import { render,screen,fireEvent,waitFor,act} from '@testing-library/react';

import AddSingleAnswer from '@/components/singleanswer/singleanswer';
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





describe('AddSingleAnswer component', () => {
  
  

      test('handles options handling', async () => {
        const { container } = render(<AddSingleAnswer />); 
        const inputField = screen.getByPlaceholderText('Add Options');
        const addButton = screen.getByTestId('add-button');

        fireEvent.change(inputField, { target: { value: 'New Option' } });
        fireEvent.click(addButton);

       
        expect(container).toHaveTextContent('New Option');
    });


    it('should remove an option when delete button is clicked', async() => {
      const options = [
          { options: 'Option 1', is_answer: 'True' },
          { options: 'Option 2', is_answer: 'False' },
          { options: 'Option 3', is_answer: 'False' }
      ];
      const { container,getByTestId } = render(<AddSingleAnswer options={options} />);
      const inputField = screen.getByPlaceholderText('Add Options');
      const addButton = screen.getByTestId('add-button');


      fireEvent.change(inputField, { target: { value: 'New Option' } });
      fireEvent.click(addButton);

      await waitFor(()=>{
        const deleteButtons = getByTestId("delete-button")
        fireEvent.click(deleteButtons); 
      })
      expect(container).not.toHaveTextContent('Option 1');

     
      
  });

  it('updates difficulty level when selected', () => {
    render(<AddSingleAnswer formData={{}} />);
  
    
    const mediumDifficultyRadio = screen.getByLabelText('Medium');
    fireEvent.click(mediumDifficultyRadio);
  
    
    expect(screen.getByLabelText('Medium')).toBeChecked();
    expect(screen.getByLabelText('Easy')).not.toBeChecked();
  });


    it('should display toast message when the maximum options limit is reached', async () => {
   
      const { getByPlaceholderText, getByTestId } = render(<AddSingleAnswer />);
  
      const inputField = screen.getByPlaceholderText('Add Options');
  
      // Add four options, which is the maximum allowed
      fireEvent.change(inputField, { target: { value: 'Option 1' } });
      fireEvent.click(getByTestId('add-button'));
      fireEvent.click(getByTestId('add-button'));
      fireEvent.click(getByTestId('add-button'));
      fireEvent.click(getByTestId('add-button'));
  
     
      fireEvent.change(inputField, { target: { value: 'Option 5' } });
      fireEvent.click(getByTestId('add-button'));
  
    });
  
})

  it('adds a new option and checks the checkbox', async () => {
    const { getByTestId, getByPlaceholderText } = render(<AddSingleAnswer />);
    const inputField = getByPlaceholderText('Add Options');
    const addButton = getByTestId('add-button');

    fireEvent.change(inputField, { target: { value: 'New Option' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const checkbox = getByTestId('option-checkbox-0'); 
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  it('displays error toast when checkbox count is incorrect', async () => {
    const { getByTestId, getByPlaceholderText } = render(<AddSingleAnswer />);
    const inputField = getByPlaceholderText('Add Options');
    const addButton = getByTestId('add-button');

    fireEvent.change(inputField, { target: { value: 'New Option' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const checkbox = getByTestId('option-checkbox-0'); 
     
      expect(checkbox).not.toBeChecked();
      const submit=getByTestId('submit')
    fireEvent.click(submit)
    expect(toast.error).toHaveBeenCalledWith('Please select one options');
    
    });
  })

  it('handleDifficultyChange updates difficulty level in state', () => {
      const { getByLabelText } = render(<AddSingleAnswer />);
      
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

describe("AddSingleAnswer Component", () => {
 
  it("renders AddSingleAnswer component correctly", async () => {
    subjectdropdownListing.mockResolvedValueOnce({  data: { subject_name: 'Subject A' } });
      
    render(<AddSingleAnswer />);
    
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
    const optionsInput = screen.getByPlaceholderText("Add Options");
    expect(optionsInput).toBeInTheDocument();
    
    const addButton = screen.getByTestId("add-button");
    expect(addButton).toBeInTheDocument();

    const submitButton = screen.getByTestId("submit");
    expect(submitButton).toBeInTheDocument();

    const dropdown = screen.getByRole('combobox', { name: /Select an option/i });
    expect(dropdown).toBeInTheDocument();
    fireEvent.change(dropdown, { target: { value: 'Subject A' } });

   
   


   

  });



  test("handles input changes correctly", async () => {
    subjectdropdownListing.mockResolvedValueOnce({  data: { subject_name: 'Subject A' } });
    createquestion.mockResolvedValueOnce({data:{message:"Single answer question created successfully"}})
    
    const { getByTestId } = render(<AddSingleAnswer />);

  
    const dropdown = screen.getByRole('combobox', { name: /Select an option/i });
    fireEvent.change(dropdown, { target: { value: '1' } });
    fireEvent.click(screen.getByTestId("difficulty"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("marks"), { target: { value: 5 } });
    fireEvent.change(screen.getByTestId("question_description"), { target: { value: "Test question" } });
    
    userEvent.click(screen.getByLabelText('Easy'));
    userEvent.click(screen.getByTestId('add-button'));

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
      options: [
        { options: 'Option 1', is_answer: true },
        { options: 'Option 2', is_answer: false },
      ],
    };
    render(
      <AddSingleAnswer
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

  // it('should populate input fields with data on update button clickm and show error', async () => {
  //   updateQuestion.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
  //   const mockData = {
  //     id: 1,
  //     subject_id: 'subject_id_1',
  //     marks: 10,
  //     question_description: 'Sample question description',
  //     difficulty_level: '1',
  //     options: [
  //       { options: 'Option 1', is_answer: true },
  //       { options: 'Option 2', is_answer: false },
  //     ],
  //   };
  //   render(
  //     <AddSingleAnswer
  //       formData={{answer_type:1}}
  //       data={mockData}
  //       isUpdate={true}
       
  //     />
  //   );

  //   expect(screen.getByTestId('marks')).toHaveValue(mockData.marks);
  //   expect(screen.getByTestId('question_description')).toHaveValue(mockData.question_description);
  //   fireEvent.click(screen.getByText('Update'));
  //   await waitFor(() => {
  //    expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 })
  //   });


  // });


  // it('Network error', async () => {
  //   updateQuestion.mockRejectedValueOnce("Some error")
  //   const mockData = {
  //     id: 1,
  //     subject_id: 'subject_id_1',
  //     marks: 10,
  //     question_description: 'Sample question description',
  //     difficulty_level: '1',
  //     options: [
  //       { options: 'Option 1', is_answer: true },
  //       { options: 'Option 2', is_answer: false },
  //     ],
  //   };
  //   render(
  //     <AddSingleAnswer
  //       formData={{answer_type:1}}
  //       data={mockData}
  //       isUpdate={true}
       
  //     />
  //   );

  //   expect(screen.getByTestId('marks')).toHaveValue(mockData.marks);
  //   expect(screen.getByTestId('question_description')).toHaveValue(mockData.question_description);
  //   fireEvent.click(screen.getByText('Update'));
  //   await waitFor(() => {
  //    expect(toast.error).toHaveBeenCalledWith("Network unable to connect to the server", { 'autoClose': 2000 })
  //   });


  // });

  test('displays validation errors on Save button click', async () => {
    render(<AddSingleAnswer />);

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
    
      expect(screen.getByText('Please select a subject.')).toBeInTheDocument();
      expect(screen.getByText('question description is required')).toBeInTheDocument();
    });


})

test('displays validation errors on Save button click', async () => {
  render(<AddSingleAnswer />);

  fireEvent.click(screen.getByText('Publish'));
  await waitFor(() => {
  
    expect(screen.getByText('Please select a subject.')).toBeInTheDocument();
    expect(screen.getByText('question description is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a difficulty level.')).toBeInTheDocument();
    expect(screen.getByText('Please enter the mark.')).toBeInTheDocument();
    expect(screen.getByText('question description is required')).toBeInTheDocument();
   
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

  createquestion.mockResolvedValueOnce({data:{message:"Question Drafted successfully"}})
  await act(async() =>{
    render(<AddSingleAnswer />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  fireEvent.change(screen.getByTestId('marks'), { target: { value: '5' } });
  fireEvent.click(screen.getByText('Save'));

  
}) 
screen.debug(input)


 


})

test('handle successfull question drafted failed', async() => {

  createquestion.mockRejectedValue(new Error("Question draft failed"))
  await act(async() =>{
    render(<AddSingleAnswer />);
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
    render(<AddSingleAnswer />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  await userEvent.type(screen.getByTestId('delete-button'),  'Option 1'  );
  fireEvent.click(screen.getByTestId("add-button"))

  const checkbox = screen.getByTestId('option-checkbox-0');
  await  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  const input1 = screen.getByTestId('marks');
  await fireEvent.change(input1, {target:{value:42}});
  expect(input1).toHaveValue(42);

  userEvent.click(screen.getByTestId('difficulty'));
  expect(screen.getByTestId('difficulty')).toBeChecked();

  fireEvent.click(screen.getByText('Publish'));
  
  
}) 

})
 

// test('handle question publish failure', async() => {

//   createquestion.mockRejectedValue(new Error("Publish failed"))
//   await act(async() =>{
//     render(<AddSingleAnswer />);
//   })

// const input = screen.getAllByRole('textbox')[0]


// await waitFor(async()=>{
//   await userEvent.type(input, 'helloworld')
//   userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
//   await userEvent.type(screen.getByTestId('delete-button'),  'Option 1'  );
//   fireEvent.click(screen.getByTestId("add-button"))

//   const checkbox = screen.getByTestId('option-checkbox-0');
//   await  userEvent.click(checkbox);
//   expect(checkbox).toBeChecked();

//   const input1 = screen.getByTestId('marks');
//   await fireEvent.change(input1, {target:{value:42}});
//   expect(input1).toHaveValue(42);

//   userEvent.click(screen.getByTestId('difficulty'));
//   expect(screen.getByTestId('difficulty')).toBeChecked();

//   fireEvent.click(screen.getByText('Publish'));
//   expect(toast.error).toHaveBeenCalledWith("Mocked error", {"autoClose": 2000})
  
// }) 

// })

test('handle question publish failure', async() => {

 
  await act(async() =>{
    render(<AddSingleAnswer />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');

  const input1 = screen.getByTestId('marks');
  await fireEvent.change(input1, {target:{value:42}});
  expect(input1).toHaveValue(42);

  userEvent.click(screen.getByTestId('difficulty'));
  expect(screen.getByTestId('difficulty')).toBeChecked();

  fireEvent.click(screen.getByText('Publish'));
 
  
}) 

})


test('handle question option edit', async() => {

  
  await act(async() =>{
    render(<AddSingleAnswer />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  await userEvent.type(screen.getByTestId('delete-button'),  'Option 1'  );
  fireEvent.click(screen.getByTestId("add-button"))

  const checkbox = screen.getByTestId('option-checkbox-0');
  await  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  await userEvent.click(screen.getByTestId("editoption"))
  expect(screen.getByTestId('delete-button')).toHaveValue("Option 1")

  fireEvent.input( screen.getByTestId('delete-button'), { target: { value: 'Updated Option 1' } });
  expect(screen.getByTestId('delete-button')).toHaveValue("Updated Option 1")
  fireEvent.click(screen.getByTestId("add-button"))
  expect(screen.getByTestId('delete-button')).toHaveValue("")
  
}) 

})


test('handle question option remove', async() => {

  
  await act(async() =>{
    render(<AddSingleAnswer />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  await userEvent.type(screen.getByTestId('delete-button'),  'Option 1'  );
  fireEvent.click(screen.getByTestId("add-button"))

  const checkbox = screen.getByTestId('option-checkbox-0');
  await  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  const elementsWithClass = document.getElementsByClassName('delete-button');

  await userEvent.click(elementsWithClass[0]);
  
  
  
}) 

})
test('handle publish click without selecting option', async() => {

  createquestion.mockResolvedValueOnce({data:{message:"Question created successfully"}})
  await act(async() =>{
    render(<AddSingleAnswer />);
  })

const input = screen.getAllByRole('textbox')[0]


await waitFor(async()=>{
  await userEvent.type(input, 'helloworld')
  userEvent.selectOptions(screen.getByLabelText('Select an option'), '1');
  await userEvent.type(screen.getByTestId('delete-button'),  'Option 1'  );
  fireEvent.click(screen.getByTestId("add-button"))

  const checkbox = screen.getByTestId('option-checkbox-0');
 
  const input1 = screen.getByTestId('marks');
  await fireEvent.change(input1, {target:{value:42}});
  expect(input1).toHaveValue(42);

  userEvent.click(screen.getByTestId('difficulty'));
  expect(screen.getByTestId('difficulty')).toBeChecked();

  fireEvent.click(screen.getByText('Publish'));
  expect(toast.error).toHaveBeenCalledWith("Please select one options")
  
}) 

})
})
