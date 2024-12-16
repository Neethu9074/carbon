/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { generateUniqueShortId } from '@instana/utils';

import useMonitoredEntity from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity';
import getApplication from 'in-applications/subscriptions/getApplication';
import getWebsite from 'in-websites/subscriptions/getWebsite';

jest.mock('in-applications/subscriptions/getApplication', () => {
  const { just } = require('@instana/observables');
  return {
    default: jest.fn(() => just('applicationResult')),
    __esModule: true
  };
});
jest.mock('in-websites/subscriptions/getWebsite', () => {
  const { just } = require('@instana/observables');
  return {
    default: jest.fn(() => just('websiteResult')),
    __esModule: true
  };
});

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity', () => {
  beforeEach(jest.clearAllMocks);

  it('subscribes to websites for entityType Websites', () => {
    // GIVEN
    const entityType = 'website';
    const entityId = generateUniqueShortId();

    // WHEN
    const { result } = renderHook(() => useMonitoredEntity({ entityType, entityId }));

    // THEN
    const [, status] = result.current;
    expect(status).toBe('resolved');
    expect(getWebsite).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
  });

  it('subscribes to applications for entityType Applications', () => {
    // GIVEN
    const entityType = 'application';
    const entityId = generateUniqueShortId();

    // WHEN
    const { result } = renderHook(() => useMonitoredEntity({ entityType, entityId }));

    // THEN
    const [, status] = result.current;
    expect(status).toBe('resolved');
    expect(getApplication).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
  });

  it('updates the subscription on changes to entityType', () => {
    // GIVEN
    const entityType = 'application';
    const entityId = generateUniqueShortId();

    // WHEN
    const { rerender } = renderHook(useMonitoredEntity, { initialProps: { entityType, entityId } });
    rerender({ entityId, entityType: 'website' });

    // THEN
    expect(getApplication).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
    expect(getWebsite).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
  });

  it('updates the subscription on changes to entityId', () => {
    // GIVEN
    const entityType = 'application';
    const firstEntityId = generateUniqueShortId();
    const secondEntityId = generateUniqueShortId();

    // WHEN
    const { rerender } = renderHook(useMonitoredEntity, { initialProps: { entityType, entityId: firstEntityId } });
    rerender({ entityId: secondEntityId, entityType });

    // THEN
    expect(getApplication).toHaveBeenCalledWith(expect.objectContaining({ id: firstEntityId }));
    expect(getApplication).toHaveBeenCalledWith(expect.objectContaining({ id: secondEntityId }));
  });

  it('returns an error if entityType is blank', () => {
    // Given
    const entityType = '';
    const entityId = 'someId';

    // When
    // @ts-expect-error
    const { result } = renderHook(() => useMonitoredEntity({ entityType, entityId }));
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

  it('returns an error if entitiyId is blank', () => {
    // Given
    const entityType = 'application';
    const entityId = '';

    // When
    const { result } = renderHook(() => useMonitoredEntity({ entityType, entityId }));
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
