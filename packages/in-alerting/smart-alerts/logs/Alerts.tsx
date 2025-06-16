/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ThresholdConfigUnion } from '@instana/types';

import {
  alertsPath,
  alertDetailsFullyQualifiedPath,
  alertsDetailsPath,
  dashboardAlertDetailsFullPath
} from 'in-logging/navigation/paths';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { CreateLogsSmartAlertFloatingButton } from 'in-logging/navigation/createLogsSmartAlertFloatingButton';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-logging/navigation/matrix';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/logs/hooks/useSmartAlertCreateUrl';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/logs/lists/ListActionHandlers';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import LogsAlertsTabHeader from 'in-alerting/smart-alerts/logs/LogsAlertsTabHeader';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import CreateSmartAlert from 'in-alerting/smart-alerts/logs/CreateSmartAlert';
import { sortOptions } from 'in-alerting/smart-alerts/logs/lists/constants';
import { TableCellWrapper } from 'in-alerting/components/TableCellWrapper';
import ScopeColumn from 'in-alerting/smart-alerts/logs/lists/ScopeColumn';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

export default function Alerts({ isLogsDashboardHeader = false, isEventsView = false }) {
  const handlers = role?.canConfigureGlobalLogSmartAlerts ? actionHandlers : {};

  const Header = isLogsDashboardHeader ? LoggingDashboardWrapper : LogsAlertsTabHeader;

  const List = (
    <AlertBaseList<LogSmartAlertConfigWithMetadata>
      extraColumnDefinitions={getColumnDefinitions()}
      actionHandlers={handlers}
      getAlertConfigs={() => getAllAlertConfigsWithResult()}
      getSubtitle={config => getSubtitle(config.threshold)}
      sortOptions={sortOptions}
      alertsTab={isEventsView ? eventsPath : alertsPath}
      createRowLinkLocation={(config, location) => createRowLinkLocation(config, location, isLogsDashboardHeader)}
      // for carbon table
      extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
      carbonActionHandlers={handlers}
      getNameSubtitle={() => getLogSubtitle(t('in-alerting:smartAlerts.logs.logCount'))}
      displayCarbonTable={smartAlertCarbonTableEnabled}
      toolBarContent={role?.canConfigureGlobalLogSmartAlerts ? <CreateSmartAlert isListingPage /> : undefined}
      noDataHeader={t('in-alerting:smartAlerts.logs.list.noDataHeader')}
      noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.logs.list.noDataDescription" />}
      useSmartAlertCreateUrl={useSmartAlertCreateUrl}
      displayTitle={isEventsView}
    />
  );

  if (isEventsView) {
    return List;
  }

  return (
    <>
      <Header>
        <LeftRightPadding> {List} </LeftRightPadding>
        <Footer />
      </Header>
      {!smartAlertCarbonTableEnabled && <CreateLogsSmartAlertFloatingButton />}
    </>
  );
}

export function getColumnDefinitions() {
  return [
    {
      id: 'filterApplied',
      label: '',
      getContent: (entity: LogSmartAlertConfigWithMetadata) => <ScopeColumn config={entity} />
    }
  ];
}

export function getSubtitle(threshold: ThresholdConfigUnion & { value?: number }) {
  const { type, operator, value } = threshold;
  const subtitleElements = [t('in-alerting:smartAlerts.logs.list.columns.name.subtitle.staticThresholdType')];

  if (type === STATIC_THRESHOLD) {
    const formattedValue = value
      ? value !== Math.floor(value)
        ? number.forcedDetailed.detailed(value)
        : number.forcedCompact.detailed(value)
      : 0;
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
  config: LogSmartAlertConfigWithMetadata,
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
      getContent: (config: LogSmartAlertConfigWithMetadata) => (
        <TableCellWrapper>{getSubtitle(config.threshold)}</TableCellWrapper>
      ),
      sortable: false
    }
    // TODO bring this back once the bulk actions are implemented
    // {
    //   id: 'enabled',
    //   label: t('in-alerting:table.status'),
    //   getContent: (config: LogSmartAlertConfigWithMetadata) => <StatusColumnCell status={config.enabled} />,
    //   sortable: true
    // }
  ];
}

function getLogSubtitle(logLabel: string) {
  return <ListSubtitle icon="lib_application_logging" label={logLabel} />;
}
