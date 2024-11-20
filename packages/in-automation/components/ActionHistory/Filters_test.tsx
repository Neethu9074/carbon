/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import Filters from 'in-automation/components/ActionHistory/Filters';
import { Option } from 'in-components/ComboBox';

jest.mock(
  'in-components/ComboBox',
  () =>
    ({
      value,
      onChange,
      options,
      isMulti
    }: {
      value: string | number | readonly string[] | undefined;
      onChange: (value: any) => void;
      options: ReadonlyArray<Option>;
      isMulti?: boolean;
    }) =>
      (
        <select
          data-testid="combobox"
          value={value}
          onChange={e => onChange([{ value: e.target.value }])}
          multiple={isMulti}
        >
          {options.map((opt: Option) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
);

jest.mock('@instana/components', () => ({
  Spacer: () => <div data-testid="spacer" />
}));

describe('Filters', () => {
  const mockSetFilter = jest.fn();

  beforeEach(() => {
    mockSetFilter.mockClear();
  });

  it('renders without crashing', () => {
    const { getAllByTestId } = render(<Filters setFilter={mockSetFilter} types={[]} actionStatuses={[]} />);
    const comboBoxes = getAllByTestId('combobox');
    expect(comboBoxes.length).toBe(2);
  });

  it('calls setFilter correctly when type filter changes', () => {
    const { getAllByTestId } = render(<Filters setFilter={mockSetFilter} types={[]} actionStatuses={[]} />);
    const comboBoxes = getAllByTestId('combobox');
    expect(comboBoxes.length).toBe(2);
    fireEvent.change(comboBoxes[0], { target: { value: 'SCRIPT' } });
    expect(mockSetFilter).toHaveBeenCalledWith({ types: ['SCRIPT'] });
  });

  it('calls setFilter correctly when action status filter changes', () => {
    const { getAllByTestId } = render(<Filters setFilter={mockSetFilter} types={[]} actionStatuses={[]} />);
    const comboBoxes = getAllByTestId('combobox');
    fireEvent.change(comboBoxes[1], { target: { value: 'FAILED' } });
    expect(mockSetFilter).toHaveBeenCalledWith({ actionStatuses: ['FAILED'] });
  });
});
