/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticAlertConfigWithMetadata } from '@instana/types';

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-synthetics/navigation/matrix';
import { getCarbonTableColumnDefinitions, getSyntheticsSubtitle } from 'in-synthetics/dashboards/global/SmartAlertList';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import { alertsTab, dashboardTestAlertsTabDetailsFullyQualified } from 'in-synthetics/navigation/paths';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { t, Trans } from 'in-i18n';

export interface AlertsProps {
  testId: string;
}

export default function Alerts({ testId }: AlertsProps) {
  const [role] = useCurrentUserRole();
  const handlers = role.canConfigureGlobalSyntheticSmartAlerts ? actionHandlers : {};
  const location = useLocation();
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.synthetic_monitoring,
          pageRootName: pageNames.smart_alerts,
          pagePath: location?.pathname
        }}
      />
      <AlertBaseList<SyntheticAlertConfigWithMetadata>
        getAlertConfigs={() => getAllAlertConfigs(testId, { asObservable: true })}
        createRowLinkLocation={createRowLinkLocation}
        sortOptions={sortOptions}
        alertsTab={alertsTab}
        extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
        carbonActionHandlers={handlers}
        getNameSubtitle={config => getSyntheticsSubtitle(config)}
        toolBarContent={role?.canConfigureGlobalSyntheticSmartAlerts ? <CreateSmartAlert testId={testId} /> : undefined}
        noDataHeader={t('in-alerting:smartAlerts.synthetics.alertList.noDataHeader')}
        noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.synthetics.alertList.noDataDescription" />}
        useSmartAlertCreateUrl={useSmartAlertCreateUrl}
      />
    </>
  );
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
