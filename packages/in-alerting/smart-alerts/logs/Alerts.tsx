/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LogAlertConfigWithMetadata, ThresholdConfigUnion } from '@instana/types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { alertsPath, alertDetailsFullyQualifiedPath, alertsDetailsPath } from 'in-logging/navigation/paths';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-logging/navigation/matrix';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/logs/lists/ListActionHandlers';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import LogsAlertsTabHeader from 'in-alerting/smart-alerts/logs/LogsAlertsTabHeader';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { sortOptions } from 'in-alerting/smart-alerts/logs/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/logs/lists/ScopeColumn';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/Alerts.mless';

export default function Alerts() {
  const handlers = role?.canConfigureGlobalLogSmartAlerts ? actionHandlers : {};

  return (
    <LogsAlertsTabHeader>
      <div className={locals.wrapper}>
        <AlertBaseList<LogAlertConfigWithMetadata>
          extraColumnDefinitions={getColumnDefinitions()}
          actionHandlers={handlers}
          getAlertConfigs={() => getAllAlertConfigsWithResult()}
          getSubtitle={config => getSubtitle(config.threshold)}
          sortOptions={sortOptions}
          alertsTab={alertsPath}
          createRowLinkLocation={createRowLinkLocation}
        />
        <Footer />
      </div>
    </LogsAlertsTabHeader>
  );
}

function getColumnDefinitions() {
  return [
    {
      id: 'filterApplied',
      label: '',
      getContent: (entity: LogAlertConfigWithMetadata) => <ScopeColumn config={entity} />
    }
  ];
}

export function getSubtitle(threshold: ThresholdConfigUnion & { value?: number }) {
  const { type, operator, value } = threshold;
  const subtitleElements = [t('in-alerting:smartAlerts.logs.list.columns.name.subtitle.staticThresholdType')];

  if (type === STATIC_THRESHOLD) {
    const formattedValue = value ? number.forcedCompact.detailed(value) : '';
    const humanReadableOperator = humanReadableThresholdOperator(operator);
    subtitleElements.push(
      t('in-alerting:smartAlerts.logs.list.columns.name.subtitle.metricThresholdValue', {
        metricName: t('in-events:logSmartAlerts.logs'),
        operator: humanReadableOperator,
        value: formattedValue
      })
    );
  }

  return <>{subtitleElements.join(', ')}</>;
}

function createRowLinkLocation(config: LogAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: alertDetailsFullyQualifiedPath
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsDetailsPath, alertIdParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsDetailsPath, alertCreatedParam, config.created);
  return rowLinkLocation;
}
