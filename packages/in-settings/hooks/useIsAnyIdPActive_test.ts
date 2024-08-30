/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-hooks/dom';

import { create } from '@instana/observables';

import { isAvailableCached } from 'in-settings/tabs/UserSettings/api/changePassword';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';

jest.mock('in-settings/tabs/UserSettings/api/changePassword');

const mockPasswordAuthenticationAvailable = (data: boolean) => {
  const res = create();
  res.emit({ errors: null, progress: { loading: true }, data: null });
  res.emit({
    errors: null,
    progress: { loading: false },
    data
  });
  // @ts-expect-error
  isAvailableCached.mockReturnValue(res);
};

describe('in-settings/hooks/useIsAnyIdPActive', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    isAvailableCached.mockClear();
  });

  test('should return false if invites disabled and password authentication enabled (IdP inactive)', async () => {
    await act(async () => {
      mockPasswordAuthenticationAvailable(true);
      jest.doMock('in-services/featureFlags', () => ({
        disableInvitesWithIdpEnabled: true
      }));

      renderHook(() => {
        const isAnyIdPActive = useIsAnyIdPActive();
        expect(isAnyIdPActive).toBeFalsy();
      });
    });
  });

  test('should return true if invites disabled and password authentication disabled (IdP active)', async () => {
    await act(async () => {
      mockPasswordAuthenticationAvailable(false);
      jest.doMock('in-services/featureFlags', () => ({
        disableInvitesWithIdpEnabled: true
      }));

      renderHook(() => {
        const isAnyIdPActive = useIsAnyIdPActive();
        expect(isAnyIdPActive).toBeTruthy();
      });
    });
  });

  test('should return true if invites enabled and password authentication enabled (IdP inactive)', async () => {
    await act(async () => {
      mockPasswordAuthenticationAvailable(true);
      jest.doMock('in-services/featureFlags', () => ({
        disableInvitesWithIdpEnabled: false
      }));

      renderHook(() => {
        const isAnyIdPActive = useIsAnyIdPActive();
        expect(isAnyIdPActive).toBeTruthy();
        expect(isAvailableCached).not.toHaveBeenCalled();
      });
    });
  });

  test('should return true if invites enabled and password authentication disabled (IdP active)', async () => {
    await act(async () => {
      mockPasswordAuthenticationAvailable(false);
      jest.doMock('in-services/featureFlags', () => ({
        disableInvitesWithIdpEnabled: false
      }));

      renderHook(() => {
        const isAnyIdPActive = useIsAnyIdPActive();
        expect(isAnyIdPActive).toBeTruthy();
        expect(isAvailableCached).not.toHaveBeenCalled();
      });
    });
  });
});
