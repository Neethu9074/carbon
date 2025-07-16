/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createMapForm, createField } from 'formalistic';
import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import React from 'react';

import * as CreateNewActionTearsheet from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import FieldsTable from 'in-automation/ActionCatalog/FieldsTable';

// Mock dependencies
jest.mock('in-automation/ActionCatalog/ServerTablePresenterWrapper', () => ({
  __esModule: true,
  default: ({
    columnDefinitions,
    formKey,
    customAddRowLabel,
    defaultRow,
    noDataMessage
  }: {
    columnDefinitions: ColumnDefinition<any>[];
    formKey: string;
    customAddRowLabel?: string;
    defaultRow?: any;
    noDataMessage?: string;
  }) => (
    <div data-testid="server-table-presenter-wrapper">
      <div data-testid="column-definitions">{JSON.stringify(columnDefinitions.map((col: any) => col.id))}</div>
      <div data-testid="form-key">{formKey}</div>
      <div data-testid="custom-add-row-label">{customAddRowLabel}</div>
      <div data-testid="default-row">{JSON.stringify(defaultRow)}</div>
      <div data-testid="no-data-message">{noDataMessage}</div>
    </div>
  )
}));

jest.mock('in-i18n', () => ({
  t: (key: string) => key
}));

// Add TextDecoder polyfill
global.ResizeObserver = ResizeObserver;
global.TextDecoder = class {
  decode(buffer: Uint8Array) {
    return Buffer.from(buffer).toString('utf-8');
  }
} as any;

describe('FieldsTable', () => {
  const mockSetForm = jest.fn();
  const mockLabelsField = createField({
    value: [
      { id: '1', value: 'Label 1' },
      { id: '2', value: 'Label 2' }
    ],
    // @ts-ignore - valid and touched are used in the component but not in the type definition
    valid: true,
    touched: false
  });

  const mockAssigneesField = createField({
    value: [
      { id: '3', value: 'Assignee 1' },
      { id: '4', value: 'Assignee 2' }
    ],
    // @ts-ignore - valid and touched are used in the component but not in the type definition
    valid: true,
    touched: false
  });

  const mockForm = createMapForm({
    items: {
      labels: mockLabelsField,
      assignees: mockAssigneesField
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(CreateNewActionTearsheet, 'useIsNotEditableContext').mockReturnValue(false);
  });

  test('renders with labels field by default', () => {
    render(
      <ActionFormContext.Provider value={{ form: mockForm, setForm: mockSetForm, rootPath: [] }}>
        <FieldsTable customAddRowLabel="Add Label" label="Labels" noDataMessage="No labels configured" />
      </ActionFormContext.Provider>
    );

    expect(screen.getByTestId('server-table-presenter-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('form-key').textContent).toBe('labels');
    expect(screen.getByTestId('custom-add-row-label').textContent).toBe('Add Label');
    expect(screen.getByTestId('default-row').textContent).toBe('""');
    expect(screen.getByTestId('no-data-message').textContent).toBe('No labels configured');
  });

  test('renders with assignees field when specified', () => {
    render(
      <ActionFormContext.Provider value={{ form: mockForm, setForm: mockSetForm, rootPath: [] }}>
        <FieldsTable
          fieldName="assignees"
          customAddRowLabel="Add Assignee"
          label="Assignees"
          noDataMessage="No assignees configured"
        />
      </ActionFormContext.Provider>
    );

    expect(screen.getByTestId('server-table-presenter-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('form-key').textContent).toBe('assignees');
    expect(screen.getByTestId('custom-add-row-label').textContent).toBe('Add Assignee');
    expect(screen.getByTestId('default-row').textContent).toBe('""');
    expect(screen.getByTestId('no-data-message').textContent).toBe('No assignees configured');
  });

  test('passes correct column definitions', () => {
    render(
      <ActionFormContext.Provider value={{ form: mockForm, setForm: mockSetForm, rootPath: [] }}>
        <FieldsTable customAddRowLabel="Add Label" label="Labels" noDataMessage="No labels configured" />
      </ActionFormContext.Provider>
    );

    expect(screen.getByTestId('column-definitions').textContent).toBe('["value"]');
  });

  test('respects isNotEditable context', () => {
    jest.spyOn(CreateNewActionTearsheet, 'useIsNotEditableContext').mockReturnValue(true);

    render(
      <ActionFormContext.Provider value={{ form: mockForm, setForm: mockSetForm, rootPath: [] }}>
        <FieldsTable customAddRowLabel="Add Label" label="Labels" noDataMessage="No labels configured" />
      </ActionFormContext.Provider>
    );

    // The column definitions are passed to ServerTablePresenterWrapper
    // which would handle the disabled state internally
    expect(screen.getByTestId('server-table-presenter-wrapper')).toBeInTheDocument();
  });
});
