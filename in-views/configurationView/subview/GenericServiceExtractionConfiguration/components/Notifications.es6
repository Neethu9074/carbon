import React from 'react';

import Notification from 'in-components/form/Notification';


export function LoadingRulesNotification() {
  return (
    <Notification loading>
      Loading rules
    </Notification>
  );
}

export function LoadingRulesFailedNotification() {
  return (
    <Notification failure>
      Failed to load rules
    </Notification>
  );
}

export function SavingRulesNotification() {
  return (
    <Notification loading>
      Saving rules
    </Notification>
  );
}

export function SavingRulesSuccessfulNotification() {
  return (
    <Notification success>
      Successfully saved.
    </Notification>
  );
}

export function SavingRulesFailedNotification() {
  return (
    <Notification failure>
      Failed to save rules
    </Notification>
  );
}
