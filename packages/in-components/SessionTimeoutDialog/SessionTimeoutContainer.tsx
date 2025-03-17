/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { nextIdleTimeout$, setIdleTimeoutCounter } from 'in-components/SessionTimeoutDialog/sessionTimeout';
import SessionTimeoutDialog from 'in-components/SessionTimeoutDialog/SessionTimeoutDialog';
import getSessionTimeouts from 'in-subscription/getSessionTimeouts';
import { minutes, hours } from 'in-services/time/time';

const FIVE_MINUTES = minutes.toMillis(5);

export default function SessionTimeoutContainer() {
  const [showModel, setShowModel] = useState(true);

  useEffect(() => {
    const sessionTimeoutSubscribable = getSessionTimeouts({}).subscribe(data => {
      nextIdleTimeout$.emit(data.idleTimeout);

      if (data.idleTimeout) {
        const idleTimeout = data.idleTimeout - Date.now();

        const testing = false;
        if (testing) {
          // it will be typically 8 hours ahead, so for testing it could be
          // temporary changed to timeout in e.g. 30 seconds
          const EIGHT_HOURS = hours.toMillis(7.98);
          setIdleTimeoutCounter(data.idleTimeout - Date.now() - EIGHT_HOURS);
          if (data.idleTimeout - Date.now() - EIGHT_HOURS < FIVE_MINUTES) {
            setShowModel(true);
          }
          return;
        }

        setIdleTimeoutCounter(idleTimeout);
        if (idleTimeout < FIVE_MINUTES) {
          setShowModel(true);
        }
      }
    });
    return () => sessionTimeoutSubscribable.dispose();
  }, []);

  return <SessionTimeoutDialog minDuration={FIVE_MINUTES} showModel={showModel} setShowModel={setShowModel} />;
}
