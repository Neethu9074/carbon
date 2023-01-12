/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import DeprecatedCustomEventsPopUp, { showNotification } from 'in-events/components/DeprecatedCustomEventsPopUp';
import MessageFlyout from 'in-components/MessageFlyout';

export default {
  component: DeprecatedCustomEventsPopUp
};

export const Default = () => {
  useEffect(() => {
    showNotification(1337);
  });

  return (
    <div>
      <MessageFlyout />
    </div>
  );
};
