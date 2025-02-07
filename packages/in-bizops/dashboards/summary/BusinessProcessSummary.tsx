/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import DashboardHeader, { ContextConfiguration, DashboardHeaderProps } from 'in-components/DashboardHeader';
import { businessPerspectiveDashboard, businessProcessDashboard } from 'in-bizops/navigation/paths';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
// @ts-expect-error needs TS migration
import StackButton from 'in-components/Stack/StackButton';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import AnalyzeButton from 'in-bizops/components/AnalyzeButton';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-bizops/dashboards/summary/tabs/index';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { bizopsTabClick } from 'in-bizops/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './BusinessProcessSummary.mless';

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
    <div className={locals.processSummaryDiv}>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.bizops,
          pageRootName: pageNames.bizops_process
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        tabChangeTracker={props => bizopsTabClick({ tab: props.tab, path: location.pathname })}
      />
    </div>
  );
}

function Header(props: Omit<DashboardHeaderProps, 'icon' | 'title' | 'renderButtonLine' | 'renderMetaInformation'>) {
  const { location } = useNavigation();

  const contextConfigurations: ContextConfiguration[] = [];

  const perspectiveId = getMatrixParameter(location, businessProcessDashboard, 'perspectiveId');
  if (perspectiveId) {
    contextConfigurations.push({
      renderContext: RenderBusinessProcessContext,
      contextIcon: 'lib_bizops'
    });
  }

  return (
    <DashboardHeader
      {...props}
      icon="lib_bizops"
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

  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      <StackButton
        id={businessProcessId}
        timeConfig={timeConfig}
        productArea={'businessProcess'}
        className={locals.leftButton}
        noAutoMargin
      />
      <AnalyzeButton
        businessProcessId={businessProcessId}
        businessProcessName={businessProcessName}
        businessActivityName={''}
      />
    </>
  );
}

function RenderBusinessProcessContext() {
  const { location, createHref } = useNavigation();
  location.pathname = businessPerspectiveDashboard;

  const perspectiveId =
    getMatrixParameter(location, businessProcessDashboard, 'perspectiveId') ??
    t('in-bizops:dashboards.activity.pageTitle');
  const perspectiveName =
    getMatrixParameter(location, businessProcessDashboard, 'perspectiveName') ??
    t('in-bizops:dashboards.activity.pageTitle');

  setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveId', perspectiveId);
  setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveName', perspectiveName);

  return (
    <Link href={createHref(location)} className={locals.contextLink}>
      {perspectiveName}
    </Link>
  );
}
