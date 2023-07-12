/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import DashboardHeader, {
  ContextConfiguration,
  DashboardHeaderProps
} from 'in-components/DashboardHeader/DashboardHeader';
import { businessActivityPath, businessActivityDashboard, businessProcessDashboard } from 'in-bizops/navigation/paths';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import AnalyzeButton from 'in-bizops/components/AnalyzeButton';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-bizops/dashboards/activity/tabs/index';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

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
      <TabView HeaderComponent={Header} location={location} tabs={tabs} props={props} />
    </>
  );
}

function Header(props: Omit<DashboardHeaderProps, 'icon' | 'title' | 'renderButtonLine' | 'renderMetaInformation'>) {
  const location: Location = useLocation();

  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const contextConfigurations: ContextConfiguration[] = [];
  contextConfigurations.push({
    renderContext: () => businessProcessName,
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
  label: string;
  serviceId: string;
}
function RenderButtonLine({ label, serviceId }: RenderProps) {
  const timeConfig: TimeConfig = useTimeConfig();
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      <AnalyzeButton businessProcessName={label} />
    </>
  );
}
