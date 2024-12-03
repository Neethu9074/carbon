/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import SessionTimeoutDialog from 'in-components/SessionTimeoutDialog/SessionTimeoutDialog';
import { setIdleTimeoutCounter } from 'in-components/SessionTimeoutDialog/sessionTimeout';

export default {
  component: SessionTimeoutDialog
};

export function Default() {
  setIdleTimeoutCounter(65000); // in millis

  return (
    <div>
      <p>click on button, to start the count-down</p>
      <Button
        onClick={() => {
          setIdleTimeoutCounter(65000); // in millis
        }}
      >
        Counter
      </Button>
      <p>This will trigger the Session Timeout after 5 Seconds </p>
      <SessionTimeoutDialog minDuration={60000} />
    </div>
  );
}
