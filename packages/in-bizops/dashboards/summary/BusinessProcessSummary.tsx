/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
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

  const timeConfig = useTimeConfig();

  const props = {
    label: businessProcessName,
    viewPath: businessProcessDashboard,
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
      <TabView HeaderComponent={Header} location={location} tabs={tabs} props={props} />
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

function RenderButtonLine() {
  const timeConfig: TimeConfig = useTimeConfig();
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={'0fce0559eaebe9b65b13c8e9050d5060024f4586'}
        timeConfig={timeConfig}
      />
      {/* TODO: Implement button functionality */}
      <Button kind="primary" icon="lib_application_call" href={''}>
        {t('in-bizops:dashboards.analyzeInstancesButton')}
      </Button>
    </>
  );
}
