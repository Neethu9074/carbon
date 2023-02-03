/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticAlertConfigWithMetadata } from '@instana/types';

import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import AlertBaseList from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { tableActions } from 'in-alerting/smart-alerts/synthetics/Alerts';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
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
        />
      </LeftRightPadding>
      <Footer />
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
          <span>
            {item.timeThreshold.violationsCount}
            {' failures'}
          </span>
        );
      }
    },
    {
      id: 'testApplied',
      label: t('in-synthetics:dashboard.alertList.testsApplied'),
      getContent: (item: SyntheticAlertConfigWithMetadata) => {
        return (
          <span>
            {item.syntheticTestIds.length}
            {' tests'}
          </span>
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
