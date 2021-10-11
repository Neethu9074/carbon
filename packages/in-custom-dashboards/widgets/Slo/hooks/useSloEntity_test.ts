/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { generateUniqueShortId } from '@instana/utils';

import useSloEntity from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import getApplication from 'in-applications/subscriptions/getApplication';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { pendingResult } from 'in-services/fixedObjects';

jest.mock('in-applications/subscriptions/getApplication', () => {
  const { pendingResult } = require('in-services/fixedObjects');
  const { just } = require('@instana/observables');
  return {
    default: jest.fn(() => just(pendingResult)),
    __esModule: true
  };
});
jest.mock('in-websites/subscriptions/getWebsite', () => {
  const { pendingResult } = require('in-services/fixedObjects');
  const { just } = require('@instana/observables');
  return {
    default: jest.fn(() => just(pendingResult)),
    __esModule: true
  };
});

describe('in-custom-dashboards/widgets/Slo/hooks/useSloEntity', () => {
  beforeEach(jest.clearAllMocks);

  it('subscribes to websites for entityType Websites', () => {
    // GIVEN
    const entityType = 'Websites';
    const entityId = generateUniqueShortId();

    // WHEN
    const { result } = renderHook(() => useSloEntity({ entityType, entityId }));

    // THEN
    expect(result.current).toBe(pendingResult);
    expect(getWebsite).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
  });

  it('subscribes to applications for entityType Applications', () => {
    // GIVEN
    const entityType = 'Applications';
    const entityId = generateUniqueShortId();

    // WHEN
    const { result } = renderHook(() => useSloEntity({ entityType, entityId }));

    // THEN
    expect(result.current).toBe(pendingResult);
    expect(getApplication).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
  });

  it('updates the subscription on changes to entityType', () => {
    // GIVEN
    const entityType = 'Applications';
    const entityId = generateUniqueShortId();

    // WHEN
    const { rerender } = renderHook(useSloEntity, { initialProps: { entityType, entityId } });
    rerender({ entityId, entityType: 'Websites' });

    // THEN
    expect(getApplication).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
    expect(getWebsite).toHaveBeenLastCalledWith(expect.objectContaining({ id: entityId }));
  });

  it('updates the subscription on changes to entityId', () => {
    // GIVEN
    const entityType = 'Applications';
    const firstEntityId = generateUniqueShortId();
    const secondEntityId = generateUniqueShortId();

    // WHEN
    const { rerender } = renderHook(useSloEntity, { initialProps: { entityType, entityId: firstEntityId } });
    rerender({ entityId: secondEntityId, entityType });

    // THEN
    expect(getApplication).toHaveBeenCalledWith(expect.objectContaining({ id: firstEntityId }));
    expect(getApplication).toHaveBeenCalledWith(expect.objectContaining({ id: secondEntityId }));
  });
});
