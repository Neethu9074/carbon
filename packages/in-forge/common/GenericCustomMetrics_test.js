/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/** @jest-environment jsdom */
/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';

import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import GenericCustomMetrics from 'in-forge/common/GenericCustomMetrics';

// Mock dependencies
jest.mock('in-sdk/components/dashboard/CustomMetricsV2', () => jest.fn(() => <div data-testid="custom-metrics" />));
jest.mock('in-sdk/components/dashboard/DashboardNotification', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('in-services/formatters/number', () => ({
  number: {
    detailed: jest.fn()
  }
}));
jest.mock('in-i18n', () => ({
  t: key => key
}));
jest.mock('in-forge/common/GenericCustomColumns', () => ({
  VALUE: [{ id: 'mockColumn' }]
}));

describe('GenericCustomMetrics', () => {
  const snapshotWithMetrics = {
    get: jest.fn().mockReturnValue({
      size: 1
    })
  };

  const snapshotWithoutMetrics = {
    get: jest.fn().mockReturnValue({
      size: 0
    })
  };

  const timeConfig = { from: 0, to: 100 };
  const titlePrefix = 'TestPrefix';

  it('renders CustomMetricsV2 when metrics exist', () => {
    render(<GenericCustomMetrics snapshot={snapshotWithMetrics} timeConfig={timeConfig} titlePrefix={titlePrefix} />);

    expect(CustomMetricsV2).toHaveBeenCalledWith(
      expect.objectContaining({
        snapshot: snapshotWithMetrics,
        timeConfig,
        titlePrefix,
        //specs: SPECS,
        customColumns: [{ id: 'mockColumn' }]
      }),
      {}
    );
    expect(screen.getByTestId('custom-metrics')).toBeInTheDocument();
  });

  it('renders DashboardNotification when no metrics exist', () => {
    render(
      <GenericCustomMetrics snapshot={snapshotWithoutMetrics} timeConfig={timeConfig} titlePrefix={titlePrefix} />
    );
    expect(screen.getByText('in-sdk:dashboard.customMetricsV2.noMetrics')).toBeInTheDocument();
  });
  it('renders DashboardNotification when no metric IDs are present', () => {
    const mockSnapshot = {
      get: jest.fn().mockReturnValue({
        size: 0
      })
    };

    const { getByText } = render(<GenericCustomMetrics snapshot={mockSnapshot} timeConfig={{}} />);
    expect(getByText('in-sdk:dashboard.customMetricsV2.noMetrics')).toBeInTheDocument();
  });
});
