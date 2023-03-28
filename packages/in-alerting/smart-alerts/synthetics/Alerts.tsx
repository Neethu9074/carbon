/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAllAlertConfigs
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import {
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam
} from 'in-synthetics/navigation/matrix';
import { alertsTab, dashboardTestAlertsTabDetailsFullyQualified } from 'in-synthetics/navigation/paths';
import AlertBaseList, { TableActions } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import { SyntheticAlertConfigWithMetadata, SyntheticAlertConfig, Role } from 'in-types';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { syntheticSmartAlertsDetailsEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export interface AlertsProps {
  testId: string;
}

export const tableActions: TableActions<SyntheticAlertConfigWithMetadata> = {
  delete: {
    deleteEntity: (config: SyntheticAlertConfigWithMetadata) => deleteAlertConfig(config.id)
  },
  toggleEnabled: {
    get: (config: SyntheticAlertConfigWithMetadata) => config.enabled,
    toggle: (config: SyntheticAlertConfigWithMetadata) =>
      config.enabled ? disableAlertConfig(config.id) : enableAlertConfig(config.id)
  }
};

export default function Alerts({ testId }: AlertsProps) {
  const handlers = (role as Role).canConfigureCustomAlerts ? actionHandlers : {};

  return (
    <AlertBaseList<SyntheticAlertConfigWithMetadata>
      extraColumnDefinitions={getColumnDefinitions()}
      getAlertConfigs={() => getAllAlertConfigs(testId, { asObservable: true })}
      actionHandlers={handlers}
      tableActions={tableActions}
      getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
      createRowLinkLocation={syntheticSmartAlertsDetailsEnabled ? createRowLinkLocation : undefined}
      sortOptions={sortOptions}
    />
  );
}

function getColumnDefinitions() {
  const additionalColumn = [
    {
      id: 'timeThreshold',
      label: t('in-alerting:smartAlerts.synthetics.alertList.timeThreshold'),
      getContent: (item: SyntheticAlertConfigWithMetadata) => {
        return (
          <DefaultCell
            title={t('in-alerting:smartAlerts.synthetics.alertList.violationsCount', {
              violationsCount: item.timeThreshold.violationsCount
            })}
            subtitle={t('in-alerting:smartAlerts.synthetics.alertList.timeThreshold')}
          />
        );
      }
    },
    {
      id: 'filterApplied',
      label: t('in-alerting:smartAlerts.synthetics.alertList.filterApplied'),
      getContent: (entity: SyntheticAlertConfig) => <ScopeColumn config={entity} />
    }
  ];

  return additionalColumn;
}

function createRowLinkLocation(config: SyntheticAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: dashboardTestAlertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertCreatedMatrixParam, config.created);

  return rowLinkLocation;
}
