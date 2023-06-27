/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-synthetics/navigation/matrix';
import { alertsTab, dashboardTestAlertsTabDetailsFullyQualified } from 'in-synthetics/navigation/paths';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import { Role, SyntheticAlertConfig, SyntheticAlertConfigWithMetadata } from 'in-types';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { Location } from 'in-stores/navigation/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export interface AlertsProps {
  testId: string;
}

export default function Alerts({ testId }: AlertsProps) {
  const handlers = (role as Role).canConfigureCustomAlerts ? actionHandlers : {};
  const location = useLocation();

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Synthetics Monitoring',
          pageRootName: 'Smart Alerts List',
          pagePath: location?.pathname
        }}
      />
      <AlertBaseList<SyntheticAlertConfigWithMetadata>
        extraColumnDefinitions={extraColumnDefinitions}
        getAlertConfigs={() => getAllAlertConfigs(testId, { asObservable: true })}
        actionHandlers={handlers}
        getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
        createRowLinkLocation={createRowLinkLocation}
        sortOptions={sortOptions}
        alertsTab={alertsTab}
      />
    </>
  );
}

const extraColumnDefinitions = [
  {
    id: 'timeThreshold',
    width: '15%',
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

function createRowLinkLocation(config: SyntheticAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: dashboardTestAlertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertCreatedMatrixParam, config.created);

  return rowLinkLocation;
}
