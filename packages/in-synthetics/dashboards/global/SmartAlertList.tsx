/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer } from '@instana/components';

import {
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam
} from 'in-synthetics/navigation/matrix';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import CreateSmartAlert, { CreateSmartAlertButton } from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import { alertsTabDetailsFullyQualified, syntheticSmartAlertsPath } from 'in-synthetics/navigation/paths';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import { actionHandlers } from 'in-alerting/smart-alerts/synthetics/lists/ListActionHandlers';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { SyntheticAlertConfigWithMetadata, SyntheticAlertConfig, Role } from 'in-types';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { sortOptions } from 'in-alerting/smart-alerts/synthetics/lists/constants';
import ScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;

export default function SmartAlertList() {
  const handlers = (role as Role).canConfigureGlobalSyntheticSmartAlerts ? actionHandlers : {};
  const location = useLocation();
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
        <AlertBaseList<SyntheticAlertConfigWithMetadata>
          extraColumnDefinitions={extraColumnDefinitions}
          getAlertConfigs={() => getAllAlertConfigs('', { asObservable: true })}
          actionHandlers={handlers}
          getSubtitle={() => t('in-synthetics:dashboard.alertList.numberOfFailures')}
          createRowLinkLocation={createRowLinkLocation}
          sortOptions={sortOptions}
          alertsTab={syntheticSmartAlertsPath}
          renderName={config => replaceTitlePlaceholdersWithMarkup(config.name)}
          // for carbon table
          extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
          carbonActionHandlers={handlers}
          getNameSubtitle={config => getSyntheticsSubtitle(config)}
          displayCarbonTable={displayCarbonTable}
          toolBarContent={role?.canConfigureGlobalSyntheticSmartAlerts ? <CreateSmartAlertButton /> : undefined}
          noDataHeader={t('in-alerting:smartAlerts.synthetics.alertList.noDataHeader')}
          noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.synthetics.alertList.noDataDescription" />}
        />
        <Spacer size="gutter" />
      </LeftRightPadding>
      <Footer />
      {role?.canConfigureGlobalSyntheticSmartAlerts && !displayCarbonTable && (
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
