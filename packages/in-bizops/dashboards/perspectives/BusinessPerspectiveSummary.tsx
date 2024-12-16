/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { businessPerspectiveDashboard } from 'in-bizops/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { tabs } from 'in-bizops/dashboards/perspectives/tabs';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { bizopsTabClick } from 'in-bizops/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './BusinessPerspectiveSummary.mless';

export default function BusinessPerspectiveSummary() {
  const location: Location = useLocation();
  const timeConfig = useTimeConfig();
  const perspectiveName =
    getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const props = {
    label: perspectiveName,
    viewPath: businessPerspectiveDashboard,
    timeConfig,
    boundaryScope: '',
    onChange: {},
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onBoundaryStateChange: {},
    syntheticCalls: 0,
    onSyntheticCallsStateChange: {}
  };

  const configDisabled = role?.limitedBizOpsScope;
  const filteredTabs = configDisabled ? tabs.filter(tab => tab.id != 'config') : tabs;

  return (
    <div className={locals.perspectiveSummaryDiv}>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.bizops,
          pageRootName: pageNames.bizops_perspective
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        props={props}
        tabs={filteredTabs}
        tabChangeTracker={props => bizopsTabClick({ tab: props.tab, path: location.pathname })}
      />
    </div>
  );
}

function Header() {
  const location = useLocation();

  const perspectiveName =
    getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveName') ??
    t('in-bizops:dashboards.perspectives.pageTitleDefault');

  return <DashboardHeader label={perspectiveName} title={t('in-bizops:labelPerspective')} />;
}
