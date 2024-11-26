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

//@ts-expect-error TS migartion
import { useGetMobileAppProps } from 'in-alerting/smart-alerts/mobileApp/hooks/useGetMobileProps';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
//@ts-expect-error Needs TS migration
import { alertCreated, alertId } from 'in-mobile-apps/navigation/matrix';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/mobileApp/lists/ListActionHandlers';
import { alertsTabDetailsFullyQualified, alertsTab } from 'in-mobile-apps/navigation/paths';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import StatusColumnCell from 'in-alerting/smart-alerts/components/list/StatusColumnCell';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import CreateSmartAlert from 'in-alerting/smart-alerts/mobileApp/CreateSmartAlert';
import { AlertsProps } from 'in-mobile-apps/MobileAppDashboard/tabs/Alerts/index';
import { sortOptions } from 'in-alerting/smart-alerts/mobileApp/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { NumberFormatterObject } from 'in-services/formatters/number';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;

export default function Alerts({ mobileAppId, mobileAppLabel }: AlertsProps) {
  const handlers = role?.canConfigureMobileAppSmartAlerts ? actionHandlers : {};

  const websiteData = useGetMobileAppProps();
  const location = useLocation();
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.websites_mobile_apps,
          pageRootName: pageNames.smart_alerts,
          pagePath: location?.pathname
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
        // for carbon table
        extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
        carbonActionHandlers={handlers}
        getNameSubtitle={() => getMobileAppSubtitle(mobileAppLabel)}
        displayCarbonTable={displayCarbonTable}
        toolBarContent={
          role?.canConfigureMobileAppSmartAlerts ? (
            <CreateSmartAlert {...websiteData} isCarbonTableView={displayCarbonTable} />
          ) : undefined
        }
        noDataHeader={t('in-alerting:smartAlerts.mobileApp.alertList.noDataHeader')}
        noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.mobileApp.alertList.noDataDescription" />}
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

export function getSubtitle(rule: MobileAppAlertRuleUnion, threshold: ThresholdConfigUnion & { value?: number }) {
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

function getCarbonTableColumnDefinitions() {
  return [
    {
      id: 'triggering-action',
      label: t('in-alerting:table.triggeringAction'),
      getContent: (config: MobileAppAlertConfigWithMetadata) => <>{getSubtitle(config.rule, config.threshold)}</>,
      sortable: false
    },
    {
      id: 'enabled',
      label: t('in-alerting:table.status'),
      getContent: (config: MobileAppAlertConfigWithMetadata) => <StatusColumnCell status={config.enabled} />,
      sortable: true
    }
  ];
}

function getMobileAppSubtitle(websiteLabel: string) {
  return <ListSubtitle icon="lib_mobile_app" label={websiteLabel} />;
}
