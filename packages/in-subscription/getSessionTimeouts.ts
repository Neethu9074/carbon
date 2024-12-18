/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import createSubscription from 'in-subscription/subscription';

export default createSubscription<
  {},
  {
    sessionTimeout: number;
    idleTimeout: number; // represents the timestamp in milliseconds (UTC)
  }
>({
  eventId: 'subscribe-session-timeouts'
});
