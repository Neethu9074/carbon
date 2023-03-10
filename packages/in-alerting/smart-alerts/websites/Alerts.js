/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import {
  websitesAlertingListAlertResumed,
  websitesAlertingListAlertPaused,
  websitesAlertingListAlertDeleted
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  getAllAlertConfigs,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { alertCreated as alertCreatedMatrixParam, alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/websites/list/ListActionHandlers';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import { sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import AlertBaseList from 'in-alerting/smart-alerts/components/AlertsBaseList';
import ScopeColumn from 'in-alerting/smart-alerts/websites/list/ScopeColumn';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { reload } from 'in-settings/components/List';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

function getColumnDefinitions(websiteLabel) {
  return [
    {
      id: 'filters',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelFilters'),
      getContent: entity => <ScopeColumn config={entity} websiteLabel={websiteLabel} />
    }
  ];
}

export default function Alerts({ websiteId, websiteLabel }) {
  const handlers = role.canConfigureCustomAlerts ? actionHandlers() : {};

  return (
    <>
      <AlertBaseList
        extraColumnDefinitions={getColumnDefinitions(websiteLabel)}
        loadEntities={() => getAllAlertConfigs(websiteId)}
        tableActions={
          role.canConfigureCustomAlerts && {
            delete: {
              dialogMessage(entity) {
                return (
                  <span>
                    <Trans
                      i18nKey="in-websites:websiteDashboard.tabs.alerts.labelConfirmRemoveAlertConfigWithName"
                      values={{ name: entity.name }}
                    />
                  </span>
                );
              },
              deleteEntity: config =>
                deleteAlertConfig(config.id).tap(() => websitesAlertingListAlertDeleted({ id: config.id }))
            },
            toggleEnabled: {
              get: config => config.enabled,
              toggle: config =>
                config.enabled
                  ? disableAlertConfig(config.id).tap(() => websitesAlertingListAlertPaused({ id: config.id }))
                  : enableAlertConfig(config.id).tap(() => websitesAlertingListAlertResumed({ id: config.id }))
            }
          }
        }
        getSubtitle={config => getSubtitle(config.rule, config.threshold)}
        pageSize={5}
        noDataMessage={t('in-websites:websiteDashboard.tabs.alerts.alertsNoDataMessage')}
        onRowClick={config =>
          mutateUrl(location => {
            location.pathname = alertsTabDetailsFullyQualified;
            setOrDeleteMatrixKey(location, alertsTab, alertIdMatrixParam, config.id);
            setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, config.created);
          })
        }
      />

      <Button kind="secondary" onClick={() => refreshSmartAlertConfigsList()}>
        Reload
      </Button>

      <AlertBaseList
        extraColumnDefinitions={getColumnDefinitions(websiteLabel)}
        getAlertConfigs={() => getAllAlertConfigs(websiteId, { asObservable: true })}
        actionHandlers={handlers}
        getSubtitle={config => getSubtitle(config.rule, config.threshold)}
        noDataMessage={t('in-websites:websiteDashboard.tabs.alerts.alertsNoDataMessage')}
        createRowLinkLocation={createRowLinkLocation}
        pageSize={5}
        sortOptions={sortOptions}
      />

      <Button kind="secondary" onClick={() => reload()}>
        Reload
      </Button>

      <Footer />
    </>
  );
}

Alerts.propTypes = {
  websiteLabel: PropTypes.string.isRequired,
  websiteId: PropTypes.string.isRequired
};

function getSubtitle(rule, threshold) {
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const formattedMetricLabel =
    alertType === 'slowness' ? `${metricLabel} (${getAggregationText(aggregation)})` : metricLabel;

  const { operator, seasonality, type, value } = threshold;
  if (type === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat(metricName);
    const formattedValue = (metricFormat.short || metricFormat.compact)(value);
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
    if (seasonality === DAILY) {
      return t('in-alerting:smartAlerts.websites.list.columns.name.subtitleForStaticDailySeasonality', {
        metricLabel: formattedMetricLabel,
        aggregation: getAggregationText(aggregation)
      });
    }

    return t('in-alerting:smartAlerts.websites.list.columns.name.subtitleForStaticWeeklySeasonality', {
      metricLabel: formattedMetricLabel,
      aggregation: getAggregationText(aggregation)
    });
  }

  // Simple fallback, should not be needed, except when there was no type
  return t('in-alerting:smartAlerts.websites.list.columns.name.subtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: formattedMetricLabel
  });
}

function createRowLinkLocation(config, location) {
  const rowLinkLocation = {
    ...location,
    pathname: alertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertCreatedMatrixParam, config.created);

  return rowLinkLocation;
}
