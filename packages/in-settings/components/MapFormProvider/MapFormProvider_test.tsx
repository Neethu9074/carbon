/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm } from 'formalistic';
import { render } from '@testing-library/react';
import React from 'react';

import MapFormProvider, {
  MapFormContext,
  useMapFormContext
} from 'in-settings/components/MapFormProvider/MapFormProvider';

interface TestFormConsumerProps {
  id: string;
  onError: (error: string) => void;
  onSuccess: (context: MapFormContext<any>) => void;
}

function TestFormConsumer({ id, onError, onSuccess }: TestFormConsumerProps) {
  try {
    const context = useMapFormContext(id);
    onSuccess(context);
  } catch (e) {
    onError((e as unknown as Error).message);
  }
  return <></>;
}

describe('in-settings/components/MapFormProvider', () => {
  it('should use the correct form within the defined context', () => {
    // Given
    const consumerFormId = 'test-form';
    const providerFormId = consumerFormId;
    const form = createMapForm({ items: { foo: createField({ value: 'bar' }) } });
    const errorCallback = jest.fn();
    const successCallback = jest.fn();

    // When
    render(
      <MapFormProvider
        form={form}
        id={providerFormId}
        mode="new"
        updateForm={() => {
          throw new Error('not implemented');
        }}
      >
        <TestFormConsumer id={consumerFormId} onError={errorCallback} onSuccess={successCallback} />
      </MapFormProvider>
    );

    // Then
    expect(successCallback).toHaveBeenCalledWith(expect.objectContaining({ form }));
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should throw an error if consumer and provider are using different IDs', () => {
    // Given
    const consumerFormId = 'form-two';
    const providerFormId = 'form-one';
    const expectedErrorMessage = `The ID ‘${consumerFormId}’ does not match the ID of the current MapFormContext, which is ‘${providerFormId}’.`;
    const errorCallback = jest.fn();
    const successCallback = jest.fn();

    // When
    render(
      <MapFormProvider
        form={createMapForm()}
        id={providerFormId}
        mode="new"
        updateForm={() => {
          throw new Error('not implemented');
        }}
      >
        <TestFormConsumer id={consumerFormId} onError={errorCallback} onSuccess={successCallback} />
      </MapFormProvider>
    );

    // Then
    expect(errorCallback).toHaveBeenCalledWith(expectedErrorMessage);
    expect(successCallback).not.toHaveBeenCalled();
  });
});
