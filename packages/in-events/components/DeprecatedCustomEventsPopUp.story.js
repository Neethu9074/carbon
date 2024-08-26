/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import DeprecatedCustomEventsPopUp, {
  showNotification,
  useLinkToDeprecatedCustomEvents
} from 'in-events/components/DeprecatedCustomEventsPopUp';
import MessageFlyout from 'in-components/MessageFlyout';

export default {
  component: DeprecatedCustomEventsPopUp
};

export const Default = () => {
  const hrefLink = useLinkToDeprecatedCustomEvents();

  useEffect(() => {
    showNotification(1337, hrefLink);
  });

  return (
    <div>
      Intentionally empty - It holds a MessageFlyout container.
      <MessageFlyout />
    </div>
  );
};
