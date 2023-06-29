/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { HistoricBaselineConfig } from '@instana/types/typeDefinitions';
import {
  MobileAppAlertConfig,
  MobileAppAlertConfigWithMetadata,
  MobileAppAlertRuleUnion,
  ThresholdConfigUnion
} from '@instana/types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
//@ts-expect-error Needs TS migration
import { alertCreated, alertId } from 'in-mobile-apps/navigation/matrix';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/mobileApp/lists/ListActionHandlers';
import { alertsTabDetailsFullyQualified, alertsTab } from 'in-mobile-apps/navigation/paths';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { AlertsProps } from 'in-mobile-apps/MobileAppDashboard/tabs/Alerts/index';
import { sortOptions } from 'in-alerting/smart-alerts/mobileApp/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn';
import { NumberFormatterObject } from 'in-services/formatters/number';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { Location } from 'in-stores/navigation/types';
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
        createRowLinkLocation={createRowLinkLocation}
        alertsTab={alertsTab}
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

  if (type === ADAPTIVE_BASELINE) {
    return t('in-alerting:smartAlerts.mobileApp.alertList.columns.name.subtitleForAdaptiveThreshold', {
      metricLabel: formattedMetricLabel
    });
  }

  if (type === HISTORIC_BASELINE) {
    const { seasonality } = threshold as HistoricBaselineConfig;
    if (seasonality === DAILY) {
      return t('in-alerting:smartAlerts.mobileApp.alertList.columns.name.subtitleForStaticDailySeasonality', {
        metricLabel: formattedMetricLabel
      });
    }

    return t('in-alerting:smartAlerts.mobileApp.alertList.columns.name.subtitleForStaticWeeklySeasonality', {
      metricLabel: formattedMetricLabel
    });
  }

  return t('in-alerting:smartAlerts.mobileApp.alertList.columns.name.subtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: formattedMetricLabel
  });
}

function createRowLinkLocation(config: MobileAppAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: alertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertId, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertCreated, config.created);

  return rowLinkLocation;
}
