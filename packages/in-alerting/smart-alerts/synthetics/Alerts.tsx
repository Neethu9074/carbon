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
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-synthetics/navigation/matrix';
import { alertsTab, dashboardTestAlertsTabDetailsFullyQualified } from 'in-synthetics/navigation/paths';
import AlertBaseList, { TableActions } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { SyntheticAlertConfigWithMetadata, SyntheticAlertConfig } from 'in-types';
import ScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { syntheticSmartAlertsDetailsEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { t } from 'in-i18n';

export interface AlertsProps {
  testId?: string;
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
  return (
    <AlertBaseList<SyntheticAlertConfigWithMetadata>
      extraColumnDefinitions={getColumnDefinitions()}
      loadEntities={() => getAllAlertConfigs(testId)}
      tableActions={tableActions}
      getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
      onRowClick={
        syntheticSmartAlertsDetailsEnabled
          ? config =>
              mutateUrl(location => {
                location.pathname = dashboardTestAlertsTabDetailsFullyQualified;
                setOrDeleteMatrixKey(location, alertsTab, alertIdMatrixParam, config.id);
                setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, config.created);
              })
          : undefined
      }
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
