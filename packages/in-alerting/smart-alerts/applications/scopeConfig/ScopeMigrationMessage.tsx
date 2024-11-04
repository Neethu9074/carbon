/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ScopeMigrationDetails, MigrationResult } from '@instana/types';
import { Message } from '@instana/components';

import {
  parseQuery,
  scopeDfq,
  scopeApplication,
  scopeEverything
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeMigrationMessage.mless';

interface Props {
  scopeMigrationDetails: ScopeMigrationDetails;
}

export default function ScopeMigrationMessage({ scopeMigrationDetails }: Props): JSX.Element | null {
  if (!scopeMigrationDetails) {
    return null;
  }

  const queryApplyOn = parseQuery(scopeMigrationDetails.query).applyOn;

  const iconType = scopeMigrationDetails.result === 'FULL' ? 'neutral' : 'warning';
  const content = messageContent(scopeMigrationDetails.result, queryApplyOn);
  const showQuery = queryApplyOn === scopeDfq;

  return (
    <Message type={iconType} small withIcon fullInlineWidth>
      <>
        {content}
        {showQuery && <pre className={locals.scope}>{scopeMigrationDetails.query}</pre>}
      </>
    </Message>
  );
}

function messageContent(migrationResult: MigrationResult, queryApplyOn: string): string {
  switch (queryApplyOn) {
    case scopeEverything:
      return t('in-alerting:smartAlerts.components.smartAlertDialog.scopeMigrationMessageAllAvailableEntities');
    case scopeApplication:
      return t('in-alerting:smartAlerts.components.smartAlertDialog.scopeMigrationMessageSelectedApplications');
    default:
      return t('in-alerting:smartAlerts.components.smartAlertDialog.scopeMigrationMessage', {
        context: migrationResult
      });
  }
}
