/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  MobileAppAlertConfig,
  MobileAppAlertConfigWithMetadata,
  MobileAppAlertRuleUnion,
  ThresholdConfigUnion
} from '@instana/types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/mobileApp/lists/ListActionHandlers';
import { AlertsProps } from 'in-mobile-apps/MobileAppDashboard/tabs/Alerts/index';
import { sortOptions } from 'in-alerting/smart-alerts/mobileApp/lists/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertBaseList from 'in-alerting/smart-alerts/components/AlertsBaseList';
import ScopeColumn from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn';
import { NumberFormatterObject } from 'in-services/formatters/number';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function Alerts({ mobileAppId, mobileAppLabel }: AlertsProps) {
  const handlers = role?.canConfigureCustomAlerts ? actionHandlers : {};
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'MobileApp Monitoring',
          pageRootName: 'Smart Alerts List'
        }}
      />
      <AlertBaseList<MobileAppAlertConfigWithMetadata>
        extraColumnDefinitions={getExtraColumnDefinition(mobileAppLabel)}
        actionHandlers={handlers}
        getAlertConfigs={() => getAllAlertConfigsWithResult(mobileAppId)}
        getSubtitle={config => getSubtitle(config.rule, config.threshold)}
        sortOptions={sortOptions}
      />
    </>
  );
}

function getExtraColumnDefinition(mobileAppLabel: string) {
  return [
    {
      id: 'filterApplied',
      label: t('in-alerting:smartAlerts.mobileApp.alertList.filterApplied'),
      getContent: (entity: MobileAppAlertConfig) => <ScopeColumn config={entity} mobileAppLabel={mobileAppLabel} />
    }
  ];
}

function getSubtitle(rule: MobileAppAlertRuleUnion, threshold: ThresholdConfigUnion & { value?: number }) {
  const { alertType, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(metricName as MetricName);
  const formattedMetricLabel = metricLabel;
  const { type, operator, value } = threshold;

  if (type === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat(metricName as MetricName);
    const formattedValue = (
      (metricFormat as NumberFormatterObject).short || (metricFormat as NumberFormatterObject).compact
    )?.(value);
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    return t('in-alerting:smartAlerts.mobileApp.alertList.columns.name.subtitleForStaticThreshold', {
      metricLabel: formattedMetricLabel,
      operator: humanReadableOperator,
      value: formattedValue
    });
  }

  return t('in-alerting:smartAlerts.mobileApp.alertList.columns.name.subtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: formattedMetricLabel
  });
}
