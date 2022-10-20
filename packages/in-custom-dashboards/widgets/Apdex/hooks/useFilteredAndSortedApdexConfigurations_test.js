/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import useFilteredAndSortedApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useFilteredAndSortedApdexConfigurations';
import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Apdex/hooks/useFilteredAndSortedApdexConfigurations', () => {
  it('returns all apdex configurations for the requested entity if the request is successfully resolved', () => {
    // Given
    const apdexConfigs = [
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        apdexName: 'FTL Efficiency',
        apdexEntity: {}
      },
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        apdexName: 'Warp Efficiency',
        apdexEntity: {}
      }
    ];
    useApdexConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(apdexConfigs)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedApdexConfigurations('website', 'someId'));
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toMatchObject(apdexConfigs);
  });

  it('returns only apdex configurations which match the given query', () => {
    // Given
    const apdexConfigData = [
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        apdexName: 'FTL Efficiency',
        apdexEntity: {}
      },
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        apdexName: 'Warp Efficiency',
        apdexEntity: {}
      }
    ];
    useApdexConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(apdexConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedApdexConfigurations('website', 'someId', 'warp'));
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toMatchObject([apdexConfigData[1]]);
  });

  it('returns apdex configurations sorted by name ASC by default', () => {
    // Given
    const apdexConfigData = [
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        apdexName: 'Warp Efficiency',
        apdexEntity: {}
      },
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        apdexName: 'FTL Efficiency',
        apdexEntity: {}
      }
    ];
    useApdexConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(apdexConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedApdexConfigurations('website', 'someId'));
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toEqual([
      expect.objectContaining({ apdexName: 'FTL Efficiency' }),
      expect.objectContaining({ apdexName: 'Warp Efficiency' })
    ]);
  });

  it('returns apdex configurations sorted by name DESC if orderDirection is DESC', () => {
    // Given
    const apdexConfigData = [
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        apdexName: 'Warp Efficiency',
        apdexEntity: {}
      },
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        apdexName: 'FTL Efficiency',
        apdexEntity: {}
      },
      {
        id: 'thirdApdexId',
        createdAt: Date.now(),
        apdexName: 'Impulse Efficiency',
        apdexEntity: {}
      }
    ];
    useApdexConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(apdexConfigData)));

    // When
    const { result } = renderHook(() =>
      useFilteredAndSortedApdexConfigurations('website', 'someId', '', 'name', 'DESC')
    );
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toEqual([
      expect.objectContaining({ apdexName: 'Warp Efficiency' }),
      expect.objectContaining({ apdexName: 'Impulse Efficiency' }),
      expect.objectContaining({ apdexName: 'FTL Efficiency' })
    ]);
  });

  it('returns apdex configurations not sorted if orderBy is not name', () => {
    // Given
    const apdexConfigData = [
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        apdexName: 'Warp Efficiency',
        apdexEntity: {}
      },
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        apdexName: 'FTL Efficiency',
        apdexEntity: {}
      },
      {
        id: 'thirdApdexId',
        createdAt: Date.now(),
        apdexName: 'Impulse Efficiency',
        apdexEntity: {}
      }
    ];
    useApdexConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(apdexConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedApdexConfigurations('website', 'someId', '', 'threshold'));
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toEqual([
      expect.objectContaining({ apdexName: 'Warp Efficiency' }),
      expect.objectContaining({ apdexName: 'FTL Efficiency' }),
      expect.objectContaining({ apdexName: 'Impulse Efficiency' })
    ]);
  });
});
