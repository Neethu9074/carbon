/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  CarbonDeletionTable,
  DeletionTable
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { DeleteLogsHistoryResult, Result } from 'in-types';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('CarbonDeletionTable', () => {
  const mockOpenConfirmationDialog = jest.fn();

  const renderComponent = (result: Result<DeleteLogsHistoryResult>) => {
    const { container } = render(
      <CarbonDeletionTable result={result} openConfirmationDialog={mockOpenConfirmationDialog} />
    );
    return container;
  };

  it('renders loading state', () => {
    const container = renderComponent({ errors: [], progress: { loading: true } });

    expect(container.querySelector('.cds--skeleton')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    renderComponent({ data: { deletions: [] }, errors: [], progress: { loading: false } });

    expect(screen.getByTestId('deletionTableEmpty')).toBeInTheDocument();
  });

  it('renders error state', () => {
    renderComponent({ errors: [{ code: 'SERVER', message: 'Server error' }], progress: { loading: false } });

    expect(screen.getByTestId('deletionTableErrorMessage')).toBeInTheDocument();
  });

  it('renders data table when deletions exist', () => {
    const mockResult: Result<DeleteLogsHistoryResult> = {
      data: {
        deletions: [
          {
            deletedLineCount: 100,
            deletedStatus: 'Done',
            reason: 'Test reason',
            timestamp: 1638500000000,
            triggeredByUser: 'testUser'
          }
        ]
      },
      errors: [],
      progress: { loading: false }
    };

    renderComponent(mockResult);

    expect(screen.getByText('Test reason')).toBeInTheDocument();
    expect(screen.getByText('testUser')).toBeInTheDocument();
  });
});

describe('DeletionTable', () => {
  it('should render CarbonDeletionTable with observable result', () => {
    const mockResult: Result<DeleteLogsHistoryResult> = {
      data: { deletions: [] },
      errors: [],
      progress: { loading: false }
    };

    (useObservable as jest.Mock).mockReturnValue(mockResult);

    render(<DeletionTable isDeleting={false} openConfirmationDialog={jest.fn()} handleIsInProgress={jest.fn()} />);

    expect(screen.getByTestId('deletionTableEmpty')).toBeInTheDocument();
  });

  it('should render CarbonDeletionTable with observable result', () => {
    const mockResult: Result<DeleteLogsHistoryResult> = {
      data: {
        deletions: [
          {
            deletedLineCount: 100,
            deletedStatus: 'Done',
            reason: 'Test reason',
            timestamp: 1638500000000,
            triggeredByUser: 'testUser'
          }
        ]
      },
      errors: [],
      progress: { loading: false }
    };

    (useObservable as jest.Mock).mockReturnValue(mockResult);

    render(<DeletionTable isDeleting={false} openConfirmationDialog={jest.fn()} handleIsInProgress={jest.fn()} />);

    expect(screen.getByText('Test reason')).toBeInTheDocument();
    expect(screen.getByText('testUser')).toBeInTheDocument();
  });
});
