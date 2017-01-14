import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';

import './Notifications.less';

const block = 'in-config-generic-ex-notification';

export function LoadingRulesNotification() {
  return (
    <span className={`${block} ${block}--has-loading-indicator`}>
      <LoadingIndicator type='dark'
                        inline
                        style={{
                          height: '17px'
                        }} />
      Loading rules
    </span>
  );
}

export function LoadingRulesFailedNotification() {
  return (
    <span className={`${block} ${block}--failure`}>
      Failed to load rules
    </span>
  );
}

export function SavingRulesNotification() {
  return (
    <span className={`${block} ${block}--has-loading-indicator`}>
      <LoadingIndicator type='dark'
                        inline
                        style={{
                          height: '17px'
                        }} />
      Saving rules
    </span>
  );
}

export function SavingRulesSuccessfulNotification() {
  return (
    <span className={`${block} ${block}--success`}>
      Successfully saved.
    </span>
  );
}

export function SavingRulesFailedNotification() {
  return (
    <span className={`${block} ${block}--failure`}>
      Failed to save rules
    </span>
  );
}
