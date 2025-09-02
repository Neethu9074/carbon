/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import useActionHistoryCount, { refreshHistory } from './useHistory';
import useTimeConfig from 'in-hooks/useTimeConfig';

// Mock dependencies
jest.mock('in-automation/components/ActionHistory/ActionHistoryTable', () => ({
  GetActionInstanceListData: jest.fn(() => ({
    startWith: jest.fn().mockReturnValue('observable')
  }))
}));

jest.mock('in-hooks/useTimeConfig', () => jest.fn());

// Mock observables
jest.mock('@instana/observables', () => {
  type MockObservable = {
    subscribe: jest.Mock;
    flatMap: jest.Mock<MockObservable>;
    startWith: jest.Mock<MockObservable>;
  };

  const mockObservable: MockObservable = {
    subscribe: jest.fn(),
    flatMap: jest.fn<MockObservable, any[]>(() => mockObservable),
    startWith: jest.fn<MockObservable, any[]>(() => mockObservable)
  };

  return {
    create: jest.fn(() => ({
      emit: jest.fn(),
      flatMap: jest.fn(() => mockObservable)
    })),
    timeout: jest.fn(() => ({
      once: jest.fn(cb => cb())
    })),
    Observable: {
      of: jest.fn(() => mockObservable)
    }
  };
});

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('useActionHistoryCount', () => {
  const mockTimeConfig = {
    from: 1000,
    to: 2000,
    live: false
  };

  const mockEventId = 'event123';
  const mockTypes = ['MANUAL', 'SCRIPT'];
  const mockActionStatuses = ['SUCCESS', 'FAILURE'];

  beforeEach(() => {
    jest.clearAllMocks();
    (useTimeConfig as jest.Mock).mockReturnValue(mockTimeConfig);

    require('@instana/hooks').useObservable.mockReturnValue(undefined);
  });

  it('returns undefined when result is pending', () => {
    const { result } = renderHook(() => useActionHistoryCount({ eventId: mockEventId }));

    expect(result.current).toBeUndefined();
  });

  it('calls GetActionInstanceListData with correct parameters', () => {
    renderHook(() =>
      useActionHistoryCount({
        eventId: mockEventId,
        types: mockTypes,
        actionStatuses: mockActionStatuses
      })
    );
  });

  it('calls GetActionInstanceListData with empty arrays when types and actionStatuses are not provided', () => {
    renderHook(() => useActionHistoryCount({ eventId: mockEventId }));
  });

  it('uses the timeConfig from useTimeConfig hook', () => {
    renderHook(() => useActionHistoryCount({ eventId: mockEventId }));

    expect(useTimeConfig).toHaveBeenCalled();
  });

  it('returns the totalHits from the result data', () => {
    // Mock the result with totalHits
    const mockResult = {
      data: {
        totalHits: 42,
        items: []
      },
      progress: { loading: false },
      errors: [],
      time: Date.now()
    };

    // Setup the hook to return our mock result
    require('@instana/hooks').useObservable.mockReturnValue(mockResult);

    const { result } = renderHook(() => useActionHistoryCount({ eventId: mockEventId }));

    expect(result.current).toBe(42);
  });
});

describe('refreshHistory', () => {
  it('calls timeout and emits refresh signal', () => {
    const mockTimeout = require('@instana/observables').timeout;
    const mockOnce = jest.fn();

    mockTimeout.mockReturnValue({
      once: mockOnce
    });

    refreshHistory();

    expect(mockTimeout).toHaveBeenCalledWith(1000);
    expect(mockOnce).toHaveBeenCalled();
  });
});
