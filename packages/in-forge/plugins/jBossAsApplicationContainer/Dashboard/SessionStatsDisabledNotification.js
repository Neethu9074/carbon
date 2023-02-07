/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { Trans } from 'in-i18n';

export default function SessionStatsDisabledNotification({ snapshot }) {
  const deploymentsWithDisabledSessions = snapshot.getIn(['data', 'deploymentsWithDisabledSessions'], []);
  if (deploymentsWithDisabledSessions.size === 0 || deploymentsWithDisabledSessions.size === undefined) {
    return null;
  }

  return (
    <DashboardNotification type="warning">
      <Trans
        i18nKey="in-forge:plugins.jBossAsApplicationContainer.sessionStatsDisabledNotification"
        values={{ deploymentsAffected: deploymentsWithDisabledSessions.join(', ') }}
      />
    </DashboardNotification>
  );
}
