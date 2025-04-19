
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react' // Updated import from react instead of react-dom/test-utils
import AccountContainer from '../../components/AccountContainer'
import Search from '../../components/Search'
import Sort from '../../components/Sort'

const mockTransactions = [
    {
        id: "1",
        date: "2022-01-01",
        description: "Coffee Shop",
        category: "Food",
        amount: 5.75
    },
    {
        id: "2",
        date: "2022-01-02",
        description: "Grocery Store",
        category: "Food",
        amount: 25.50
    },
    {
        id: "3",
        date: "2022-01-03",
        description: "Movie Tickets",
        category: "Entertainment",
        amount: 24.00
    }
]

describe('Search Component', () => {
    test('calls setSearch when input changes', () => {
        const mockSetSearch = vi.fn()
        render(<Search setSearch={mockSetSearch} />)

        const searchInput = screen.getByPlaceholderText('Search your Recent Transactions')
        fireEvent.change(searchInput, { target: { value: 'Coffee' } })

        expect(mockSetSearch).toHaveBeenCalledWith('Coffee')
    })
})

describe('Sort Component', () => {
    test('calls onSort when selection changes', () => {
        const mockOnSort = vi.fn()
        render(<Sort onSort={mockOnSort} />)

        const sortSelect = screen.getByRole('combobox')
        fireEvent.change(sortSelect, { target: { value: 'category' } })

        expect(mockOnSort).toHaveBeenCalledWith('category')
    })
})

describe('AccountContainer Search Functionality', () => {
    beforeEach(() => {
        // Mock the fetch response
        global.setFetchResponse(mockTransactions)
    })

    test('filters transactions based on search term', async () => {
        render(<AccountContainer />)

        // Wait for transactions to load
        await waitFor(() => {
            expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
        })

        // Verify all transactions are initially displayed
        expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
        expect(screen.getByText('Grocery Store')).toBeInTheDocument()
        expect(screen.getByText('Movie Tickets')).toBeInTheDocument()

        // Enter search term
        await act(async () => {
            const searchInput = screen.getByPlaceholderText('Search your Recent Transactions')
            fireEvent.change(searchInput, { target: { value: 'Coffee' } })
        })

        // Check that only matching transactions are displayed
        await waitFor(() => {
            expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
            expect(screen.queryByText('Grocery Store')).not.toBeInTheDocument()
            expect(screen.queryByText('Movie Tickets')).not.toBeInTheDocument()
        })
    })

    test('filters transactions based on category', async () => {
        render(<AccountContainer />)

        // Wait for transactions to load
        await waitFor(() => {
            expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
        })

        // Enter search term to filter by category
        await act(async () => {
            const searchInput = screen.getByPlaceholderText('Search your Recent Transactions')
            fireEvent.change(searchInput, { target: { value: 'Food' } })
        })

        // Check that only food category transactions are displayed
        await waitFor(() => {
            expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
            expect(screen.getByText('Grocery Store')).toBeInTheDocument()
            expect(screen.queryByText('Movie Tickets')).not.toBeInTheDocument()
        })
    })
})

describe('AccountContainer Sort Functionality', () => {
    beforeEach(() => {
        // Mock the fetch response
        global.setFetchResponse(mockTransactions)
    })

    test('sorts transactions by description', async () => {
        render(<AccountContainer />)

        // Wait for transactions to load
        await waitFor(() => {
            expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
        })

        // Change the sort to description
        await act(async () => {
            const sortSelect = screen.getByRole('combobox')
            fireEvent.change(sortSelect, { target: { value: 'description' } })
        })

        // Get all transaction descriptions
        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // Skip header row
            const transactionRows = rows.slice(1)
            const descriptions = transactionRows.map(row => row.cells[1].textContent)

            // Check if sorted alphabetically by description
            expect(descriptions).toEqual(['Coffee Shop', 'Grocery Store', 'Movie Tickets'])
        })
    })

    test('sorts transactions by category', async () => {
        render(<AccountContainer />)

        // Wait for transactions to load
        await waitFor(() => {
            expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
        })

        // Change the sort to category
        await act(async () => {
            const sortSelect = screen.getByRole('combobox')
            fireEvent.change(sortSelect, { target: { value: 'category' } })
        })

        // Get all transaction categories
        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // Skip header row
            const transactionRows = rows.slice(1)
            const categories = transactionRows.map(row => row.cells[2].textContent)

            // Check if sorted alphabetically
            expect(categories).toEqual(['Entertainment', 'Food', 'Food'])
        })
    })
})
