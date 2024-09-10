/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { getAllSloConfigurations } from 'in-service-levels/api/configuration';
import useSelectedIds from 'in-service-levels/hooks/useSelectedIds';

jest.mock('in-service-levels/api/configuration');
const mockGetSloConfigurations = getAllSloConfigurations as jest.MockedFunction<typeof getAllSloConfigurations>;

describe('in-service-levels/hooks/useSelectedIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllSloConfigurations should be called with the given selectedId', () => {
    // Given
    const selected = ['SLO-1'];
    // When
    renderHook(() => {
      useSelectedIds(selected);
    });
    // Then
    expect(mockGetSloConfigurations).toBeCalledWith({
      ids: selected
    });
  });

  it('getAllSloConfigurations will not be executed  if no selectedId is present', () => {
    // When
    renderHook(() => {
      useSelectedIds([]);
    });
    // Then
    expect(mockGetSloConfigurations).not.toHaveBeenCalled();
  });
});
