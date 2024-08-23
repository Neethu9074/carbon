/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import { Result, SliConfigMetricConfiguration, SliConfigurationWithLastUpdated, SliEntityUnion } from 'in-types';
import useSliConfiguration from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration';
import { getSliConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => {
  return {
    ...jest.requireActual('in-custom-dashboards/widgets/SloLegacy/sli/api'),
    getSliConfiguration: jest.fn(),
    __esModule: true
  };
});

const getSliConfigurationMock = getSliConfiguration as jest.MockedFunction<typeof getSliConfiguration>;

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration', () => {
  it('returns a SLI configuration if request is successfully resolved.', () => {
    // GIVEN
    const mockSli: Result<SliConfigurationWithLastUpdated> = {
      data: {
        id: 'id',
        initialEvaluationTimestamp: 123,
        metricConfiguration: {} as SliConfigMetricConfiguration,
        sliEntity: {} as SliEntityUnion,
        sliName: 'Awesome SLI',
        lastUpdated: 123
      },
      errors: [],
      progress: { loading: false }
    };

    getSliConfigurationMock.mockReturnValueOnce(just(mockSli));

    // WHEN
    const { result } = renderHook(() => useSliConfiguration('sliConfigId'));

    // THEN
    const [sliConfiguration] = result.current;
    expect(sliConfiguration).toMatchObject(mockSli.data!);
  });

  it('returns an error if sliConfigId is blank', () => {
    // Given
    const sliConfigId = '';

    // When
    const { result } = renderHook(() => useSliConfiguration(sliConfigId));
    const [, status, errors] = result.current;

    // Then
    expect(status).toEqual('rejected');
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CLIENT',
          message: expect.stringContaining('blank')
        })
      ])
    );
  });
});
