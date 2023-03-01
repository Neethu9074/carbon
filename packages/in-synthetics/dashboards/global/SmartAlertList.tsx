/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticAlertConfigWithMetadata } from '@instana/types';

import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import AlertBaseList from 'in-alerting/smart-alerts/components/AlertsBaseList';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { syntheticCreateSmartAlertsUIEnabled } from 'in-services/featureFlags';
import { tableActions } from 'in-alerting/smart-alerts/synthetics/Alerts';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function SmartAlertList() {
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
          extraColumnDefinitions={getColumnDefinitions()}
          loadEntities={getAllAlertConfigs}
          tableActions={tableActions}
          getSubtitle={() => t('in-synthetics:dashboard.alertList.numberOfFailures')}
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

function getColumnDefinitions() {
  const additionalColumn = [
    {
      id: 'timeThreshold',
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
      getContent: () => {
        return <span />;
      }
    }
  ];

  return additionalColumn;
}
