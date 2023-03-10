/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { FailureSyntheticAlertRule, SyntheticAlertConfigWithMetadata, TagFilter } from '@instana/types';

import { syntheticAlertListPath, syntheticSmartAlertsPath } from 'in-synthetics/navigation/paths';
import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { AlertsProps } from 'in-alerting/smart-alerts/synthetics/Alerts';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { reload } from 'in-settings/components/List';
import { t } from 'in-i18n';

export default function CreateSmartAlert({ testId }: AlertsProps) {
  const alertConfig = generateAlertConfig(testId ? [testId] : []);
  const location = useLocation();
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <AlertConfigDialog
            onClose={() => {
              close();
              if (
                location.pathname.includes(syntheticAlertListPath) ||
                location.pathname.includes(syntheticSmartAlertsPath)
              ) {
                reload();
              }
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

export function generateAlertConfig(testIds?: string[]): SyntheticAlertConfigWithMetadata {
  const rule: FailureSyntheticAlertRule = {
    alertType: 'failure',
    metricName: 'status'
  };

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
    syntheticTestIds: testIds ?? [],
    tagFilterExpression,
    timeThreshold: {
      type: 'violationsInSequence',
      violationsCount: 1
    }
  };
}
