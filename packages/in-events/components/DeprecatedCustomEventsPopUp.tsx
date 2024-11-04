/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import {
  APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_DOCS,
  APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_EVENTS
} from 'in-services/tracking/tracking';
import { smartAlertMigrationUrl } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import getLegacyAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getLegacyAlertConfigStats';
import { deprecatedValue } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage, Message, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { events, globalSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { tryGet, trySet } from 'in-services/localStorage';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { days } from 'in-services/time/time';
import { t, Trans } from 'in-i18n';

// initially wait 2 days until showing it the first time
const initialDelay = days.toMillis(2);

// recurrent: after 7 days
const recurringIntervalDuration = days.toMillis(7);

// can be used to check in the browser via
//localStorage.getItem('nextReminderAfter')
// or even to adjust via
// localStorage.setItem('nextReminderAfter', 9)
const localStorageKey = 'nextReminderAfter';

export function useLinkToDeprecatedCustomEvents() {
  const { location, createHref } = useNavigation();
  location.pathname = globalSettingsAlertingEvents;
  setOrDeleteMatrixKey(location, events, 'type', deprecatedValue);

  return createHref(location);
}

export default function DeprecatedCustomEventsPopUp() {
  const legacyAlertConfigStats = useObservable(getLegacyAlertConfigStats, []) ?? pendingResult;
  const storedAlarmTime = storedAlarmTimeOrNull();
  const hrefLink = useLinkToDeprecatedCustomEvents();
  const { trackCta } = useSegmentTracking();

  useEffect(() => {
    const deprecatedCustomEventsExist = legacyAlertConfigStats?.data?.deprecatedCustomEvents > 0;
    if (deprecatedCustomEventsExist) {
      if (storedAlarmTime === null) {
        setReminder(calculateNextOccurrence(initialDelay));
      } else {
        if (timeExpired()) {
          showNotification(legacyAlertConfigStats.data.deprecatedCustomEvents, hrefLink, trackCta);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyAlertConfigStats, storedAlarmTime /* trigger, when localStorage was changed */, hrefLink]);

  return null;
}

export function showNotification(deprecatedCustomEvents: number, hrefLink: string, trackCta: CtaTrackingFunction) {
  const id = 'deprecatedCustomEventsInfo';
  const message: Message = {
    type: 'warning',
    title: t('in-events:deprecatedCustomEventGlobalPopup.title', {
      deprecatedCustomEvents: number.compact(deprecatedCustomEvents)
    }),
    content: (
      <>
        <p>
          <Trans i18nKey="in-events:deprecatedCustomEventGlobalPopup.message" />
        </p>
        <p>
          <Trans
            i18nKey="in-events:deprecatedCustomEventGlobalPopup.documentationLink"
            components={{
              documentationLink: (
                <Link
                  href={smartAlertMigrationUrl}
                  external
                  onClick={() =>
                    trackCta(APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_DOCS, { deprecatedCustomEvents })
                  }
                >
                  &nbsp;
                </Link>
              )
            }}
          />
        </p>
        <Link
          href={hrefLink}
          onClick={() => trackCta(APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_EVENTS, { deprecatedCustomEvents })}
        >
          {t('in-events:deprecatedCustomEventGlobalPopup.affectedEventsLink')}
        </Link>
      </>
    ),
    onClick: () => {
      removeMessage(id);
      setReminder(calculateNextOccurrence(recurringIntervalDuration));
    }
  };

  addMessage(message, id);
}

function calculateNextOccurrence(incrementInMillis: number): number {
  return Date.now() + incrementInMillis;
}

/*
 * returns the parsed number of the expiration date from
 * the browser's localStorage if it exists
 * else
 * returns null
 */
function storedAlarmTimeOrNull(): number | null {
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

/*
 * checks and returns true
 * when an expiration date exists in the
 * browser's localStorage, and it is in the past
 */
function timeExpired() {
  const alarm = storedAlarmTimeOrNull();
  if (alarm != null) {
    return alarm <= Date.now();
  }
  return false;
}

/*
 * stores given expiration date in browser's localStorage
 */
function setReminder(timeInMillis: number) {
  trySet(localStorageKey, String(timeInMillis));
}
