/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

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
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
// @ts-expect-error needs TS migration
import StackButton from 'in-components/Stack/StackButton';
import { bizopsTabClick, bizopsBreadcrumbClick } from 'in-bizops/tracker';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { bizopsActivityStackEnabled } from 'in-services/featureFlags';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import AnalyzeButton from 'in-bizops/components/AnalyzeButton';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-bizops/dashboards/activity/tabs/index';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './BusinessActivitySummary.mless';

export default function BusinessActivitySummary() {
  const location: Location = useLocation();
  const currentLocation = structuredClone(location);

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
      getMatrixParameter(location, businessActivityPath, 'activityName') ??
      t('in-bizops:dashboards.activity.pageTitle');

    const businessActivityId: string =
      getMatrixParameter(location, businessActivityPath, 'activityId') ?? t('in-bizops:dashboards.summary.pageTitle');

    return (
      <>
        <ApplicationEntityHealthIndicatorBehavior
          IndicatorPresenter={HealthIndicatorButtonPresenter}
          serviceId={serviceId}
          timeConfig={timeConfig}
        />
        {bizopsActivityStackEnabled && (
          <StackButton
            id={businessActivityId}
            applicationId={businessProcessId}
            timeConfig={timeConfig}
            productArea={'businessActivity'}
            className={locals.leftButton}
            noAutoMargin
          />
        )}
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
      getMatrixParameter(location, businessActivityPath, 'activityName') ??
      t('in-bizops:dashboards.activity.pageTitle');

    const trackerProps = {
      path: currentLocation.pathname,
      processId: businessProcessId,
      processName: businessProcessName,
      activityName: businessActivityName
    };

    location.pathname = businessProcessSummaryPath;

    return (
      <Link
        href={createHref(location)}
        className={locals.contextLink}
        onClick={() => bizopsBreadcrumbClick(trackerProps)}
      >
        {businessProcessName}
      </Link>
    );
  }

  return (
    <div className={locals.activitySummaryDiv}>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.bizops,
          pageRootName: pageNames.bizops_activity
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
