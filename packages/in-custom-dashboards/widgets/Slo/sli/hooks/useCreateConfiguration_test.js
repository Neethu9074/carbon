/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import { useCreateConfiguration } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useCreateConfiguration';
import { error, success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/Slo/sli/api');

describe('in-custom-dashboards/widgets/Slo/sli/hooks/useCreateConfiguration_test.js', () => {
  it('returns a FormSubmitState object where success, saving and error are false if nothing was submitted yet', () => {
    // Given
    const mockRequestFunction = jest.fn();

    // When
    const { result } = renderHook(() => useCreateConfiguration(mockRequestFunction));
    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ success: false, saving: false, error: false });
  });

  it('returns successful FormSubmitState if creating an Sli config was successful', () => {
    // Given
    const mockRequestFunction = jest.fn();
    const mockConfig = { sliName: 'someSliName' };
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    mockRequestFunction.mockReturnValueOnce(just(success([{ code: 200 }])));

    // When
    const { result } = renderHook(() => useCreateConfiguration(mockRequestFunction));
    const [, doSubmit] = result.current;

    doSubmit({ onError: mockOnError, onSuccess: mockOnSuccess, config: mockConfig });

    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ saving: false, success: true, error: false });
    expect(mockOnSuccess).toBeCalled();
    expect(mockOnError).not.toBeCalled();
  });

  it('returns saving FormSubmitState if creating Sli config is pending', () => {
    // Given
    const mockRequestFunction = jest.fn();
    const mockConfig = { sliName: 'someSliName' };
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    mockRequestFunction.mockReturnValueOnce(just());

    // When
    const { result } = renderHook(() => useCreateConfiguration(mockRequestFunction));
    const [, doSubmit] = result.current;

    doSubmit({ onError: mockOnError, onSuccess: mockOnSuccess, config: mockConfig });

    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ saving: true, success: false, error: false });
    expect(mockOnSuccess).not.toBeCalled();
    expect(mockOnError).not.toBeCalled();
  });

  it('returns errored FormSubmitState if creating Sli config fails', () => {
    // Given
    const mockRequestFunction = jest.fn();
    const mockConfig = { sliName: 'someSliName' };
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    mockRequestFunction.mockReturnValueOnce(just(error([{ code: 404, message: 'not found' }])));

    // When
    const { result } = renderHook(() => useCreateConfiguration(mockRequestFunction));
    const [, doSubmit] = result.current;

    doSubmit({ onError: mockOnError, onSuccess: mockOnSuccess, config: mockConfig });

    const [submitState] = result.current;

    // Then
    expect(submitState).toMatchObject({ saving: false, success: false, error: true });
    expect(mockOnSuccess).not.toBeCalled();
    expect(mockOnError).toBeCalled();
  });
});
