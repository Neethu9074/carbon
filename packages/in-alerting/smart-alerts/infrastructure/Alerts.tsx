/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraAlertConfigWithMetadata, ThresholdConfigUnion, InfraAlertRuleUnion } from '@instana/types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/infrastructure/lists/ListActionHandlers';
import { sortOptions } from 'in-alerting/smart-alerts/infrastructure/lists/constants';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { infraSmartAlerts } from 'in-stores/navigation/paths/mainPaths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function Alerts() {
  const handlers = role?.canConfigureCustomAlerts ? actionHandlers : {};
  return (
    <>
      <AlertBaseList<InfraAlertConfigWithMetadata>
        extraColumnDefinitions={[]}
        actionHandlers={handlers}
        getAlertConfigs={() => getAllAlertConfigsWithResult()}
        getSubtitle={config => getSubtitle(config.rule, config.threshold)}
        sortOptions={sortOptions}
        alertsTab={infraSmartAlerts}
      />
    </>
  );
}

function getSubtitle(rule: InfraAlertRuleUnion, threshold: ThresholdConfigUnion & { value?: number }) {
  const { type, operator, value } = threshold;

  if (type === STATIC_THRESHOLD) {
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    return t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitleForStaticThreshold', {
      operator: humanReadableOperator,
      value: value
    });
  }

  return t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitle', {
    aggregation: rule.aggregation,
    metricName: rule.metricName
  });
}
