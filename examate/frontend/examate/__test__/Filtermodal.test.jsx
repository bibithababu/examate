import React from 'react';
import { render, fireEvent} from '@testing-library/react';
import FilterModal from '@/components/Consumer/Examlist/examfilter';

const mockOnClose = jest.fn();
const mockOnApplyFilter = jest.fn();

describe('FilterModal component', () => {
   it('should call `onApplyFilter` with the selected value and then call `onClose` when the Apply button is clicked', () => {
    const { getByText, getByLabelText } = render(
      <FilterModal isOpen={true} onClose={mockOnClose} onApplyFilter={mockOnApplyFilter} />
    );
    fireEvent.click(getByLabelText("Filter by: Drafted"));

    fireEvent.click(getByText('Apply'));

    expect(mockOnApplyFilter).toHaveBeenCalledWith('0');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
   });   
   
});