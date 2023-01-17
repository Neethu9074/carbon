/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import { smartAlertMigrationDocs } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import getLegacyAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getLegacyAlertConfigStats';
import { deprecatedValue } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { addMessage, Message, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { teamSettingsAlertingEvents, events } from 'in-settings/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { t, Trans } from 'in-i18n';

export default function DeprecatedCustomEventsPopUp() {
  const legacyAlertConfigStats = useObservable(getLegacyAlertConfigStats, []) ?? pendingResult;

  useEffect(() => {
    if (legacyAlertConfigStats?.data?.deprecatedCustomEvents)
      showNotification(legacyAlertConfigStats.data.deprecatedCustomEvents);
  }, [legacyAlertConfigStats]);

  return <></>;
}

export function showNotification(deprecatedCustomEvents: number) {
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
              documentationLink: smartAlertMigrationDocs
            }}
          />
        </p>
        <Link
          href$={getModifiedUrlStream(location => {
            location.pathname = teamSettingsAlertingEvents;
            setOrDeleteMatrixKey(location, events, 'type', deprecatedValue);
          })}
        >
          {t('in-events:deprecatedCustomEventGlobalPopup.affectedEventsLink')}
        </Link>
      </>
    ),
    onClick: () => {
      // LATER: follow-up PR with additional logic for recurring handling
      removeMessage(id);
    }
  };

  addMessage(message, id);
}
