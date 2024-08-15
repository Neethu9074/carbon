/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import DeprecatedCustomEventsPopUp, { ShowNotification } from 'in-events/components/DeprecatedCustomEventsPopUp';
import MessageFlyout from 'in-components/MessageFlyout';

export default {
  component: DeprecatedCustomEventsPopUp
};

export const Default = () => {
  useEffect(() => {
    ShowNotification(1337);
  });

  return (
    <div>
      Intentionally empty - It holds a MessageFlyout container.
      <MessageFlyout />
    </div>
  );
};
