/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import useFilteredAndSortedSliConfigurations from 'in-custom-dashboards/widgets/SloLegacy/hooks/useFilteredAndSortedSliConfigurations';
import useSliConfigurations from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigurations';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigurations', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useFilteredAndSortedSliConfigurations', () => {
  it('returns all sli configurations for the requested entity if the request is successfully resolved', () => {
    // Given
    const sliConfigs = [
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        sliName: 'FTL Efficiency',
        sliEntity: {}
      },
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        sliName: 'Warp Efficiency',
        sliEntity: {}
      }
    ];
    useSliConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(sliConfigs)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedSliConfigurations('website', 'someId'));
    const [sliConfigurations] = result.current;

    // Then
    expect(sliConfigurations).toMatchObject(sliConfigs);
  });

  it('returns only sli configurations which match the given query', () => {
    // Given
    const sliConfigData = [
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        sliName: 'FTL Efficiency',
        sliEntity: {}
      },
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        sliName: 'Warp Efficiency',
        sliEntity: {}
      }
    ];
    useSliConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(sliConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedSliConfigurations('website', 'someId', 'warp'));
    const [sliConfigurations] = result.current;

    // Then
    expect(sliConfigurations).toMatchObject([sliConfigData[1]]);
  });

  it('returns sli configurations sorted by name ASC by default', () => {
    // Given
    const sliConfigData = [
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        sliName: 'Warp Efficiency',
        sliEntity: {}
      },
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        sliName: 'FTL Efficiency',
        sliEntity: {}
      }
    ];
    useSliConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(sliConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedSliConfigurations('website', 'someId'));
    const [sliConfigurations] = result.current;

    // Then
    expect(sliConfigurations).toEqual([
      expect.objectContaining({ sliName: 'FTL Efficiency' }),
      expect.objectContaining({ sliName: 'Warp Efficiency' })
    ]);
  });

  it('returns sli configurations sorted by name DESC if orderDirection is DESC', () => {
    // Given
    const sliConfigData = [
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        sliName: 'Warp Efficiency',
        sliEntity: {}
      },
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        sliName: 'FTL Efficiency',
        sliEntity: {}
      },
      {
        id: 'thirdApdexId',
        createdAt: Date.now(),
        sliName: 'Impulse Efficiency',
        sliEntity: {}
      }
    ];
    useSliConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(sliConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedSliConfigurations('website', 'someId', '', 'name', 'DESC'));
    const [sliConfigurations] = result.current;

    // Then
    expect(sliConfigurations).toEqual([
      expect.objectContaining({ sliName: 'Warp Efficiency' }),
      expect.objectContaining({ sliName: 'Impulse Efficiency' }),
      expect.objectContaining({ sliName: 'FTL Efficiency' })
    ]);
  });

  it('returns sli configurations not sorted if orderBy is not name', () => {
    // Given
    const sliConfigData = [
      {
        id: 'secondApdexId',
        createdAt: Date.now(),
        sliName: 'Warp Efficiency',
        sliEntity: {}
      },
      {
        id: 'firstApdexId',
        createdAt: Date.now(),
        sliName: 'FTL Efficiency',
        sliEntity: {}
      },
      {
        id: 'thirdApdexId',
        createdAt: Date.now(),
        sliName: 'Impulse Efficiency',
        sliEntity: {}
      }
    ];
    useSliConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success(sliConfigData)));

    // When
    const { result } = renderHook(() => useFilteredAndSortedSliConfigurations('website', 'someId', '', 'threshold'));
    const [sliConfigurations] = result.current;

    // Then
    expect(sliConfigurations).toEqual([
      expect.objectContaining({ sliName: 'Warp Efficiency' }),
      expect.objectContaining({ sliName: 'FTL Efficiency' }),
      expect.objectContaining({ sliName: 'Impulse Efficiency' })
    ]);
  });
});
