/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { Result, SliConfigMetricConfiguration, SliConfigurationWithLastUpdated, SliEntityUnion } from '@instana/types';
import { just } from '@instana/observables';

import useSliConfigurations from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigurations';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => {
  return {
    ...jest.requireActual('in-custom-dashboards/widgets/SloLegacy/sli/api'),
    getSliConfigurationsByEntity: jest.fn(),
    __esModule: true
  };
});

const getSliConfigurationsByEntityMock = getSliConfigurationsByEntity as jest.MockedFunction<
  typeof getSliConfigurationsByEntity
>;

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigurations', () => {
  it('returns a list of SLI configurations if request is successfully resolved.', () => {
    // GIVEN
    const mockSli: Result<SliConfigurationWithLastUpdated[]> = {
      data: [
        {
          id: 'id1',
          initialEvaluationTimestamp: 123,
          metricConfiguration: {} as SliConfigMetricConfiguration,
          sliEntity: {} as SliEntityUnion,
          sliName: 'Awesome SLI 1',
          lastUpdated: 123
        },
        {
          id: 'id2',
          initialEvaluationTimestamp: 456,
          metricConfiguration: {} as SliConfigMetricConfiguration,
          sliEntity: {} as SliEntityUnion,
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

  it('returns an error if entityType is blank', () => {
    // Given
    const entityType = '';
    const entityId = 'some Id';

    // When
    // @ts-expect-error
    const { result } = renderHook(() => useSliConfigurations(entityType, entityId));
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

  it('returns an error if entityId is blank', () => {
    // Given
    const entityType = 'website';
    const entityId = '';

    // When
    const { result } = renderHook(() => useSliConfigurations(entityType, entityId));
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
