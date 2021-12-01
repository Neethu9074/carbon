/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import { Result, SliConfigMetricConfiguration, SliConfigurationWithLastUpdated, SliEntity } from 'in-types';
import useSliConfigurations from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigurations';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/api';

jest.mock('in-custom-dashboards/api', () => {
  return {
    ...jest.requireActual('in-custom-dashboards/api'),
    getSliConfigurationsByEntity: jest.fn(),
    __esModule: true
  };
});

const getSliConfigurationsByEntityMock = getSliConfigurationsByEntity as jest.MockedFunction<
  typeof getSliConfigurationsByEntity
>;

describe('in-custom-dashboards/widgets/Slo/hooks/useSliConfigurations', () => {
  it('returns a list of SLI configurations if request is successfully resolved.', () => {
    // GIVEN
    const mockSli: Result<SliConfigurationWithLastUpdated[]> = {
      data: [
        {
          id: 'id1',
          initialEvaluationTimestamp: 123,
          metricConfiguration: {} as SliConfigMetricConfiguration,
          sliEntity: {} as SliEntity,
          sliName: 'Awesome SLI 1',
          lastUpdated: 123
        },
        {
          id: 'id2',
          initialEvaluationTimestamp: 456,
          metricConfiguration: {} as SliConfigMetricConfiguration,
          sliEntity: {} as SliEntity,
          sliName: 'Awesome SLI 2',
          lastUpdated: 123
        }
      ],
      errors: [],
      progress: { loading: false }
    };

    getSliConfigurationsByEntityMock.mockReturnValueOnce(just(mockSli));

    // WHEN
    const { result } = renderHook(() => useSliConfigurations('application', 'entityId'));

    // THEN
    const [sliConfigurations] = result.current;
    expect(sliConfigurations).toMatchObject(mockSli.data!);
  });
});
