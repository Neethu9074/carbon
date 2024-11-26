/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  AggregationType,
  HistoricBaselineConfig,
  ThresholdConfigUnion,
  WebsiteAlertConfigWithMetadata,
  WebsiteAlertRuleUnion
} from '@instana/types';

//@ts-expect-error TS migartion
import { useWebsiteData } from 'in-alerting/smart-alerts/websites/hooks/useWebsiteData';
import { alertCreated as alertCreatedMatrixParam, alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { actionHandlers } from 'in-alerting/smart-alerts/websites/list/ListActionHandlers';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import StatusColumnCell from 'in-alerting/smart-alerts/components/list/StatusColumnCell';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import CreateSmartAlert from 'in-alerting/smart-alerts/websites/CreateSmartAlert';
import { sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import ScopeColumn from 'in-alerting/smart-alerts/websites/list/ScopeColumn';
import { NumberFormatterObject } from 'in-services/formatters/number';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;

function getColumnDefinitions(websiteLabel: string) {
  return [
    {
      id: 'filters',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelFilters'),
      getContent: (entity: WebsiteAlertConfigWithMetadata) => (
        <ScopeColumn config={entity} websiteLabel={websiteLabel} />
      )
    }
  ];
}

export default function Alerts({ websiteId, websiteLabel }: { websiteId: string; websiteLabel: string }) {
  const handlers = role?.canConfigureWebsiteSmartAlerts ? actionHandlers : {};

  const websiteData = useWebsiteData();

  return (
    <>
      <AlertBaseList
        extraColumnDefinitions={getColumnDefinitions(websiteLabel)}
        getAlertConfigs={() => getAllAlertConfigs(websiteId, { asObservable: true })}
        actionHandlers={handlers}
        getSubtitle={config => getSubtitle(config.rule, config.threshold)}
        createRowLinkLocation={createRowLinkLocation}
        sortOptions={sortOptions}
        alertsTab={alertsTab}
        // for carbon table
        extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
        carbonActionHandlers={handlers}
        getNameSubtitle={() => getWebsiteSubtitle(websiteLabel)}
        displayCarbonTable={displayCarbonTable}
        toolBarContent={
          role?.canConfigureWebsiteSmartAlerts ? (
            <CreateSmartAlert
              websiteId={websiteData.websiteId ?? ''}
              tagFilters={websiteData.tagFilters}
              timeConfig={websiteData.timeConfig}
              location={websiteData.location}
              isCarbonTableView={displayCarbonTable}
            />
          ) : undefined
        }
        noDataHeader={t('in-alerting:smartAlerts.websites.list.noDataHeader')}
        noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.websites.list.noDataDescription" />}
      />

      <Footer />
    </>
  );
}

export function getSubtitle(rule: WebsiteAlertRuleUnion, threshold: ThresholdConfigUnion & { value?: number }) {
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(metricName as MetricName);
  const formattedMetricLabel =
    alertType === 'slowness' ? `${metricLabel} (${getAggregationText(aggregation)})` : metricLabel;

  const { operator, type, value } = threshold;
  if (type === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat(metricName as MetricName);
    const formattedValue = (
      (metricFormat as NumberFormatterObject).short || (metricFormat as NumberFormatterObject).compact
    )?.(value);
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    return t('in-alerting:smartAlerts.websites.list.columns.name.subtitleForStaticThreshold', {
      metricLabel: formattedMetricLabel,
      operator: humanReadableOperator,
      value: formattedValue
    });
  }

  if (type === ADAPTIVE_BASELINE) {
    return t('in-alerting:smartAlerts.websites.list.columns.name.subtitleForAdaptiveThreshold', {
      metricLabel: formattedMetricLabel
    });
  }

  if (type === HISTORIC_BASELINE) {
    const { seasonality } = threshold as HistoricBaselineConfig;
    if (seasonality === DAILY) {
      return t('in-alerting:smartAlerts.websites.list.columns.name.subtitleForStaticDailySeasonality', {
        metricLabel: formattedMetricLabel,
        aggregation: getAggregationText(aggregation as AggregationType)
      });
    }

    return t('in-alerting:smartAlerts.websites.list.columns.name.subtitleForStaticWeeklySeasonality', {
      metricLabel: formattedMetricLabel,
      aggregation: getAggregationText(aggregation as AggregationType)
    });
  }

  // Simple fallback, should not be needed, except when there was no type
  return t('in-alerting:smartAlerts.websites.list.columns.name.subtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: formattedMetricLabel
  });
}

function createRowLinkLocation(config: WebsiteAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: alertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertCreatedMatrixParam, config.created);

  return rowLinkLocation;
}

function getCarbonTableColumnDefinitions() {
  return [
    {
      id: 'triggering-action',
      label: t('in-alerting:table.triggeringAction'),
      getContent: (config: WebsiteAlertConfigWithMetadata) => <>{getSubtitle(config.rule, config.threshold)}</>,
      sortable: false
    },
    {
      id: 'enabled',
      label: t('in-alerting:table.status'),
      getContent: (config: WebsiteAlertConfigWithMetadata) => <StatusColumnCell status={config.enabled} />,
      sortable: true
    }
  ];
}

function getWebsiteSubtitle(websiteLabel: string) {
  return <ListSubtitle icon="lib_website" label={websiteLabel} />;
}
