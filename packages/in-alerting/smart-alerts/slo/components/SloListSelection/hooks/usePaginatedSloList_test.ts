/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { PaginatedResult, ServiceLevelObjectiveConfiguration } from '@instana/types';

import {
  testApplicationSloConfig,
  testDate,
  testWebsiteSloConfig
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import { usePaginatedSloList } from 'in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import { FetchedState } from 'in-hooks/utils/types';

jest.mock('in-service-levels/hooks/useSloConfigurations');

const mockUseConfigurations = useSloConfigurations as jest.MockedFunction<typeof useSloConfigurations>;

describe('in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList', () => {
  it('should list application SLOs when entity type is application', () => {
    // Given
    const paginatedSloConfig = [
      {
        items: [testApplicationSloConfig],
        page: 1,
        pageSize: 1,
        totalHits: 7
      },
      'resolved',
      [],
      { loading: false }
    ] as FetchedState<PaginatedResult<ServiceLevelObjectiveConfiguration>>;

    mockUseConfigurations.mockReturnValue(paginatedSloConfig);

    // When
    const { result } = renderHook(() => usePaginatedSloList({ page: 1, query: '', entityType: 'application' }));
    expect(result.current.sloList[0].entityType).toStrictEqual('application');

    expect(result.current.page).toBe(1);
  });

  it('should list website SLOs when entity type is website', () => {
    // Given
    const paginatedSloConfig = [
      {
        items: [testWebsiteSloConfig],
        page: 1,
        pageSize: 1,
        totalHits: 7
      },
      'resolved',
      [],
      { loading: false }
    ] as FetchedState<PaginatedResult<ServiceLevelObjectiveConfiguration>>;

    mockUseConfigurations.mockReturnValue(paginatedSloConfig);

    // When
    const { result } = renderHook(() => usePaginatedSloList({ page: 1, query: '', entityType: 'application' }));
    // Then
    expect(result.current.sloList[0].entityType).toStrictEqual('website');
  });

  it('The SLO list must match based on the query', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [
      {
        id: 'SLO-1',
        name: 'Test-1',
        target: 0.85,
        entity: {
          type: 'application',
          applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
          boundaryScope: 'ALL'
        },
        indicator: {
          type: 'timeBased',
          threshold: 0.1,
          blueprint: 'availability'
        },
        tags: ['andre', 'test'],
        timeWindow: {
          startTimestamp: testDate.getTime(),
          duration: 1,
          durationUnit: 'week',
          type: 'fixed'
        } as const
      },
      {
        id: 'SLO-2',
        name: 'Test-2',
        target: 0.85,
        entity: {
          type: 'application',
          applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
          boundaryScope: 'ALL'
        },
        indicator: {
          type: 'timeBased',
          threshold: 0.1,
          blueprint: 'availability'
        },
        tags: ['andre', 'test'],
        timeWindow: {
          startTimestamp: testDate.getTime(),
          duration: 1,
          durationUnit: 'week',
          type: 'fixed'
        } as const
      }
    ];
    const paginatedSloConfig = [
      {
        items: configurations,
        page: 1,
        pageSize: 1,
        totalHits: 7
      },
      'resolved',
      [],
      { loading: false }
    ] as FetchedState<PaginatedResult<ServiceLevelObjectiveConfiguration>>;

    mockUseConfigurations.mockReturnValue(paginatedSloConfig);

    // When
    const { result } = renderHook(() => usePaginatedSloList({ page: 1, query: 'test', entityType: 'application' }));
    // Then
    expect(result.current.sloList).toEqual([
      { entityName: '', entityType: 'application', id: 'SLO-1', label: 'Test-1' },
      { entityName: '', entityType: 'application', id: 'SLO-2', label: 'Test-2' }
    ]);
  });

  it('The slolist must be empty if there is no match in the query', () => {
    // Given
    const paginatedSloConfig = [
      {
        items: [],
        page: 1,
        pageSize: 1,
        totalHits: 7
      },
      'resolved',
      [],
      { loading: false }
    ] as FetchedState<PaginatedResult<ServiceLevelObjectiveConfiguration>>;

    mockUseConfigurations.mockReturnValue(paginatedSloConfig);
    // When
    const { result } = renderHook(() => usePaginatedSloList({ page: 1, query: 'exit', entityType: 'application' }));
    // Then
    expect(result.current.sloList).toEqual([]);
  });

  it('The slolist must be empty if the data from the useConfiguration hook is in loading state', () => {
    // Given
    const paginatedSloConfig = [undefined, 'pending', [], { loading: true }] as FetchedState<
      PaginatedResult<ServiceLevelObjectiveConfiguration>
    >;

    mockUseConfigurations.mockReturnValue(paginatedSloConfig);

    // When
    const { result } = renderHook(() => usePaginatedSloList({ page: 1, query: '', entityType: 'website' }));
    // Then
    expect(result.current.sloList).toEqual([]);
  });
});
