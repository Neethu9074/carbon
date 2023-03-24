/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam
} from 'in-synthetics/navigation/matrix';
import { alertsTabDetailsFullyQualified, syntheticSmartAlertsPath } from 'in-synthetics/navigation/paths';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { SyntheticAlertConfigWithMetadata, SyntheticAlertConfig, Role } from 'in-types';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import { syntheticCreateSmartAlertsUIEnabled } from 'in-services/featureFlags';
import AlertBaseList from 'in-alerting/smart-alerts/components/AlertsBaseList';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { tableActions } from 'in-alerting/smart-alerts/synthetics/Alerts';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { Location } from 'in-stores/navigation/types';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function SmartAlertList() {
  const handlers = (role as Role).canConfigureCustomAlerts ? actionHandlers : {};

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'Synthetics',
            pageRootName: 'Smart Alerts'
          }}
        />
        <AlertBaseList<SyntheticAlertConfigWithMetadata>
          extraColumnDefinitions={extraColumnDefinitions}
          getAlertConfigs={() => getAllAlertConfigs('', { asObservable: true })}
          actionHandlers={handlers}
          tableActions={tableActions}
          getSubtitle={() => t('in-synthetics:dashboard.alertList.numberOfFailures')}
          createRowLinkLocation={createRowLinkLocation}
          sortOptions={sortOptions}
        />
      </LeftRightPadding>
      <Footer />
      {syntheticCreateSmartAlertsUIEnabled && (
        <FloatingActionButtons>
          <CreateSmartAlert />
        </FloatingActionButtons>
      )}
    </Sticky>
  );
}

const extraColumnDefinitions = [
  {
    id: 'timeThreshold',
    width: '15%',
    label: t('in-synthetics:dashboard.alertList.timeThreshold'),
    getContent: (item: SyntheticAlertConfigWithMetadata) => {
      return (
        <DefaultCell
          title={t('in-synthetics:dashboard.alertList.violationsCount', {
            violationsCount: item.timeThreshold.violationsCount
          })}
          subtitle={t('in-synthetics:dashboard.alertList.timeThreshold')}
        />
      );
    }
  },
  {
    id: 'testApplied',
    label: t('in-synthetics:dashboard.alertList.testsApplied'),
    getContent: (item: SyntheticAlertConfigWithMetadata) => {
      return (
        <DefaultCell
          title={t('in-synthetics:dashboard.alertList.testsCount', {
            testsCount: item.syntheticTestIds.length
          })}
          subtitle={t('in-synthetics:dashboard.alertList.testsApplied')}
        />
      );
    }
  },
  {
    id: 'filterApplied',
    label: t('in-synthetics:dashboard.alertList.filterApplied'),
    getContent: (entity: SyntheticAlertConfig) => <ScopeColumn config={entity} />
  }
];

function createRowLinkLocation(config: SyntheticAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: alertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, syntheticSmartAlertsPath, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, syntheticSmartAlertsPath, alertCreatedMatrixParam, config.created);
  return rowLinkLocation;
}
