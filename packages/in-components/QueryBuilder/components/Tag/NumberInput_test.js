/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import NumberInput from 'in-components/QueryBuilder/components/Tag/NumberInput';

describe('in-components/QueryBuilder/components/Tag/NumberInput', () => {
  it('should render the input field with type number', () => {
    render(<NumberInput />);
    // role for input type="number" is spinbutton
    // https://www.w3.org/TR/html-aria/#docconformance
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should accept a number as the default value', () => {
    const input = render(<NumberInput value={123} />);
    const numberInput = input.getByRole('spinbutton');
    expect(numberInput.value).toBe('123');
  });

  it('should accept a number as input', () => {
    const mockOnChange = jest.fn();
    const input = render(<NumberInput onChange={mockOnChange} />);
    const numberInput = input.getByRole('spinbutton');

    fireEvent.change(numberInput, { target: { value: 345 } });
    expect(mockOnChange).toHaveBeenLastCalledWith(345);
  });

  it('should pass null to onChange function on non-number value as input', () => {
    const mockOnChange = jest.fn();
    const input = render(<NumberInput value={2} onChange={mockOnChange} />);
    const numberInput = input.getByRole('spinbutton');

    fireEvent.change(numberInput, { target: { value: 'abc' } });
    expect(mockOnChange).toHaveBeenLastCalledWith(null);
  });

  it('should pass null to onChange function if value is lower than minValue', () => {
    const mockOnChange = jest.fn();
    const input = render(<NumberInput onChange={mockOnChange} minValue={2} />);
    const numberInput = input.getByRole('spinbutton');

    fireEvent.change(numberInput, { target: { value: 1 } });
    expect(mockOnChange).toHaveBeenLastCalledWith(null);
  });
});
