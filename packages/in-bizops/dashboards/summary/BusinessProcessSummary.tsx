/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import { clickBizopsProcessTabsTracker } from 'in-bizops/tracker';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import AnalyzeButton from 'in-bizops/components/AnalyzeButton';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-bizops/dashboards/summary/tabs/index';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function BusinessProcessDashboard() {
  // Display the business process name (taken from the URL) in
  // the header of the page
  const location: Location = useLocation();
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const serviceId: string = getMatrixParameter(location, businessProcessDashboard, 'serviceId') ?? '';

  const timeConfig = useTimeConfig();

  const props = {
    label: businessProcessName,
    viewPath: businessProcessDashboard,
    serviceId: serviceId,
    timeConfig,
    boundaryScope: '',
    onChange: {},
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onBoundaryStateChange: {},
    syntheticCalls: 0,
    onSyntheticCallsStateChange: {}
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'BizOps',
          pageRootName: 'Business Process Dashboard'
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        tabChangeTracker={clickBizopsProcessTabsTracker}
      />
    </>
  );
}

function Header(props: Omit<DashboardHeaderProps, 'icon' | 'title' | 'renderButtonLine' | 'renderMetaInformation'>) {
  return (
    <DashboardHeader
      {...props}
      icon="lib_bizops"
      title={t('in-bizops:labelBizOps')}
      renderButtonLine={RenderButtonLine}
    />
  );
}

interface RenderProps {
  serviceId: string;
}
function RenderButtonLine({ serviceId }: RenderProps) {
  const timeConfig: TimeConfig = useTimeConfig();
  const location: Location = useLocation();

  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      <AnalyzeButton
        businessProcessId={businessProcessId}
        businessProcessName={businessProcessName}
        businessActivityName={''}
      />
    </>
  );
}
