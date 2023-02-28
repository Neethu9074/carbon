/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { Message, addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import PopupMessage from 'in-synthetics/dashboards/global/tabs/tests/components/PopupMessage';
import { tryGet, trySet } from 'in-services/localStorage';
import { days } from 'in-services/time/time';

const localStorageKey = 'nextPopDialogReminderAfter';

export default function showNotification() {
  const id = 'synMonitoringPoP';
  const message: Message = {
    type: 'info',
    title: t('in-synthetics:dashboard.testList.popDialog.popUpDialogTitle'),
    content: <PopupMessage />,
    onClick: () => {
      removeMessage(id);
      setReminder(calculateNextOccurrence(days.toMillis(7)));
    }
  };

  addMessage(message, id);
}

export function calculateNextOccurrence(incrementInMillis: number): number {
  return Date.now() + incrementInMillis;
}

export function setReminder(timeInMillis: number) {
  trySet(localStorageKey, String(timeInMillis));
}

export function storedAlarmTimeOrNull(): number | null {
  const alarm = tryGet(localStorageKey);
  if (alarm === null) {
    return null;
  }
  try {
    return Number.parseInt(alarm, 10);
  } catch (_not_a_number) {
    return null;
  }
}

export function timeExpired() {
  const alarm = storedAlarmTimeOrNull();
  if (alarm != null) {
    return alarm <= Date.now();
  }
  return false;
}
