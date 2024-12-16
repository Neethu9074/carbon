/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { ActionInstanceDialogTitle } from 'in-automation/components/ActionHistory/ActionInstanceDialogTitle';
import { t } from 'in-i18n';

jest.mock('in-automation/components/ActionHistory/ActionHistoryTable', () => ({
  getStatus: jest.fn()
}));
jest.mock('in-components/Dialog/Header', () => ({
  Title: ({ title }: { title: string }) => <div data-testid="title">{title} </div>
}));
jest.mock(
  'in-components/layout/HorizontalFlexWrapper',
  () =>
    ({ children, className }: { children: React.ReactNode; className?: string }) =>
      <div className={className}>{children}</div>
);

describe('ActionInstanceDialogTitle', () => {
  const mockStatus = 'COMPLETED';
  const mockTitle = 'Sample Title';

  it('renders without crashing', () => {
    render(<ActionInstanceDialogTitle title={mockTitle} status={mockStatus} />);
    expect(screen.getByTestId('title')).toHaveTextContent(mockTitle);
  });

  it('displays status when provided', () => {
    const getStatus = require('in-automation/components/ActionHistory/ActionHistoryTable').getStatus;
    getStatus.mockReturnValueOnce('Completed');
    render(<ActionInstanceDialogTitle title={mockTitle} status={mockStatus} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays unknown status when no status is provided', () => {
    render(<ActionInstanceDialogTitle title={mockTitle} status="" />);
    expect(screen.getByText(t('in-automation:actionHistory.unknown'))).toBeInTheDocument();
  });

  it('calls getStatus correctly', () => {
    const getStatus = require('in-automation/components/ActionHistory/ActionHistoryTable').getStatus;
    render(<ActionInstanceDialogTitle title={mockTitle} status={mockStatus} />);
    expect(getStatus).toHaveBeenCalledWith(mockStatus);
  });
});
