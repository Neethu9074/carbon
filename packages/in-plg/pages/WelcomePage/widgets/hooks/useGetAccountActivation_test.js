/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';

import useGetAccountActivation from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';

jest.mock('@instana/hooks');

describe('useGetAccountActivation', () => {
  it('should return undefined by default', () => {
    const { result } = renderHook(() => useGetAccountActivation());
    expect(result.current).toBe(undefined);
  });

  it('should return activation details ', () => {
    const mockData = {
      data: {
        activation: {
          'instana#plg': {
            c: {
              status: false
            }
          }
        }
      }
    };
    useObservable.mockReturnValueOnce(mockData);
    const { result } = renderHook(() => useGetAccountActivation());
    expect(result.all[1]).toStrictEqual({ 'instana#plg': { c: { status: false } } });
  });
});
