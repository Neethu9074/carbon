/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import useFilteredApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useFilteredApdexConfigurations';
import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Apdex/hooks/useFilteredApdexConfigurations', () => {
  it('returns all apdex configurations for the requested entity if the request is successfully resolved', () => {
    // Given
    const apdexConfigs = resultToFetchedStateResponse(
      success([
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
      ])
    );
    useApdexConfigurations.mockReturnValueOnce(apdexConfigs);

    // When
    const { result } = renderHook(() => useFilteredApdexConfigurations('website', 'someId'));
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
    const { result } = renderHook(() => useFilteredApdexConfigurations('website', 'someId', 'warp'));
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toMatchObject(resultToFetchedStateResponse(success([{ ...apdexConfigData[1] }])));
  });
});
