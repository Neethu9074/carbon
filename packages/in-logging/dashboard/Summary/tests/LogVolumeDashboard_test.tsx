/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import LogVolumeDashboard from '../LogVolume/LogVolumeDashboard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-hooks/useTimeConfig', () => jest.fn());

jest.mock('in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/utils', () => ({
  transformData: jest.fn(data => {
    if (Array.isArray(data) && data.length > 0) {
      return [{ totalVolume: { gb: data[0].totalVolume.gb } }];
    }
    return undefined;
  })
}));

jest.mock('in-subscription/getUnifiedMetrics', () => jest.fn());

jest.mock('in-logging/api/licence', () => ({
  isAddonUserCached: jest.fn()
}));

jest.mock('in-stores/user', () => ({
  role: { canViewLogVolume: false }
}));

describe('LogVolumeDashboard', () => {
  beforeEach(() => {
    (useTimeConfig as jest.Mock).mockReturnValue({ to: null, windowSize: 1, autoRefresh: false });
    (useObservable as jest.Mock).mockReturnValue({ progress: { loading: false }, data: [] });
  });

  it('renders without crashing', () => {
    render(<LogVolumeDashboard />);

    expect(screen.getByText('Current month log volume')).toBeInTheDocument();
  });

  it('displays log volume data when available', () => {
    const mockLogVolumeData = [{ totalVolume: { gb: 100 } }];

    (useObservable as jest.Mock).mockReturnValue({
      progress: { loading: false },
      data: mockLogVolumeData
    });

    render(<LogVolumeDashboard />);

    expect(screen.getByTestId('retentionValue')).toHaveTextContent('100');
    expect(screen.getByText('Current month log volume')).toBeInTheDocument();
  });
  it('shows no data when log volume data is unavailable', () => {
    render(<LogVolumeDashboard />);

    expect(screen.getByTestId('retentionValue')).toHaveTextContent('No data available');
  });

  it('shows loading state when data is loading', () => {
    (useObservable as jest.Mock).mockReturnValue({
      progress: { loading: true },
      data: []
    });

    render(<LogVolumeDashboard />);

    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
  });

  it('renders icon when user has logging addon', () => {
    (useObservable as jest.Mock)
      .mockReturnValueOnce({ progress: { loading: false }, data: [] })
      .mockReturnValueOnce(true);

    (role as any).canViewLogVolume = true;

    render(<LogVolumeDashboard />);

    expect(screen.getByText('Go to log volume')).toBeInTheDocument();
  });

  it('uses default values when result is undefined', () => {
    (useObservable as jest.Mock).mockReturnValue(undefined);

    render(<LogVolumeDashboard />);

    expect(screen.getByTestId('retentionValue')).toHaveTextContent('No data available');
  });
});
