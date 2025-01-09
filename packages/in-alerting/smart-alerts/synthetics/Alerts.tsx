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
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { getCarbonTableColumnDefinitions, getSyntheticsSubtitle } from 'in-synthetics/dashboards/global/SmartAlertList';
import { alertsTab, dashboardTestAlertsTabDetailsFullyQualified } from 'in-synthetics/navigation/paths';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { Role, SyntheticAlertConfig, SyntheticAlertConfigWithMetadata } from 'in-types';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;

export interface AlertsProps {
  testId: string;
}

export default function Alerts({ testId }: AlertsProps) {
  const handlers = (role as Role).canConfigureGlobalSyntheticSmartAlerts ? actionHandlers : {};
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
        extraColumnDefinitions={extraColumnDefinitions}
        getAlertConfigs={() => getAllAlertConfigs(testId, { asObservable: true })}
        actionHandlers={handlers}
        getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
        createRowLinkLocation={createRowLinkLocation}
        sortOptions={sortOptions}
        alertsTab={alertsTab}
        renderName={config => replaceTitlePlaceholdersWithMarkup(config.name)}
        // for carbon table
        extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
        carbonActionHandlers={handlers}
        getNameSubtitle={config => getSyntheticsSubtitle(config)}
        displayCarbonTable={displayCarbonTable}
        toolBarContent={
          role?.canConfigureGlobalSyntheticSmartAlerts ? (
            <CreateSmartAlert testId={testId} isCarbonTableView={displayCarbonTable} />
          ) : undefined
        }
        noDataHeader={t('in-alerting:smartAlerts.synthetics.alertList.noDataHeader')}
        noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.synthetics.alertList.noDataDescription" />}
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
