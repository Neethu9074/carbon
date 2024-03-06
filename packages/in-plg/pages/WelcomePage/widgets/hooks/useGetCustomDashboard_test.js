/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';

import useGetCustomDashboard from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboard';

jest.mock('@instana/hooks');

describe('useGetCustomDashboard', () => {
  it('should return null if dashboardId is invalid', () => {
    const { result } = renderHook(() => useGetCustomDashboard('invalid'));
    expect(result.current).toBe(null);
  });

  it('should return null if dashboardId is null', () => {
    const { result } = renderHook(() => useGetCustomDashboard(null));
    expect(result.current).toBe(null);
  });

  it('should return valid dashboard if dashboardId is valid', () => {
    const mockData = {
      data: {
        accessRules: [
          {
            accessType: 'READ',
            relationType: 'GLOBAL'
          }
        ]
      }
    };
    useObservable.mockReturnValueOnce(mockData);
    const { result } = renderHook(() => useGetCustomDashboard('valid-id'));
    expect(result.current).toBe(mockData.data);
  });
});
