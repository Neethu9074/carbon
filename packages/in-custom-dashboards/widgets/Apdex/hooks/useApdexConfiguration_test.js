/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import useApdexConfiguration from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfiguration';
import { getApdexConfigurationById } from 'in-custom-dashboards/widgets/Apdex/api';
import { success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/Apdex/api');

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexConfiguration', () => {
  it('returns the requested apdex configuration if the request is successfully resolved', () => {
    // Given
    const response = success({
      id: 'firstId',
      createdAt: Date.now(),
      apdexName: 'Stans first Apdex',
      apdexEntity: {}
    });
    getApdexConfigurationById.mockReturnValueOnce(just(response));

    // When
    const { result } = renderHook(() => useApdexConfiguration('someId'));
    const [apdexConfiguration] = result.current;

    // Then
    expect(apdexConfiguration).toMatchObject(response.data);
  });

  it('returns an error if id is blank', () => {
    // Given
    const id = '';

    // When
    const { result } = renderHook(() => useApdexConfiguration(id));
    const [, status, errors] = result.current;

    // Then
    expect(status).toEqual('rejected');
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'CLIENT', message: expect.stringContaining('blank') })])
    );
  });
});
