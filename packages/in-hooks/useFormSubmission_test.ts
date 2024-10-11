/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { just } from '@instana/observables';

import useFormSubmission from 'in-hooks/useFormSubmission';
import { error, success } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';

describe('in-service-levels/hooks/useFormSubmission', () => {
  it('returns resolved state if callback was successful', () => {
    // Given
    const payload = {};
    const mockRequestFunction = jest.fn();
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    mockRequestFunction.mockReturnValueOnce(just(success([{ code: 200 }])));

    // When
    const { result } = renderHook(() => useFormSubmission(mockRequestFunction));
    const [, doSubmit] = result.current;

    act(() => doSubmit({ onError: mockOnError, onSuccess: mockOnSuccess, payload }));

    const [submitState] = result.current;

    // Then
    expect(submitState).toEqual('resolved');
    expect(mockOnSuccess).toBeCalled();
    expect(mockOnError).not.toBeCalled();
  });

  it('returns pending state if request is pending', () => {
    // Given
    const payload = {};
    const mockRequestFunction = jest.fn();
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    mockRequestFunction.mockReturnValueOnce(just(pendingResult));

    // When
    const { result } = renderHook(() => useFormSubmission(mockRequestFunction));
    const [, doSubmit] = result.current;

    act(() => doSubmit({ onError: mockOnError, onSuccess: mockOnSuccess, payload }));

    const [submitState] = result.current;

    // Then
    expect(submitState).toEqual('pending');
    expect(mockOnSuccess).not.toBeCalled();
    expect(mockOnError).not.toBeCalled();
  });

  it('returns rejected state if request fails', () => {
    // Given
    const payload = {};
    const mockRequestFunction = jest.fn();
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    mockRequestFunction.mockReturnValueOnce(just(error([{ code: 'NOT_FOUND', message: 'not found' }])));

    // When
    const { result } = renderHook(() => useFormSubmission(mockRequestFunction));
    const [, doSubmit] = result.current;

    act(() => doSubmit({ onError: mockOnError, onSuccess: mockOnSuccess, payload }));

    const [submitState] = result.current;

    // Then
    expect(submitState).toEqual('rejected');
    expect(mockOnSuccess).not.toBeCalled();
    expect(mockOnError).toBeCalled();
  });
});
