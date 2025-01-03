/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { LogItem } from '@instana/types';

import LogExceptionDialog from 'in-logging/analyze/AnalyzeView/components/LogExceptionDialog';
import LogExceptionWrapper from 'in-logging/analyze/AnalyzeView/components/LogException';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

jest.mock('in-components/DialogPresenter/store');

const exceptionType = 'IllegalArgumentException';
const exceptionMessage = 'Invalid input provided';
const stackTrace = 'at com.example.app.InputValidator.validateString(InputValidator.java:42)';

const mockLogItem = {
  itemId: '123456',
  timestamp: 1735206990177,
  message: 'Mock error message',
  tags: [
    {
      name: 'log.level',
      stringValue: 'ERROR'
    },
    {
      name: 'log.exception.type',
      stringValue: exceptionType
    },
    {
      name: 'log.exception.message',
      stringValue: exceptionMessage
    },
    {
      name: 'log.exception.stackTrace',
      stringValue: stackTrace
    }
  ]
};

describe('Exceptions and stack traces in log list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('log exception is displayed correctly when data is available and expands on click', async () => {
    const { findByText } = render(<LogExceptionWrapper item={mockLogItem as LogItem} />);

    const exceptionMessageElement = await findByText(exceptionMessage, { exact: false });

    expect(exceptionMessageElement).toBeInTheDocument();

    fireEvent.click(exceptionMessageElement);

    expect(addActiveDialog).toHaveBeenCalled();
  });

  it('expanded log exception is displayed correctly when data is available', async () => {
    const { findByText } = render(<LogExceptionWrapper item={mockLogItem as LogItem} isToggled />);

    expect(await findByText(exceptionMessage)).toBeInTheDocument();
    expect(await findByText(exceptionType, { exact: false })).toBeInTheDocument();
    expect(await findByText(stackTrace)).toBeInTheDocument();
  });

  it('log exception dialog is displayed correctly', async () => {
    const onClose = jest.fn();

    const { findByText, debug } = render(<LogExceptionDialog onClose={onClose} item={mockLogItem as LogItem} />);

    expect(await findByText(exceptionMessage)).toBeInTheDocument();
    expect(await findByText(exceptionType, { exact: false })).toBeInTheDocument();
    expect(await findByText(stackTrace)).toBeInTheDocument();

    debug();
  });
});
