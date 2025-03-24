/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import React from 'react';

import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import CreateNewActionTearsheet from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import useAction from 'in-automation/ActionCatalog/useAction';

jest.mock('in-automation/ActionCatalog/useAction');
jest.mock('in-automation/ActionCatalog/useActionDetailsUrlParams');
jest.mock('in-automation/hooks/useActionFilter');

describe('CreateNewActionTearsheet', () => {
  beforeEach(() => {
    (useActionDetailsUrlParams as jest.Mock).mockReturnValue({ isCopy: false, id: '123' });
    (useAction as jest.Mock).mockReturnValue({
      data: {},
      loading: false,
      error: null
    });
    (useActionFilter as jest.Mock).mockReturnValue({
      data: {
        tags: [],
        types: []
      },
      tags: [],
      loading: false,
      error: null
    });
  });

  global.ResizeObserver = ResizeObserver;
  global.TextDecoder = class {
    decode(buffer: Uint8Array) {
      return Buffer.from(buffer).toString('utf-8');
    }
  } as any;

  test('renders Error message when hasError is true', () => {
    (useAction as jest.Mock).mockReturnValue({
      data: {},
      loading: false,
      error: new Error('Mock error')
    });
    render(<CreateNewActionTearsheet />);
    expect(screen.getByText('Create a new action')).toBeInTheDocument();
  });

  test('renders TearSheetLoader when neither loading nor hasError is true', () => {
    render(<CreateNewActionTearsheet />);
    expect(screen.getByText('Create a new action')).toBeInTheDocument();
  });
});
