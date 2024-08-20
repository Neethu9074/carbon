/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';

import useGetCustomDashboardPermissions from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboardPermissions';

jest.mock('@instana/hooks');

describe('useGetCustomDashboardPermissions', () => {
  it('should return permission as null by default', () => {
    const { result } = renderHook(() => useGetCustomDashboardPermissions('212'));
    expect(result.current).toBe(null);
  });

  it('should return Permission as shared when accessType = READ and relationType = GLOBAL', () => {
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
    const { result } = renderHook(() => useGetCustomDashboardPermissions('some-id'));
    expect(result.current).toBe('Shared');
  });

  it('should return Permission as Private when accessType != READ and relationType != GLOBAL', () => {
    const mockData = {
      data: {
        accessRules: [
          {
            accessType: 'X',
            relationType: 'Y'
          }
        ]
      }
    };
    useObservable.mockReturnValueOnce(mockData);
    const { result } = renderHook(() => useGetCustomDashboardPermissions('some-id'));
    expect(result.current).toBe('Private');
  });
});
