/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { FailureSyntheticAlertRule, SyntheticAlertConfigWithMetadata, TagFilter } from '@instana/types';

import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  const alertConfig = generateAlertConfig();
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <AlertConfigDialog
            onClose={() => {
              close();
            }}
            editMode={false}
            alertConfig={alertConfig}
            startWithSimpleMode
          />
        );
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.websites.addSmartAlert')}
    </FloatingActionButton>
  );
}

export function generateAlertConfig(): SyntheticAlertConfigWithMetadata {
  const rule: FailureSyntheticAlertRule = {
    alertType: 'failure',
    metricName: 'not-clear'
  };

  // LATER: use an empty tagFilter
  const tagFilterExpression: TagFilter = {
    entity: 'NOT_APPLICABLE',
    name: 'synthetic.locationId',
    type: 'TAG_FILTER',
    value: 'Hello',
    operator: 'EQUALS'
  };

  return {
    enabled: true,
    readOnly: false,
    id: '',
    created: 0,
    description: 'new config description',
    name: 'new config',
    severity: 5,
    rule,
    alertChannelIds: [],
    syntheticTestIds: [],
    tagFilterExpression,
    timeThreshold: {
      type: 'violationsInSequence',
      violationsCount: 1
    }
  };
}
