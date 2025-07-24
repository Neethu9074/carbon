/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  businessConversionConfigTabFullyQualified,
  businessConversionGoalDashboardFullyQualified,
  businessConversionSummaryTabFullyQualified
} from 'in-websites/navigation/paths';
import GoalSummary from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/GoalSummary';
import GoalConfig from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/GoalConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { bizopsTabClick } from 'in-bizops/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function ConversionGoalDetails() {
  const location = useLocation();
  const timeConfig = useTimeConfig();

  const goalName = 'Goal name placeholder';

  const props = {
    label: goalName,
    viewPath: businessConversionGoalDashboardFullyQualified,
    timeConfig,
    boundaryScope: '',
    onChange: {},
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onBoundaryStateChange: {}
  };

  function Header() {
    return (
      <DashboardHeader
        label={goalName}
        title={t('in-websites:websiteDashboard.tabs.businessMonitoring.conversionGoalSummary')}
      />
    );
  }

  return (
    <div>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.websites_mobile_apps,
          pageRootName: pageNames.bizops_business_impact
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        props={props}
        tabs={tabs}
        tabChangeTracker={props => bizopsTabClick({ tab: props.tab, path: location.pathname })}
      />
    </div>
  );
}

const tabs = [
  {
    id: 'summary',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.summaryTab'),
    path: `${businessConversionSummaryTabFullyQualified}`,
    component: GoalSummary
  },
  {
    id: 'config',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.configurationTab'),
    path: `${businessConversionConfigTabFullyQualified}`,
    component: GoalConfig
  }
];
