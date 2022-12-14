/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable as uO } from '@instana/hooks';

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import useEndpoints from 'in-applications/hooks/useEndpoints';
import gE from 'in-applications/subscriptions/getEndpoints';
import { GetEndpointsQuery, TimeConfig } from 'in-types';
import uTC from 'in-hooks/useTimeConfig';

jest.mock('in-hooks/useTimeConfig', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('in-applications/subscriptions/getEndpoints', () => {
  const { success } = jest.requireActual('in-services/util/result');
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just(success({})))
  };
});
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn((o, d) => o(d))
}));

const useTimeConfig = uTC as jest.MockedFunction<typeof uTC>;
const getEndpoints = gE as jest.MockedFunction<typeof gE>;
const useObservable = uO as jest.MockedFunction<typeof uO>;

describe('in-applications/hooks/useEndpoints', () => {
  beforeEach(jest.clearAllMocks);

  it('passes valid query to getEndpoints', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {
      application: 'Stans Lab',
      service: 'auth',
      filter: {
        applicationBoundaryScope: 'INBOUND',
        includeInternalCalls: true,
        includeSyntheticCalls: true,
        useLongTermDataOnly: true,
        timeConfig: {
          windowSize: 1,
          to: 2,
          focusedMoment: 3,
          autoRefresh: false
        }
      },
      metrics: {
        calls: {
          aggregation: 'P90',
          granularity: 60,
          metric: 'calls'
        }
      },
      order: {
        by: 'endpointLabel',
        direction: 'DESC'
      },
      pagination: {
        page: 2,
        pageSize: 4
      },
      supportedOrderByCriteria: true,
      tagFilterExpression: emptyTagFilterExpression
    };
    const expectedQuery: GetEndpointsQuery = {
      filter: {
        application: 'Stans Lab',
        service: 'auth',
        applicationBoundaryScope: 'INBOUND',
        includeInternalCalls: true,
        includeSyntheticCalls: true,
        useLongTermDataOnly: true,
        timeConfig: {
          windowSize: 1,
          to: 2,
          focusedMoment: 3,
          autoRefresh: false
        }
      },
      metrics: {
        calls: {
          aggregation: 'P90',
          granularity: 60,
          metric: 'calls'
        }
      },
      order: {
        by: 'endpointLabel',
        direction: 'DESC'
      },
      pagination: {
        page: 2,
        pageSize: 4
      },
      supportedOrderByCriteria: true,
      tagFilterExpression: emptyTagFilterExpression
    };

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(expectedQuery);
  });

  it('applies default filters if none are provided', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {};
    useTimeConfig.mockReturnValue({
      windowSize: 1,
      to: 2,
      focusedMoment: 3,
      autoRefresh: false
    });
    const expectedQuery: GetEndpointsQuery = {
      filter: {
        application: undefined,
        service: undefined,
        includeInternalCalls: false,
        includeSyntheticCalls: false,
        useLongTermDataOnly: false,
        timeConfig: {
          windowSize: 1,
          to: 2,
          focusedMoment: 3,
          autoRefresh: false
        }
      },
      metrics: {},
      order: {
        by: 'endpointLabel',
        direction: 'ASC'
      },
      pagination: {
        page: 1,
        pageSize: 100
      },
      supportedOrderByCriteria: false
    };

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(expectedQuery);
  });

  it('merges provided filters over default ones', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {
      filter: {
        includeInternalCalls: true
      }
    };

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({
          includeInternalCalls: true,
          includeSyntheticCalls: false
        })
      })
    );
  });

  it('applies default ordering if none is provided', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {};

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        order: expect.objectContaining({
          by: 'endpointLabel',
          direction: 'ASC'
        })
      })
    );
  });

  it('merges provided ordering over default one', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {
      order: {
        by: 'IdontKnowDoYou?'
      }
    };

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        order: expect.objectContaining({
          by: 'IdontKnowDoYou?',
          direction: 'ASC'
        })
      })
    );
  });

  it('applies default pagination if none is provided', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {};

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        pagination: expect.objectContaining({
          page: 1,
          pageSize: 100
        })
      })
    );
  });

  it('merges provided pagination over default one', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {
      pagination: {
        page: 3
      }
    };

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        pagination: expect.objectContaining({
          page: 3,
          pageSize: 100
        })
      })
    );
  });

  it('applies current timeConfig if none is provided', () => {
    // Given
    const props: Parameters<typeof useEndpoints>[0] = {};
    useTimeConfig.mockReturnValue({
      windowSize: 1,
      to: 2,
      focusedMoment: 3,
      autoRefresh: false
    });

    // When
    const { result } = renderHook(() => useEndpoints(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({
          timeConfig: {
            windowSize: 1,
            to: 2,
            focusedMoment: 3,
            autoRefresh: false
          }
        })
      })
    );
  });

  it('provides a dependency list to useObservable that only changes when contents of the filter change', () => {
    // Given
    const props = {
      application: 'Stans Lab',
      service: 'delivery'
    };
    useTimeConfig.mockReturnValue({} as TimeConfig);

    // When
    const { rerender } = renderHook(useEndpoints, { initialProps: { ...props } });

    rerender({ ...props });

    useTimeConfig.mockReturnValue({} as TimeConfig); // Creating new object instance to pass referential equality checks
    rerender({
      application: 'Stans Lab',
      service: 'support'
    });
    const [[, dependencies1], [, dependencies2], [, dependencies3]] = useObservable.mock.calls;

    // Using referential equality check (Object.is) here to mimic react behaviour
    dependencies2.forEach((value, index) => {
      expect(value).toBe(dependencies1[index]);
    });
    dependencies3.forEach((value, index) => {
      expect(value).not.toBe(dependencies1[index]);
    });
  });
});
