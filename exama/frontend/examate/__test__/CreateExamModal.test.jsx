import React from 'react';
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateExamModal from '@/components/createexammodal/CreateExamModal';
import { subjectdropdownListing,createExam, fetchExamDataById, updateExam } from '@/services/ApiServices';
import { toast } from 'react-toastify';

import Swal from "sweetalert2";

jest.mock("@/services/ApiServices", () => ({
    subjectdropdownListing: jest.fn(() => Promise.resolve({ data: { results: [{  id: 1, subject_name: 'Subject A' }] } })),
    createExam: jest.fn(),
    updateExam: jest.fn(),
    fetchExamDataById:jest.fn()
  }));
  jest.mock('react-toastify', () => ({
    ...jest.requireActual('react-toastify'),
    toast: {
      POSITION:{TOP_CENTER:jest.fn()},
      success: jest.fn(),
      error: jest.fn(),
      dismiss: jest.fn(),
      warning:jest.fn()
    },
  }));
  jest.mock('@/context/ticketStatusContext', () => ({
    useTicketStatus: jest.fn().mockReturnValue({
      ticketStatusCount: { approvedCount: 10 }, 
      updateTicketStatusCount: jest.fn(), 
    }),
  }));

  jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

  
  jest.mock('sweetalert2', () => ({
    mixin: jest.fn(() => ({
      fire: jest.fn().mockResolvedValue({isConfirmed:true})
    }))
  }));
  



  describe('CreateExamModal', () => {

    beforeEach(() => {
      jest.unmock('sweetalert2');
    
    });
  
  
    test('renders Create Exam Modal with form', async () => {
      render(<CreateExamModal isOpen={true} onClose={() => {}} />);
  
      expect(screen.getByText('Create Exam')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Subject')).toBeInTheDocument();
      expect(screen.getByText('Total questions')).toBeInTheDocument();
      expect(screen.getByText('Pass Percentage')).toBeInTheDocument();
      expect(screen.getByTestId('level')).toBeInTheDocument();
      expect(screen.getByText('Duration (min)')).toBeInTheDocument();
      // expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByTestId('createExambutton')).toBeInTheDocument();
    });
    // test('handles adding instruction when newInstruction is not empty',async () => {
    //     render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        
    //     userEvent.type(screen.getByLabelText(/instructions/i), 'Read carefully');
    //       await waitFor(()=>{
    //         expect(screen.getByTestId('instruction').value).toBe('Read carefully');
    //     })
       
    //     fireEvent.click(screen.getByTestId('Add Instruction'))
    //     expect(screen.getByTestId('instruction').value).toBe('');
        
    //   }); 

      test('handles adding subject', () => {
        render(<CreateExamModal isOpen={true} onClose={() => {}} />);
    
        expect(screen.getByLabelText(/total questions/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/pass percentage/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
      });
      test('handles deleting subject', () => {
        render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('delete1'));

        expect(screen.queryByLabelText(/subject/i)).toBeNull();
        expect(screen.queryByLabelText(/total questions/i)).toBeNull();
        expect(screen.queryByLabelText(/pass percentage/i)).toBeNull();
        expect(screen.queryByLabelText(/level/i)).toBeNull();
        expect(screen.queryByLabelText(/duration/i)).toBeNull();
      });

      test('handles adding subject', () => {
        render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    
        fireEvent.click(screen.getByText('Click here to add subject'));
    
        expect(screen.getAllByLabelText(/subject/i).length).toBe(2);
        expect(screen.getAllByLabelText(/total questions/i).length).toBe(2);
        expect(screen.getAllByLabelText(/pass percentage/i).length).toBe(2);
        expect(screen.getAllByLabelText(/level/i).length).toBe(2);
        expect(screen.getAllByLabelText(/duration/i).length).toBe(2);
      });

      // test('handles updating instruction when newInstruction is not empty and editingIndex is not null',async () => {
      //   render(<CreateExamModal isOpen={true} onClose={() => {}} />);
      //   const instructionsInput = screen.getByLabelText(/instructions/i);
      //   fireEvent.change(instructionsInput, { target: { value: 'Read carefully' } });
      //   await waitFor(()=>{
      //     expect(screen.getByTestId('instruction').value).toBe('Read carefully');
      //   })
     
      // fireEvent.click(screen.getByTestId('Add Instruction'))
      // expect(screen.getByTestId('instruction').value).toBe('');
      // await waitFor(()=>{
      //   expect(screen.getByText('Read carefully')).toBeInTheDocument();
      // })
      
      //   fireEvent.click(screen.getByTestId('editinstruction'));
      //   await waitFor(()=>{
      //       expect(screen.getByTestId('instruction').value).toBe('Read carefully');
      //   })
      //   const instructionsInput1 = screen.getByLabelText(/instructions/i);
      //   fireEvent.change(instructionsInput1, { target: { value: 'Read carefully updated' } });
      
      //   fireEvent.click(screen.getByTestId('Add Instruction'))
      //   await waitFor(()=>{
      //       expect(screen.getByTestId('instruction').value).toBe('');
      //       expect(screen.getByText('Read carefully updated')).toBeInTheDocument();
      //   })
      // });


      // test('handles deleting instruction', async() => {
      //   render(<CreateExamModal isOpen={true} onClose={() => {}} />);
      //   userEvent.type(screen.getByLabelText(/instructions/i), 'Read carefully');
      //   await waitFor(()=>{
      //       expect(screen.getByTestId('instruction').value).toBe('Read carefully');
      //     })
      //   fireEvent.click(screen.getByTestId('Add Instruction'))
      //   expect(screen.getByTestId('instruction').value).toBe('');
      //   await waitFor(()=>{
      //   expect(screen.getByText('Read carefully')).toBeInTheDocument();
      //     })
      //   fireEvent.click(screen.getByTestId('deleteinstruction'));
      //   await waitFor(()=>{
      //       expect(screen.queryByText('Read carefully')).not.toBeInTheDocument();
      //    })
      // });
    


    // test('handles toast warning showing when add instruction button clicked without entering instruction',async () => {
    //     render(<CreateExamModal isOpen={true} onClose={() => {}} />);

    //   fireEvent.click(screen.getByTestId('Add Instruction'))
    //   expect(toast.warning).toHaveBeenCalledWith("Please enter instruction before adding",{"autoClose": 2000});
    //   });

      test('handles adding subject', () => {
        render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    
        fireEvent.click(screen.getByText('Click here to add subject'));
    
        expect(screen.getAllByLabelText(/subject/i).length).toBe(2);
        expect(screen.getAllByLabelText(/total questions/i).length).toBe(2);
        expect(screen.getAllByLabelText(/pass percentage/i).length).toBe(2);
        expect(screen.getAllByLabelText(/level/i).length).toBe(2);
        expect(screen.getAllByLabelText(/duration/i).length).toBe(2);
      });

      test('fetches subjects and updates dropdown on mount', async () => {
      

       
        const { getByTestId, getAllByTestId }= render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        await act(async () => {
         expect(subjectdropdownListing).toHaveBeenCalled();
          expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/subject/i)).toHaveValue("");  
          expect(screen.getByText('Select subject')).toBeInTheDocument();  
    
        
        });
      });
      test('handles error during subjects fetching', async () => {
        subjectdropdownListing.mockRejectedValueOnce(new Error('Mocked error'));
        render(<CreateExamModal isOpen={true} onClose={() => {}} />);
       await waitFor(()=>{
        expect(toast.error).toHaveBeenCalledWith('Error in Fetching Subjects',{"autoClose": 2000});
       })    
      });
      test('handles successful exam creation with valid input ', async () => {

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        createExam.mockResolvedValueOnce({ status: 201, data: { message: 'Exam Created Successfully' } });
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
        fireEvent.change(subjectDropdown, { target: { value: '1' } });
        fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
        fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(screen.getByTestId('time'), { target: { value: '12:00' } }); 
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
        fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
        fireEvent.click(screen.getByTestId('createExambutton'));
      
         await waitFor(() => {
                  expect(toast.success).toHaveBeenCalledWith("Exam Created Successfully", { 'autoClose': 2000 });
              });
      
      
      });


      test('handles successful exam publicaion with valid input ', async () => {

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        createExam.mockResolvedValueOnce({ status: 200, data: { message: 'Exam Published Successfully' } });
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
        fireEvent.change(subjectDropdown, { target: { value: '1' } });
        fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
        fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(screen.getByTestId('time'), { target: { value: '12:00' } }); 
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
        fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
        fireEvent.click(screen.getByTestId('publishExambutton'));
      
         await waitFor(() => {
                  expect(toast.success).toHaveBeenCalledWith("Exam Published Successfully", { 'autoClose': 2000 });
              });
      
      
      });



      test('handle the case where subject get missed to fill', async () => {

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
       
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
      
        fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
       
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
        fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
        fireEvent.click(screen.getByTestId('createExambutton'));
      
         await waitFor(() => {
          expect(screen.getByText('Select a subject')).toBeInTheDocument();
              });
      
      
      });

      test('handles successful exam creation with valid input but without date ', async () => {

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        createExam.mockResolvedValueOnce({ status: 201, data: { message: 'Exam Created Successfully' } });
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
        fireEvent.change(subjectDropdown, { target: { value: '1' } });
        fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
        fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
        fireEvent.click(screen.getByTestId('createExambutton'));
      
         await waitFor(() => {
                  expect(toast.success).toHaveBeenCalledWith("Exam Created Successfully", { 'autoClose': 2000 });
              });
      
      
      });

      test('handles error during subjects fetching', async () => {
        subjectdropdownListing.mockRejectedValueOnce(new Error('Mocked error'));
        render(<CreateExamModal isOpen={true} onClose={() => {}} />);
       await waitFor(()=>{
        expect(toast.error).toHaveBeenCalledWith('Error in Fetching Subjects',{"autoClose": 2000});
       })    
      });



      test('handles error response in exam creation  ', async () => {
      

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        createExam.mockRejectedValue({
          response: {
              data: {
                  message: 'mocked error',
                  errorCode: "E40024"
              }
          }
        });
       
      
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
        fireEvent.change(subjectDropdown, { target: { value: '1' } });
        fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
        fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(screen.getByTestId('time'), { target: { value: '12:00' } }); 
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
        fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
        fireEvent.click(screen.getByTestId('createExambutton'));
      
        await waitFor(async() => {
          expect(Swal.mixin).toHaveBeenCalledTimes(1);
       });
     
      
        expect(subjectDropdown.value).toBe('1');
      });


  //     test.only('handles error response cancel ', async () => {

  //       const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
  //       createExam.mockRejectedValue({
  //         response: {
  //             data: {
  //                 message: 'mocked error',
  //                 error_code: 3213
  //             }
  //         }
  //       });
  //       jest.mock('sweetalert2', () => ({
  //         mixin: jest.fn(() => ({
  //           fire: jest.fn(() => Promise.resolve({isConfirmed: false, dismiss: Swal.DismissReason.cancel}))
  //         }))
  //       }));
      
  //       await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
  //       const subjectDropdown = getByLabelText('Subject');
  //       fireEvent.change(subjectDropdown, { target: { value: '1' } });
  //       fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
  //       fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-01-20' } });
  //       fireEvent.change(screen.getByTestId('time'), { target: { value: '12:00' } }); 
  //       fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
  //       fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
  //       fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
  //       fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
  //       fireEvent.click(screen.getByTestId('createExambutton'));

  //       await waitFor(() => {
  //   expect(Swal.mixin().fire).toHaveBeenCalledWith({
  //     title: "Cancelled",
  //     icon: "error"
  //   });
  // });
      
       
      
      //   expect(subjectDropdown.value).toBe('1');
      // });

  test('close button triggers onClose and clearErrors functions', () => {
   
    const onClose = jest.fn();
    const clearErrors = jest.fn();

  
    const { getByTestId } = render(<CreateExamModal onClose={onClose} isOpen={true} />);
    
    
    const closeButton = getByTestId('close-button');
    
   
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
   
  });



      test('handles error response in exam creation with invalid input ', async () => {

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        createExam.mockRejectedValueOnce(new Error('Mocked error'))
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
       
        fireEvent.input(screen.getByTestId('name'), { target: { value: '' } });
        fireEvent.change(screen.getByTestId('date'), { target: { value: '' } });
        fireEvent.change(screen.getByTestId('time'), { target: { value: '' } }); 
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '' } });
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '' } });
      
        fireEvent.click(screen.getByTestId('publishExambutton'));
      
         await waitFor(() => {
           expect(screen.getByText('Please provide a name for the exam')).toBeInTheDocument();
           expect(screen.getByText('Please select a valid date (current date or future date)')).toBeInTheDocument();
           expect(screen.getByText('Please select a future time')).toBeInTheDocument();
           expect(screen.getByText('Select a subject')).toBeInTheDocument();
           expect(screen.getByText('Total questions cannot be negative or zero')).toBeInTheDocument();
           expect(screen.getByText('Pass Percentage should be between 0 and 100')).toBeInTheDocument();
           expect(screen.getByText('select a level for subject')).toBeInTheDocument();
           expect(screen.getByText('Duration should be greater than zero')).toBeInTheDocument();
              });  
      });
      // test('updates instructions when newInstruction is set', () => {
      //   const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
      //   fireEvent.change(getByLabelText(/instructions/i), { target: { value: 'Read carefully' } });
      //   fireEvent.click(getByTestId('Add Instruction'));
      //   expect(getByTestId('instruction').value).toBe('');
      //   expect(screen.getByText('Read carefully')).toBeInTheDocument();
      // });

      // test('instructions when newInstruction is set', async() => {
      //   const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
      //   fireEvent.change(getByLabelText(/instructions/i), { target: { value: 'Read carefully' } });
      //   expect(getByTestId('instruction').value).toBe('Read carefully');
  
      //   fireEvent.click(getByTestId('Add Instruction'));
      //   expect(getByTestId('instruction').value).toBe('');
      //   expect(screen.getByText('Read carefully')).toBeInTheDocument();

      //   fireEvent.click(screen.getByTestId('editinstruction'))
      //   fireEvent.input(screen.getByTestId('instruction'), { target: { value: 'Test instruction' } });
      //   expect(screen.getByTestId('instruction').value).toBe('Test instruction');
        
      //   fireEvent.click(getByTestId('Add Instruction'));
      //   await waitFor(()=>{
      //     expect(screen.queryByText('Read carefully')).toBeNull(); 
      //     expect(screen.getByText('Test instruction')).toBeInTheDocument();
      //   })
       
      // });

      test('handles exam update successfully',async()=>{
        const mockId = 123;
        fetchExamDataById.mockResolvedValue({data:{
          name:'Sample Exam',
          scheduled_time:'2025-01-20T12:00:00',
          instructions:['Sample Instruction'],
          subjects: [{ subject: 1, question_count: 10, pass_percentage: 70, difficulty_level: 2, time_duration: 60 }],

        }})
        updateExam.mockResolvedValueOnce({ status: 200, data: { message: 'Exam Updated Successfully' } });
      
        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={()=>{}} isUpdate={true} id={mockId}/>)
        await waitFor(() => {
          expect(getByTestId('name')).toHaveValue('Sample Exam');
          expect(getByTestId('date')).toHaveValue('2025-01-20');
          expect(getByTestId('time')).toHaveValue('12:00');
          expect(getByTestId('question_count')).toHaveValue(10);
          expect(getByTestId('pass_percentage')).toHaveValue(70);
          expect(getByLabelText('Subject')).toHaveValue('1')
         
        });

        fireEvent.input(getByTestId('name'), { target: { value: 'Updated Exam Name' } });
        fireEvent.change(getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(getByTestId('time'), { target: { value: '12:00' } });
        
        fireEvent.click(getByTestId('createExambutton'));
        await waitFor(() => {
          expect(toast.success).toHaveBeenCalledWith("Exam Updated Successfully", { 'autoClose': 2000 });
      });
      })

      test('handles exam update and publish successfully',async()=>{
        const mockId = 123;
        fetchExamDataById.mockResolvedValue({data:{
          name:'Sample Exam',
          scheduled_time:'2025-01-20T12:00:00',
          instructions:['Sample Instruction'],
          subjects: [{ subject: 1, question_count: 10, pass_percentage: 70, difficulty_level: 2, time_duration: 60 }],

        }})
        updateExam.mockResolvedValueOnce({ status: 200, data: { message: 'Exam Updated and Published Successfully' } });
      
        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={()=>{}} isUpdate={true} id={mockId}/>)
        await waitFor(() => {
          expect(getByTestId('name')).toHaveValue('Sample Exam');
          expect(getByTestId('date')).toHaveValue('2025-01-20');
          expect(getByTestId('time')).toHaveValue('12:00');
          expect(getByTestId('question_count')).toHaveValue(10);
          expect(getByTestId('pass_percentage')).toHaveValue(70);
          expect(getByLabelText('Subject')).toHaveValue('1')
         
        });

        fireEvent.input(getByTestId('name'), { target: { value: 'Updated Exam Name' } });
        fireEvent.change(getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(getByTestId('time'), { target: { value: '12:00' } });
        
        fireEvent.click(getByTestId('publishExambutton'));
        await waitFor(() => {
          expect(toast.success).toHaveBeenCalledWith("Exam Updated and Published Successfully", { 'autoClose': 2000 });
      });
      })

      test('handles exam updation error',async()=>{
        const mockId = 123;
        fetchExamDataById.mockResolvedValue({data:{
          name:'Sample Exam',
          scheduled_time:'2025-01-20T12:00:00',
          instructions:['Sample Instruction'],
          subjects: [{ subject: 1, question_count: 10, pass_percentage: 70, difficulty_level: 2, time_duration: 60 }],

        }})
        updateExam.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } });
      
        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={()=>{}} isUpdate={true} id={mockId}/>)
        await waitFor(() => {
          expect(getByTestId('name')).toHaveValue('Sample Exam');
          expect(getByTestId('date')).toHaveValue('2025-01-20');
          expect(getByTestId('time')).toHaveValue('12:00');
          expect(getByTestId('question_count')).toHaveValue(10);
          expect(getByTestId('pass_percentage')).toHaveValue(70);
          expect(getByLabelText('Subject')).toHaveValue('1')
         
        });

        fireEvent.input(getByTestId('name'), { target: { value: 'Updated Exam Name' } });
        fireEvent.change(getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(getByTestId('time'), { target: { value: '12:00' } });
        
        fireEvent.click(getByTestId('createExambutton'));
        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 });
      });
      })

     

      test('Network error ', async () => {

        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={() => {}} />);
        createExam.mockRejectedValueOnce('Network Error');
      
        await waitFor(() => expect(getByTestId('select-option-subject')).toBeInTheDocument());
      
        
        const subjectDropdown = getByLabelText('Subject');
        fireEvent.change(subjectDropdown, { target: { value: '1' } });
        fireEvent.input(screen.getByTestId('name'), { target: { value: 'Test Exam' } });
        fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-01-20' } });
        fireEvent.change(screen.getByTestId('time'), { target: { value: '12:00' } }); 
        fireEvent.input(screen.getByTestId('question_count'), { target: { value: '8' } });
        fireEvent.input(screen.getByTestId('pass_percentage'), { target: { value: '80' } });
        fireEvent.change(getByTestId('select-level'), { target: { value: 2 } })
        fireEvent.input(screen.getByTestId('time_duration'), { target: { value: '80' } });
      
        fireEvent.click(screen.getByTestId('createExambutton'));
      
         await waitFor(() => {
                  expect(toast.error).toHaveBeenCalledWith("Network unable to connect to the server", { 'autoClose': 2000 });
              });
      

      });

    
      test('handles eerror in fetching subjects',async()=>{
        const mockId = 123;
        fetchExamDataById.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
        const { getByLabelText, getByTestId } = render(<CreateExamModal isOpen={true} onClose={()=>{}} isUpdate={true} id={mockId}/>)
        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Error in Fetching Subjects", { 'autoClose': 2000 });
      });
      })
     
 
})



