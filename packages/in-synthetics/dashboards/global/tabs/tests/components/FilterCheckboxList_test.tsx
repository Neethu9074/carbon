/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

// Import the component after mocking
import { FilterCheckboxList } from 'in-synthetics/dashboards/global/tabs/tests/components/FilterCheckboxList';
// Import the hooks we need to mock
import { useFilteredSortedOptions } from 'in-synthetics/components/hooks/useFilteredSortedOptions';
import { useFilterPagination } from 'in-synthetics/components/hooks/useFilterPagination';
import { useSelectionState } from 'in-synthetics/components/hooks/useSelectionState';

// Mock the hooks
jest.mock('in-synthetics/components/hooks/useFilteredSortedOptions', () => ({
  useFilteredSortedOptions: jest.fn()
}));

jest.mock('in-synthetics/components/hooks/useFilterPagination', () => ({
  useFilterPagination: jest.fn()
}));

jest.mock('in-synthetics/components/hooks/useSelectionState', () => ({
  useSelectionState: jest.fn()
}));

describe('FilterCheckboxList', () => {
  // Mock data
  const mockOptions = [
    {
      label: 'API Script',
      value: 'HTTPScript'
    },
    {
      label: 'API Simple',
      value: 'HTTPAction'
    },
    {
      label: 'Browser Script',
      value: 'BrowserScript'
    },
    {
      label: 'DNS',
      value: 'DNS'
    },
    {
      label: 'SSLCertificate',
      value: 'SSLCertificate'
    },
    {
      label: 'Webpage Script',
      value: 'WebpageScript'
    },
    {
      label: 'Webpage Simple',
      value: 'WebpageAction'
    }
  ];

  const mockSelectedValues = ['HTTPScript'];
  const mockOnChange = jest.fn();
  const mockGroupId = 'type-filter';

  // Mock hook return values
  const mockPaginationHook = {
    visibleItems: 5,
    handleLoadMore: jest.fn(),
    resetPagination: jest.fn()
  };

  const mockFilteredSortedHook = {
    sortedOptions: mockOptions,
    visibleOptions: mockOptions.slice(0, 3),
    hasMoreOptions: true,
    totalCount: mockOptions.length
  };

  const mockSelectionStateHook = {
    allSelected: false,
    isIndeterminate: true
  };

  beforeEach(() => {
    // Setup mock hook implementations
    (useFilterPagination as jest.Mock).mockReturnValue(mockPaginationHook);
    (useFilteredSortedOptions as jest.Mock).mockReturnValue(mockFilteredSortedHook);
    (useSelectionState as jest.Mock).mockReturnValue(mockSelectionStateHook);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component without any errors', () => {
    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );
  });

  it('renders search input correctly', () => {
    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders select all checkbox correctly', () => {
    const { container } = render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );

    const selectAllCheckbox = container.querySelector('#type-filter-select-all');
    expect(selectAllCheckbox).toBeInTheDocument();
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it('renders option checkboxes correctly', () => {
    (useFilteredSortedOptions as jest.Mock).mockReturnValue({
      ...mockFilteredSortedHook,
      visibleOptions: mockOptions.slice(0, 3)
    });

    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );

    // Check that the visible options are rendered
    expect(screen.getByLabelText('API Script')).toBeInTheDocument();
    expect(screen.getByLabelText('API Simple')).toBeInTheDocument();
    expect(screen.getByLabelText('Browser Script')).toBeInTheDocument();
  });

  it('renders load more button when there are more options', () => {
    (useFilteredSortedOptions as jest.Mock).mockReturnValue({
      ...mockFilteredSortedHook,
      hasMoreOptions: true
    });

    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );

    const loadMoreButton = screen.getByRole('button', { name: /view all/i });
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('does not render load more button when there are no more options', () => {
    (useFilteredSortedOptions as jest.Mock).mockReturnValue({
      ...mockFilteredSortedHook,
      hasMoreOptions: false
    });

    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );

    const loadMoreButton = screen.queryByRole('button', { name: /view all/i });
    expect(loadMoreButton).not.toBeInTheDocument();
  });

  //Add user interaction test
  it('calls onChange when a checkbox is clicked', () => {
    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );
    const checkbox = screen.getByLabelText('API Script');
    fireEvent.click(checkbox);
    // When clicking the 'API Script' checkbox which is already selected (mockSelectedValues=['HTTPScript']),
    // it should be deselected, resulting in an empty array
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  //Test search function
  it('filters options when search query changes', () => {
    render(
      <FilterCheckboxList
        selectedValues={mockSelectedValues}
        options={mockOptions}
        onChange={mockOnChange}
        groupId={mockGroupId}
      />
    );
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'API' } });
    expect(screen.getByLabelText('API Script')).toBeInTheDocument();
    expect(screen.getByLabelText('API Simple')).toBeInTheDocument();
    expect(screen.queryByLabelText('Webpage Script')).not.toBeInTheDocument();
  });
});
