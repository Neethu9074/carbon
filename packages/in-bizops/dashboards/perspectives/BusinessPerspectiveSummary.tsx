/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { clickBizopsProcessTabsTracker } from 'in-bizops/tracker';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { tabs } from 'in-bizops/dashboards/perspectives/tabs';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

export default function BusinessPerspectiveSummary() {
  const location: Location = useLocation();
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.bizops,
          pageRootName: pageNames.bizops_perspective_summary
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        props={{}}
        tabs={tabs}
        tabChangeTracker={clickBizopsProcessTabsTracker}
      />
    </>
  );
}

function Header() {
  return <DashboardHeader label="{PERSPECTIVE_NAME}" title={t('in-bizops:labelBizOps')} />;
}
