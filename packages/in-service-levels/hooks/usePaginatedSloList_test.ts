/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { PaginatedResult, ServiceLevelObjectiveConfiguration } from '@instana/types';

import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import usePaginatedSloList from 'in-service-levels/hooks/usePaginatedSloList';
import { FetchedState } from 'in-hooks/utils/types';

jest.mock('in-service-levels/hooks/useSloConfigurations');

const mockUseConfigurations = useSloConfigurations as jest.MockedFunction<typeof useSloConfigurations>;

describe('in-service-levels/hooks/usePaginatedSloList', () => {
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
    // Given
    const entityType = 'application';
    // When
    renderHook(() => usePaginatedSloList({ page: 1, query: '', entityType }));
    // Then
    const calledWithArgs = mockUseConfigurations.mock.calls[0][0];
    expect(calledWithArgs.entityType).toBe(entityType);
  });

  it('useSloConfigurations must be called with the given query', () => {
    // Given
    const query = 'test';
    // When
    renderHook(() => usePaginatedSloList({ page: 1, query, entityType: 'application' }));
    // Then
    const calledWithArgs = mockUseConfigurations.mock.calls[0][0];
    expect(calledWithArgs.query).toBe(query);
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
