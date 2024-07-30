/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { PaginatedResult, ServiceLevelObjectiveConfiguration } from '@instana/types';

import { usePaginatedSloList } from 'in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import { FetchedState } from 'in-hooks/utils/types';

jest.mock('in-service-levels/hooks/useSloConfigurations');

const mockUseConfigurations = useSloConfigurations as jest.MockedFunction<typeof useSloConfigurations>;

describe('in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('useSloConfigurations must be called with the given entityType  ', () => {
    // When
    renderHook(() => usePaginatedSloList({ page: 1, query: '', entityType: 'application' }));
    // Then
    const calledWithArgs = mockUseConfigurations.mock.calls[0][0];
    expect(mockUseConfigurations).toHaveBeenLastCalledWith(
      expect.objectContaining({
        entityType: 'application',
        orderBy: 'name',
        page: 1,
        pageSize: 6,
        query: ''
      })
    );
    expect(calledWithArgs.entityType).toBe('application');
  });

  it('useSloConfigurations must be called with the given query', () => {
    // When
    renderHook(() => usePaginatedSloList({ page: 1, query: 'test', entityType: 'application' }));
    // Then
    const calledWithArgs = mockUseConfigurations.mock.calls[0][0];
    expect(mockUseConfigurations).toHaveBeenLastCalledWith(
      expect.objectContaining({
        entityType: 'application',
        orderBy: 'name',
        page: 1,
        pageSize: 6,
        query: 'test'
      })
    );
    expect(calledWithArgs.query).toBe('test');
  });

  it('useSloConfigurations must be called with the given page', () => {
    // When
    renderHook(() => usePaginatedSloList({ page: 1, query: '', entityType: 'website' }));
    // Then
    const calledWithArgs = mockUseConfigurations.mock.calls[0][0];
    expect(mockUseConfigurations).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'website',
        orderBy: 'name',
        page: 1,
        pageSize: 6,
        query: ''
      })
    );
    expect(calledWithArgs.page).toBe(1);
  });
});
