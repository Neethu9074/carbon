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
import AdditionalHeadersTable from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import { MappedHeader } from 'in-automation/ActionCatalog/useActionForm/types';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';

// Mock dependencies
jest.mock('in-automation/ActionCatalog/ServerTablePresenterWrapper', () => ({
  __esModule: true,
  default: ({
    columnDefinitions,
    formKey,
    defaultRow,
    noDataMessage,
    leftHeader
  }: {
    columnDefinitions: ColumnDefinition<any>[];
    formKey: string;
    defaultRow?: any;
    noDataMessage?: string;
    leftHeader?: React.ReactNode;
  }) => (
    <div data-testid="server-table-presenter-wrapper">
      <div data-testid="column-definitions">{JSON.stringify(columnDefinitions.map((col: any) => col.id))}</div>
      <div data-testid="form-key">{formKey}</div>
      <div data-testid="default-row">{JSON.stringify(defaultRow)}</div>
      <div data-testid="no-data-message">{noDataMessage}</div>
      {leftHeader && <div data-testid="left-header">{leftHeader}</div>}
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

describe('AdditionalHeadersTable', () => {
  const mockSetForm = jest.fn();

  // Create properly typed headers with tuple type [string, string]
  const mockHeaders: MappedHeader[] = [
    { id: '1', value: ['Header1', 'Value1'] as [string, string] },
    { id: '2', value: ['Header2', 'Value2'] as [string, string] }
  ];

  const mockAdditionalHeadersField = createField({
    value: mockHeaders,
    // @ts-ignore - valid and touched are used in the component but not in the type definition
    valid: true,
    touched: false
  });

  // Use any to bypass type checking for the test
  const mockForm: any = createMapForm({
    items: {
      additionalHeaders: mockAdditionalHeadersField
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(CreateNewActionTearsheet, 'useIsNotEditableContext').mockReturnValue(false);
  });

  test('renders with additional headers', () => {
    render(<AdditionalHeadersTable form={mockForm} setForm={mockSetForm} />);

    expect(screen.getByTestId('server-table-presenter-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('form-key').textContent).toBe('additionalHeaders');
    expect(screen.getByTestId('default-row').textContent).toBe('["",""]');
    expect(screen.getByTestId('no-data-message').textContent).toBe(
      'in-automation:ActionCatalog.noAdditionalHeadersConfigured'
    );
    expect(screen.getByTestId('left-header')).toBeInTheDocument();
  });

  test('passes correct column definitions', () => {
    render(<AdditionalHeadersTable form={mockForm} setForm={mockSetForm} />);

    expect(screen.getByTestId('column-definitions').textContent).toBe('["key","value"]');
  });

  test('respects isNotEditable context', () => {
    jest.spyOn(CreateNewActionTearsheet, 'useIsNotEditableContext').mockReturnValue(true);

    render(<AdditionalHeadersTable form={mockForm} setForm={mockSetForm} />);

    // The column definitions are passed to ServerTablePresenterWrapper
    // which would handle the disabled state internally
    expect(screen.getByTestId('server-table-presenter-wrapper')).toBeInTheDocument();
  });

  test('renders with invalid field state', () => {
    // Create properly typed headers with tuple type [string, string] for invalid state
    const invalidHeaders: MappedHeader[] = [
      { id: '1', value: ['', ''] as [string, string] }, // Empty key which would be invalid
      { id: '2', value: ['Header2', ''] as [string, string] } // Empty value which would be invalid
    ];

    const invalidHeadersField = createField({
      value: invalidHeaders,
      // @ts-ignore - valid and touched are used in the component but not in the type definition
      valid: false,
      touched: true
    });

    // Use any to bypass type checking for the test
    const invalidForm: any = createMapForm({
      items: {
        additionalHeaders: invalidHeadersField
      }
    });

    render(<AdditionalHeadersTable form={invalidForm} setForm={mockSetForm} />);

    expect(screen.getByTestId('server-table-presenter-wrapper')).toBeInTheDocument();
    // The error state would be handled by the Input components inside the column definitions
    // which are mocked in this test
  });
});
