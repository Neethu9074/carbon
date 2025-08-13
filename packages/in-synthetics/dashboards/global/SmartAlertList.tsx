/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticAlertConfigWithMetadata } from '@instana/types';
import { Spacer } from '@instana/components';

import {
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam
} from 'in-synthetics/navigation/matrix';
import { alertsTabDetailsFullyQualified, syntheticSmartAlertsPath } from 'in-synthetics/navigation/paths';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
// eslint-disable-next-line no-restricted-imports
import { eventsPath } from 'in-events/navigation/paths';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { t, Trans } from 'in-i18n';

export default function SmartAlertList({ isEventsView = false }: { isEventsView?: boolean }) {
  const [role] = useCurrentUserRole();
  const handlers = role.canConfigureGlobalSyntheticSmartAlerts ? actionHandlers : {};
  const location = useLocation();

  const List = (
    <AlertBaseList<SyntheticAlertConfigWithMetadata>
      getAlertConfigs={() => getAllAlertConfigs('', { asObservable: true })}
      createRowLinkLocation={createRowLinkLocation}
      sortOptions={sortOptions}
      alertsTab={isEventsView ? eventsPath : syntheticSmartAlertsPath}
      extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
      carbonActionHandlers={handlers}
      getNameSubtitle={config => getSyntheticsSubtitle(config)}
      toolBarContent={role?.canConfigureGlobalSyntheticSmartAlerts ? <CreateSmartAlert /> : undefined}
      noDataHeader={t('in-alerting:smartAlerts.synthetics.alertList.noDataHeader')}
      noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.synthetics.alertList.noDataDescription" />}
      useSmartAlertCreateUrl={useSmartAlertCreateUrl}
      displayTitle={isEventsView}
    />
  );

  if (isEventsView) {
    return List;
  }

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            pagePath: location?.pathname,
            productArea: productAreas.synthetic_monitoring,
            pageRootName: pageNames.smart_alerts
          }}
        />
        {List}
        <Spacer size="gutter" />
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}

function createRowLinkLocation(config: SyntheticAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: alertsTabDetailsFullyQualified
  };

  setOrDeleteMatrixKey(rowLinkLocation, syntheticSmartAlertsPath, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, syntheticSmartAlertsPath, alertCreatedMatrixParam, config.created);
  return rowLinkLocation;
}

export function getCarbonTableColumnDefinitions() {
  return [
    {
      id: 'triggering-action',
      label: t('in-synthetics:dashboard.alertList.timeThreshold'),
      getContent: (config: SyntheticAlertConfigWithMetadata) => (
        <>
          {t('in-synthetics:dashboard.alertList.violationsCount', {
            violationsCount: config.timeThreshold.violationsCount
          })}
        </>
      ),
      sortable: false
    }
    // TODO bring this back once the bulk actions are implemented
    // {
    //   id: 'enabled',
    //   label: t('in-alerting:table.status'),
    //   getContent: (config: SyntheticAlertConfigWithMetadata) => <StatusColumnCell status={config.enabled} />,
    //   sortable: true
    // }
  ];
}

export function getSyntheticsSubtitle(config: SyntheticAlertConfigWithMetadata) {
  return (
    <ListSubtitle
      icon="lib_synthetic"
      label={t('in-synthetics:dashboard.alertList.testsCount', {
        testsCount: config.syntheticTestIds.length
      })}
    />
  );
}
