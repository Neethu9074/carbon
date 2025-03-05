/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { useObservable } from '@instana/hooks';

import LogVolumeDashboard from 'in-logging/dashboard/Summary/LogVolume/LogVolumeDashboard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-hooks/useTimeConfig', () => jest.fn());

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
    (useObservable as jest.Mock).mockReturnValue({ progress: { loading: false }, data: { logVolumeUsageItems: [] } });
  });

  it('displays log volume data when available', () => {
    const expectedGB = 1;
    const GBtoBytes = expectedGB * Math.pow(1024, 3);

    const mockLogVolumeData = {
      logVolumeUsageItems: [
        {
          numberOfMonth: 2,
          logVolume: GBtoBytes,
          retentionPeriods: [
            {
              retentionDays: 30,
              logVolume: GBtoBytes
            }
          ]
        }
      ]
    };

    (useObservable as jest.Mock).mockReturnValue({
      progress: { loading: false },
      data: mockLogVolumeData
    });

    render(<LogVolumeDashboard />);

    expect(screen.getByTestId('retentionValue')).toHaveTextContent(String(expectedGB));
    expect(screen.getByText('Current month log volume')).toBeInTheDocument();
  });
  it('shows no data when log volume data is unavailable', () => {
    (useObservable as jest.Mock).mockReturnValue({
      progress: { loading: true },
      data: undefined
    });
    render(<LogVolumeDashboard />);

    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
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
    const expectedGB = 1;
    const GBtoBytes = expectedGB * Math.pow(1024, 3);

    const mockLogVolumeData = {
      logVolumeUsageItems: [
        {
          numberOfMonth: 2,
          logVolume: GBtoBytes,
          retentionPeriods: [
            {
              retentionDays: 30,
              logVolume: GBtoBytes
            }
          ]
        }
      ]
    };
    (useObservable as jest.Mock)
      .mockReturnValue({
        progress: { loading: false },
        data: mockLogVolumeData
      })
      .mockReturnValueOnce(true);

    (role as any).canViewLogVolume = true;

    render(<LogVolumeDashboard />);

    expect(screen.getByText('Go to log volume')).toBeInTheDocument();
  });
});
