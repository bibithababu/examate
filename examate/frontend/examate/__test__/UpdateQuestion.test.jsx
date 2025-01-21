import { render, screen } from "@testing-library/react";
import UpdateQuestion from "@/components/updatequestion/updatequestion";
import MockAddFreeAnswerQuestion from "@/__mock__/AddFreeAnswerQuestion";
import MockAddMultipleAnswerQuestion from "@/__mock__/AddMultiAnswerQuestion";
import MockAddSingleAnswerQuestion from "@/__mock__/AddSingleAnswerQuestion";








jest.mock('@/components/freeanswer/freeanswer', () => ({
    __esModule: true,
    default: () => <MockAddFreeAnswerQuestion/>
  
  }));

  jest.mock('@/components/multipleanswer/multipleanswer', () => ({
    __esModule: true,
    default: () => <MockAddMultipleAnswerQuestion/>
  
  }));


  jest.mock('@/components/singleanswer/singleanswer', () => ({
    __esModule: true,
    default: () => <MockAddSingleAnswerQuestion/>
  
  }));

describe("UpdateQuestion component", () => {
    const mockOnHide = jest.fn();
  
    test("renders the component with default values", () => {
      render(<UpdateQuestion show onHide={mockOnHide} isUpdate={false} />);
  
      
      expect(screen.getByText("Create Question")).toBeInTheDocument();

   
    });

    test("renders the free answer component with default values", () => {
        const questionData = {
            answer_type: "3",
            subject_id: "Subject name",
            marks: 25,
            question_description: "Free answer question",
            difficulty_level: "Hard",
            answer: "Free answer",
          };
         
        render(<UpdateQuestion show onHide={mockOnHide} isUpdate={true} questionData={questionData} />);
        expect(screen.getByTestId('mocked-add-free-answer-question')).toBeInTheDocument();
        expect(screen.getByText("Update Question")).toBeInTheDocument();
  
     
      });

      test("renders the multi answer component with default values", () => {
        const questionData = {
            answer_type: "2",
            subject_id: "Subject name",
            marks: 25,
            question_description: "Free answer question",
            difficulty_level: "Hard",
            answer: "Free answer",
          };
         
        render(<UpdateQuestion show onHide={mockOnHide} isUpdate={true} questionData={questionData} />);
        expect(screen.getByTestId('mocked-add-multiple-answer-question')).toBeInTheDocument();
        expect(screen.getByText("Update Question")).toBeInTheDocument();
  
     
      });

      test("renders the multi answer component with default values", () => {
        const questionData = {
            answer_type: "1",
            subject_id: "Subject name",
            marks: 25,
            question_description: "Free answer question",
            difficulty_level: "Hard",
            answer: "Free answer",
          };
         
        render(<UpdateQuestion show onHide={mockOnHide} isUpdate={true} questionData={questionData} />);
        expect(screen.getByTestId('mocked-add-single-answer-question')).toBeInTheDocument();
        expect(screen.getByText("Update Question")).toBeInTheDocument();
  
     
      });


})