
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import AddTransactionForm from '../../components/AddTransactionForm'
import AccountContainer from '../../components/AccountContainer'

describe('AddTransactionForm Component', () => {
    test('calls postTransaction with form data when submitted', () => {
        // Create a mock function
        const mockPostTransaction = vi.fn()

        // Render component with mock function
        const { container } = render(<AddTransactionForm postTransaction={mockPostTransaction} />)

        // Fill in form using querySelector directly
        const dateInput = container.querySelector('input[name="date"]')
        const descriptionInput = container.querySelector('input[name="description"]')
        const categoryInput = container.querySelector('input[name="category"]')
        const amountInput = container.querySelector('input[name="amount"]')

        fireEvent.change(dateInput, { target: { value: '2023-01-01' } })
        fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } })
        fireEvent.change(categoryInput, { target: { value: 'Test Category' } })
        fireEvent.change(amountInput, { target: { value: '100' } })

        // Submit form
        const form = container.querySelector('form')
        fireEvent.submit(form)

        // Check if postTransaction was called with correct data
        expect(mockPostTransaction).toHaveBeenCalledWith({
            date: '2023-01-01',
            description: 'Test Transaction',
            category: 'Test Category',
            amount: '100'
        })
    })
})

describe('AccountContainer Add Transaction', () => {
    beforeEach(() => {
     
        global.setFetchResponse([])
    })

    test('adds a new transaction to the UI and makes a POST request', async () => {
      
        const { container } = render(<AccountContainer />)

      
        global.fetch = vi.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                id: "99",
                date: "2023-01-01",
                description: "New Test Transaction",
                category: "New Category",
                amount: "200"
            }),
            ok: true,
            status: 200
        }))

        // Fill in the form using querySelector directly
        const dateInput = container.querySelector('input[name="date"]')
        const descriptionInput = container.querySelector('input[name="description"]')
        const categoryInput = container.querySelector('input[name="category"]')
        const amountInput = container.querySelector('input[name="amount"]')

        // Using act for state changes
        act(() => {
            fireEvent.change(dateInput, { target: { value: '2023-01-01' } })
            fireEvent.change(descriptionInput, { target: { value: 'New Test Transaction' } })
            fireEvent.change(categoryInput, { target: { value: 'New Category' } })
            fireEvent.change(amountInput, { target: { value: '200' } })
        })

        // Submit the form with act
        await act(async () => {
            const form = container.querySelector('form')
            fireEvent.submit(form)
        })

        // Check if fetch was called correctly for POST
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:6001/transactions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: '2023-01-01',
                description: 'New Test Transaction',
                category: 'New Category',
                amount: '200'
            })
        })

        // Wait for the component to update
        await waitFor(() => {
            expect(screen.getByText('New Test Transaction')).toBeInTheDocument()
            expect(screen.getByText('New Category')).toBeInTheDocument()
            expect(screen.getByText('200')).toBeInTheDocument()
        })
    })
})
