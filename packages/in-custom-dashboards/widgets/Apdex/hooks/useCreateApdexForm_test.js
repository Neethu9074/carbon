/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import useCreateApdexForm from 'in-custom-dashboards/widgets/Apdex/hooks/useCreateApdexForm';

describe('in-custom-dashboards/widgets/Apdex/hooks/useCreateApdexForm', () => {
  it('returns a default form if an empty Apdex config is provided', () => {
    // Given
    const entityType = 'website';
    const entityId = 'someEntityId';
    const apdexConfig = {};

    // When
    const { result } = renderHook(() => useCreateApdexForm(apdexConfig, entityType, entityId));
    const [form] = result.current;

    // Then
    expect(form.toJS()).toMatchObject({
      apdexName: '',
      apdexEntity: {
        entityId: 'someEntityId',
        apdexType: 'website',
        beaconType: 'httpRequest',
        tagFilterExpression: [],
        threshold: undefined
      }
    });
  });

  it('returns a form with populated and modified apdexName if a Apdex config with an ID is provided', () => {
    // Given
    const entityType = 'website';
    const entityId = 'someEntityId';
    const apdexConfig = {
      id: 'someId',
      createdAt: Date.now(),
      apdexName: 'Foo Bar Apdex',
      apdexEntity: {}
    };

    // When
    const { result } = renderHook(() => useCreateApdexForm(apdexConfig, entityType, entityId));
    const [form] = result.current;

    // Then
    expect(form.toJS()).toMatchObject({
      apdexName: 'Copy of Foo Bar Apdex',
      apdexEntity: {
        entityId: 'someEntityId',
        apdexType: 'website',
        beaconType: 'httpRequest',
        tagFilterExpression: [],
        threshold: undefined
      }
    });
  });

  it('renders correctly if Apdex config has changed', () => {
    // Given
    const entityType = 'website';
    const entityId = 'someEntityId';

    // When
    const { result, rerender } = renderHook(({ apdexConfig = {} }) =>
      useCreateApdexForm(apdexConfig, entityType, entityId)
    );

    rerender({
      apdexConfig: {
        id: 'someId',
        createdAt: Date.now(),
        apdexName: 'Foo Bar Apdex',
        apdexEntity: {}
      }
    });

    const [form] = result.current;

    // Then
    expect(form.toJS()).toMatchObject({
      apdexName: 'Copy of Foo Bar Apdex',
      apdexEntity: {
        entityId: 'someEntityId',
        apdexType: 'website',
        beaconType: 'httpRequest',
        tagFilterExpression: [],
        threshold: undefined
      }
    });
  });
});
