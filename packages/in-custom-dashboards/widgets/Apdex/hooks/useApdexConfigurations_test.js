/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { getApdexConfigurationsByEntity } from 'in-custom-dashboards/widgets/Apdex/api';
import { success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/Apdex/api');

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations', () => {
  it('returns all apdex configurations for the requested entity if the request is successfully resolved', () => {
    // Given
    const response = success([
      {
        id: 'firstId',
        createdAt: Date.now(),
        apdexName: 'Stans first Apdex',
        apdexEntity: {}
      },
      {
        id: 'secondId',
        createdAt: Date.now(),
        apdexName: 'Snack vendor Apdex',
        apdexEntity: {}
      }
    ]);
    getApdexConfigurationsByEntity.mockReturnValueOnce(just(response));

    // When
    const { result } = renderHook(() => useApdexConfigurations('website', 'someId'));
    const [apdexConfigurations] = result.current;

    // Then
    expect(apdexConfigurations).toMatchObject(response.data);
  });
});
