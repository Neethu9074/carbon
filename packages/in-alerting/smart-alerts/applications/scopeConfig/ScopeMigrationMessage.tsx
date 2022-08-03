/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ScopeMigrationDetails } from '@instana/types';
import { Message } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeMigrationMessage.mless';

interface Props {
  scopeMigrationDetails: ScopeMigrationDetails;
}

export default function ScopeMigrationMessage({ scopeMigrationDetails }: Props) {
  if (!scopeMigrationDetails) {
    return null;
  }

  const iconType = scopeMigrationDetails.result === 'FULL' ? 'neutral' : 'warning';
  const scope = scopeMigrationDetails.query ? scopeMigrationDetails.query : t('in-settings:tabs.allAvailableEntities');
  return (
    <Message type={iconType} small withIcon>
      <>
        {t('in-alerting:smartAlerts.components.smartAlertDialog.scopeMigrationMessage', {
          context: scopeMigrationDetails.result
        })}
        <pre className={locals.scope}>{scope}</pre>
      </>
    </Message>
  );
}
