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
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { teamSettingsAlertingEvents, events } from 'in-settings/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { pendingResult } from 'in-services/fixedObjects';
import { t, Trans } from 'in-i18n';

export default function DeprecatedCustomEventsPopUp() {
  const legacyAlertConfigStats = useObservable(getLegacyAlertConfigStats, []) ?? pendingResult;

  useEffect(() => {
    if (legacyAlertConfigStats?.data?.deprecatedCustomEvents)
      showNotification(legacyAlertConfigStats.data.deprecatedCustomEvents);
  }, [legacyAlertConfigStats]);

  return <div />;
}

DeprecatedCustomEventsPopUp.showNotification = showNotification;

export function showNotification(deprecatedCustomEvents) {
  const id = 'deprecatedCustomEventsInfo';
  const message = {
    type: 'warning',
    title: t('in-events:deprecatedCustomEventGlobalPopup.title', {
      deprecatedCustomEvents
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
          href$={getModifiedUrlStream(params => {
            params.pathname = `${teamSettingsAlertingEvents}`;
            setOrDeleteMatrixKey(params, events, 'type', deprecatedValue);
          })}
        >
          {t('in-events:deprecatedCustomEventGlobalPopup.affectedEventsLink')}
        </Link>
      </>
    ),
    onClick: () => {
      // LATER: add re-curring handling here
      removeMessage(id);
    }
  };

  addMessage(message, id);
}
