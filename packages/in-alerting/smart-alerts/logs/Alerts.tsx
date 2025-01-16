/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LogAlertConfigWithMetadata, ThresholdConfigUnion } from '@instana/types';

import {
  alertsPath,
  alertDetailsFullyQualifiedPath,
  alertsDetailsPath,
  dashboardAlertDetailsFullPath
} from 'in-logging/navigation/paths';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { CreateLogsSmartAlertFloatingButton } from 'in-logging/navigation/createLogsSmartAlertFloatingButton';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-logging/navigation/matrix';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { actionHandlers } from 'in-alerting/smart-alerts/logs/lists/ListActionHandlers';
import { CreateSmartAlertButton } from 'in-alerting/smart-alerts/logs/CreateSmartAlert';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import LogsAlertsTabHeader from 'in-alerting/smart-alerts/logs/LogsAlertsTabHeader';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { sortOptions } from 'in-alerting/smart-alerts/logs/lists/constants';
import { TableCellWrapper } from 'in-alerting/components/TableCellWrapper';
import ScopeColumn from 'in-alerting/smart-alerts/logs/lists/ScopeColumn';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/Alerts.mless';

const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;

export default function Alerts({ isLogsDashboardHeader = false }) {
  const handlers = role?.canConfigureGlobalLogSmartAlerts ? actionHandlers : {};

  const Header = isLogsDashboardHeader ? LoggingDashboardWrapper : LogsAlertsTabHeader;
  return (
    <>
      <Header>
        <div className={locals.wrapper}>
          <AlertBaseList<LogAlertConfigWithMetadata>
            extraColumnDefinitions={getColumnDefinitions()}
            actionHandlers={handlers}
            getAlertConfigs={() => getAllAlertConfigsWithResult()}
            getSubtitle={config => getSubtitle(config.threshold)}
            sortOptions={sortOptions}
            alertsTab={alertsPath}
            createRowLinkLocation={(config, location) => createRowLinkLocation(config, location, isLogsDashboardHeader)}
            // for carbon table
            extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
            carbonActionHandlers={handlers}
            getNameSubtitle={() => getLogSubtitle(t('in-alerting:smartAlerts.logs.logCount'))}
            displayCarbonTable={displayCarbonTable}
            toolBarContent={role?.canConfigureGlobalLogSmartAlerts ? <CreateSmartAlertButton /> : undefined}
            noDataHeader={t('in-alerting:smartAlerts.logs.list.noDataHeader')}
            noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.logs.list.noDataDescription" />}
          />
          <Footer />
        </div>
      </Header>
      {!displayCarbonTable && <CreateLogsSmartAlertFloatingButton />}
    </>
  );
}

export function getColumnDefinitions() {
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

function createRowLinkLocation(
  config: LogAlertConfigWithMetadata,
  location: Location,
  isLogsDashboardHeader: boolean
): Location {
  const rowLinkLocation = {
    ...location,
    pathname: isLogsDashboardHeader ? dashboardAlertDetailsFullPath : alertDetailsFullyQualifiedPath
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsDetailsPath, alertIdParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsDetailsPath, alertCreatedParam, config.created);
  return rowLinkLocation;
}

function getCarbonTableColumnDefinitions() {
  return [
    {
      id: 'triggering-action',
      label: t('in-alerting:table.triggeringAction'),
      ellipsis: '25vw',
      getContent: (config: LogAlertConfigWithMetadata) => (
        <TableCellWrapper>{getSubtitle(config.threshold)}</TableCellWrapper>
      ),
      sortable: false
    }
    // TODO bring this back once the bulk actions are implemented
    // {
    //   id: 'enabled',
    //   label: t('in-alerting:table.status'),
    //   getContent: (config: LogAlertConfigWithMetadata) => <StatusColumnCell status={config.enabled} />,
    //   sortable: true
    // }
  ];
}

function getLogSubtitle(logLabel: string) {
  return <ListSubtitle icon="lib_application_logging" label={logLabel} />;
}
