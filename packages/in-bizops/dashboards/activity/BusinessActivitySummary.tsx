/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import {
  businessActivityPath,
  businessActivityDashboard,
  businessProcessDashboard,
  businessProcessSummaryPath
} from 'in-bizops/navigation/paths';
import DashboardHeader, {
  ContextConfiguration,
  DashboardHeaderProps
} from 'in-components/DashboardHeader/DashboardHeader';
import { clickBizopsActivityProcessContextTracker, clickBizopsProcessActivityTabsTracker } from 'in-bizops/tracker';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import AnalyzeButton from 'in-bizops/components/AnalyzeButton';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-bizops/dashboards/activity/tabs/index';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './BusinessActivitySummary.mless';

export default function BusinessActivitySummary() {
  const location: Location = useLocation();
  const timeConfig = useTimeConfig();

  const businessActivityName: string =
    getMatrixParameter(location, businessActivityPath, 'activityName') ?? t('in-bizops:dashboards.activity.pageTitle');

  const serviceId: string = getMatrixParameter(location, businessProcessDashboard, 'serviceId') ?? '';

  const props = {
    label: businessActivityName,
    viewPath: businessActivityDashboard,
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
          pageRootName: 'Business Activity Dashboard'
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        tabChangeTracker={clickBizopsProcessActivityTabsTracker}
      />
    </>
  );
}

function Header(props: Omit<DashboardHeaderProps, 'icon' | 'title' | 'renderButtonLine' | 'renderMetaInformation'>) {
  const contextConfigurations: ContextConfiguration[] = [];
  contextConfigurations.push({
    renderContext: RenderBusinessProcessContext,
    contextIcon: 'lib_bizops'
  });

  return (
    <DashboardHeader
      {...props}
      icon=""
      title={t('in-bizops:labelBizOps')}
      renderButtonLine={RenderButtonLine}
      contextConfigurations={contextConfigurations}
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

  const businessActivityName: string =
    getMatrixParameter(location, businessActivityPath, 'activityName') ?? t('in-bizops:dashboards.activity.pageTitle');

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
        businessActivityName={businessActivityName}
      />
    </>
  );
}

function RenderBusinessProcessContext() {
  const { location, createHref } = useNavigation();

  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessActivityName: string =
    getMatrixParameter(location, businessActivityPath, 'activityName') ?? t('in-bizops:dashboards.activity.pageTitle');

  const activityTracking = {
    processId: businessProcessId,
    processName: businessProcessName,
    activityName: businessActivityName
  };

  location.pathname = businessProcessSummaryPath;

  return (
    <Link
      href={createHref(location)}
      className={locals.contextLink}
      onClick={() => clickBizopsActivityProcessContextTracker(activityTracking)}
    >
      {businessProcessName}
    </Link>
  );
}
