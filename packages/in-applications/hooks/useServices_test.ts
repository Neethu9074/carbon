/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable as uO } from '@instana/hooks';

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import useServices from 'in-applications/hooks/useServices';
import gS from 'in-applications/subscriptions/getServices';
import { GetServicesQuery, TimeConfig } from 'in-types';
import uTC from 'in-hooks/useTimeConfig';

jest.mock('in-hooks/useTimeConfig', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('in-applications/subscriptions/getServices', () => {
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
const getServices = gS as jest.MockedFunction<typeof gS>;
const useObservable = uO as jest.MockedFunction<typeof uO>;

describe('in-applications/hooks/useEndpoints', () => {
  beforeEach(jest.clearAllMocks);

  it('passes valid query to getServices', () => {
    // Given
    const props: Parameters<typeof useServices>[0] = {
      application: 'Stans Lab',
      filter: {
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
      contextScope: 'DOWNSTREAM',
      tagFilterExpression: emptyTagFilterExpression
    };
    const expectedQuery: GetServicesQuery = {
      filter: {
        application: 'Stans Lab',
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
      contextScope: 'DOWNSTREAM',
      tagFilterExpression: emptyTagFilterExpression,
      includeProcessSnapshotIds: false
    };

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(expectedQuery);
  });

  it('applies default filters if none are provided', () => {
    // Given
    const props: Parameters<typeof useServices>[0] = {};
    useTimeConfig.mockReturnValue({
      windowSize: 1,
      to: 2,
      focusedMoment: 3,
      autoRefresh: false
    });
    const expectedQuery: GetServicesQuery = {
      filter: {
        application: undefined,
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
        by: 'serviceLabel',
        direction: 'ASC'
      },
      pagination: {
        page: 1,
        pageSize: 100
      },
      contextScope: 'NONE',
      includeProcessSnapshotIds: false
    };

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(expectedQuery);
  });

  it('merges provided filters over default ones', () => {
    // Given
    const props: Parameters<typeof useServices>[0] = {
      filter: {
        includeInternalCalls: true
      }
    };

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(
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
    const props: Parameters<typeof useServices>[0] = {};

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(
      expect.objectContaining({
        order: expect.objectContaining({
          by: 'serviceLabel',
          direction: 'ASC'
        })
      })
    );
  });

  it('merges provided ordering over default one', () => {
    // Given
    const props: Parameters<typeof useServices>[0] = {
      order: {
        by: 'IdontKnowDoYou?'
      }
    };

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(
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
    const props: Parameters<typeof useServices>[0] = {};

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(
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
    const props: Parameters<typeof useServices>[0] = {
      pagination: {
        page: 3
      }
    };

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(
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
    const props: Parameters<typeof useServices>[0] = {};
    useTimeConfig.mockReturnValue({
      windowSize: 1,
      to: 2,
      focusedMoment: 3,
      autoRefresh: false
    });

    // When
    const { result } = renderHook(() => useServices(props));

    // Then
    const [, status] = result.current;
    expect(status).toEqual('resolved');
    expect(getServices).toHaveBeenLastCalledWith(
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
      application: 'Stans Lab'
    };
    useTimeConfig.mockReturnValue({} as TimeConfig);

    // When
    const { rerender } = renderHook(useServices, { initialProps: { ...props } });

    rerender({ ...props });

    useTimeConfig.mockReturnValue({} as TimeConfig); // Creating new object instance to pass referential equality checks
    rerender({
      application: 'All Services'
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
