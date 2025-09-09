/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect } from 'react';

import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { PROFILE_MENU_LOGOUT_CLICK } from 'in-services/tracking/tracking';
import { logOutTriggered$ } from 'in-services/integrations/solis';
import { noop } from 'in-services/util/function';
import http from 'in-services/http';

export const SolisLogOutListener = () => {
  const { trackCta } = useSegmentTracking();
  useEffect(() => {
    const subscription = logOutTriggered$.subscribe(event => {
      trackCta(PROFILE_MENU_LOGOUT_CLICK);

      event.preventDefault();
      http({
        maxRetries: 3,
        method: 'POST',
        url: '/auth/signOut'
      }).once(noop);
    });

    return () => {
      subscription.dispose?.();
    };
  }, [trackCta]);

  return null;
};
