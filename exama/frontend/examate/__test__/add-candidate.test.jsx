import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCandidate from '@/components/candidate-list/addcandidate';
import { AddCandidateService } from '@/services/ApiServices';

jest.mock('@/services/ApiServices');

describe('AddCandidate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders AddCandidate modal and adds a candidate', async () => {
        // Mock the onAddCandidate function
        const onAddCandidateMock = jest.fn();
        const examid = 1;

        // Render the component
        render(
            <AddCandidate show={true} exam_id={examid} onHide={() => { }} onAddCandidate={onAddCandidateMock} />
        );

        // Assert that the modal is rendered
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

        // Mock the API call
        AddCandidateService.mockResolvedValue({});

        // Enter an email and click the Add button
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Add'));
            await Promise.resolve(); // Ensure all promises resolve
        });
    });

    it('try to add invalid email', async () => {
        // Mock the onAddCandidate function
        const onAddCandidateMock = jest.fn();
        const examid = 1;

        // Render the component
        render(
            <AddCandidate show={true} exam_id={examid} onHide={() => { }} onAddCandidate={onAddCandidateMock} />
        );

        // Mock the API call
        AddCandidateService.mockResolvedValue({});

        // Enter an email
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testexample.com' } });

        // Press Enter key
        await act(async () => {
            fireEvent.keyDown(screen.getByPlaceholderText('Email'), { key: 'Enter', code: 'Enter' });
            await Promise.resolve(); // Ensure all promises resolve
        });

        
    });
});