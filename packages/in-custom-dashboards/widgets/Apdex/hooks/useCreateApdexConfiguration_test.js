/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import useCreateApdexConfiguration from 'in-custom-dashboards/widgets/Apdex/hooks/useCreateApdexConfiguration';
import { createForm } from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import { createApdexConfiguration } from 'in-custom-dashboards/widgets/Apdex/api';
import { successObservable, error } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/Apdex/api');

describe('in-custom-dashboards/widgets/Apdex/hooks/useCreateApdexConfiguration_test.js', () => {
  it('returns a FormSubmitState object where success, saving and error are false if nothing was submitted yet', () => {
    // When
    const { result } = renderHook(() => useCreateApdexConfiguration());
    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ success: false, saving: false, error: false });
  });

  it('returns successful FormSubmitState if creating a Apdex config was successful', () => {
    // Given
    const form = createForm({}, 'website', 'someId');

    const onSuccess = jest.fn();
    const onError = jest.fn();

    createApdexConfiguration.mockReturnValueOnce(
      successObservable({
        id: 'someId',
        createdAt: Date.now(),
        apdexName: 'One cool Apdex',
        apdexEntity: {}
      })
    );

    // When
    const { result } = renderHook(() => useCreateApdexConfiguration());
    const [, doSubmit] = result.current;

    doSubmit(form, onSuccess, onError);

    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ saving: false, success: true, error: false });
    expect(onSuccess).toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('returns saving FormSubmitState if creating Apdex config is pending', () => {
    // Given
    const form = createForm({}, 'website', 'someId');

    const onSuccess = jest.fn();
    const onError = jest.fn();

    createApdexConfiguration.mockReturnValueOnce(just());

    // When
    const { result } = renderHook(() => useCreateApdexConfiguration());
    const [, doSubmit] = result.current;

    doSubmit(form, onSuccess, onError);

    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ saving: true, success: false, error: false });
    expect(onSuccess).not.toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('returns errored FormSubmitState if creating Apdex config fails', () => {
    // Given
    const form = createForm({}, 'website', 'someId');

    const onSuccess = jest.fn();
    const onError = jest.fn();

    createApdexConfiguration.mockReturnValueOnce(just(error([{ code: 404, message: 'not found' }])));

    // When
    const { result } = renderHook(() => useCreateApdexConfiguration());
    const [, doSubmit] = result.current;

    doSubmit(form, onSuccess, onError);

    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ saving: false, success: false, error: true });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toBeCalled();
  });
});
