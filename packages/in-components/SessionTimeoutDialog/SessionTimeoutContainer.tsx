/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { nextIdleTimeout$, setIdleTimeoutCounter } from 'in-components/SessionTimeoutDialog/sessionTimeout';
import SessionTimeoutDialog from 'in-components/SessionTimeoutDialog/SessionTimeoutDialog';
import getSessionTimeouts from 'in-subscription/getSessionTimeouts';
import { minutes } from 'in-services/time/time';

const FIVE_MINUTES = minutes.toMillis(5);

export default function SessionTimeoutContainer() {
  useEffect(() => {
    const sessionTimeoutSubscribable = getSessionTimeouts({}).subscribe(data => {
      nextIdleTimeout$.emit(data.idleTimeout);

      if (data.idleTimeout) {
        setIdleTimeoutCounter(data.idleTimeout - Date.now());
      }
    });
    return () => sessionTimeoutSubscribable.dispose();
  }, []);

  return <SessionTimeoutDialog minDuration={FIVE_MINUTES} />;
}
