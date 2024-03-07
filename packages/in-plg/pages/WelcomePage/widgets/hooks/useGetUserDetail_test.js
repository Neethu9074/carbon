/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';

import useGetUserDetail from 'in-plg/pages/WelcomePage/widgets/hooks/useGetUserDetail';

jest.mock('@instana/hooks');
jest.mock('in-api/users');

describe('useGetCustomDashboard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if userId is invalid', () => {
    const { result } = renderHook(() => useGetUserDetail('invalid'));
    expect(result.current).toBe(undefined);
  });

  it('should return valid user if userId is valid', () => {
    const userMockData = {
      id: 'some-user-id',
      fullName: 'some-full-name'
    };
    useObservable.mockReturnValueOnce(userMockData);
    const { result } = renderHook(() => useGetUserDetail('valid-id'));
    expect(result.current).toBe(userMockData);
  });
});
