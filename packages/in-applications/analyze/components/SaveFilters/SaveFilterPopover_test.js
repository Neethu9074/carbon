/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { SaveFilterPopover } from 'in-applications/analyze/components/SaveFilters/SaveFilterPopover';

test('disables save button when no filter is selected', () => {
  const setEditFilterMock = jest.fn();

  render(
    <SaveFilterPopover dataSource="CALLS" formModel={[]} group={{}} setFilterToEdit={setEditFilterMock} result={[]} />
  );
  const buttons = screen.getAllByRole('button', { name: /save/i });
  expect(buttons[0]).toBeDisabled(); // Check first button
});

test('enables save button when there is filter in query builder', () => {
  const setEditFilterMock = jest.fn();

  render(
    <SaveFilterPopover
      dataSource="CALLS"
      formModel={[
        { type: 'TAG_FILTER', name: 'technology', operator: 'EQUALS', value: 'awsS3', entity: 'DESTINATION' }
      ]}
      group={{}}
      result={[]}
      setFilterToEdit={setEditFilterMock}
    />
  );
  const buttons = screen.getAllByRole('button', { name: /save/i });
  expect(buttons[0]).toBeEnabled();
});
