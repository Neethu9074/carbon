/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
// @ts-expect-error Module needs to be translated to TS
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
// @ts-expect-error Module needs to be translated to TS
import TabView from 'in-components/LocationAwareTabView/TabView';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { createGroupBy } from 'in-analyze/navigation/paths';
import tabs from 'in-bizops/dashboards/summary/tabs/index';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function BusinessProcessDashboard() {
  const location: Location = useLocation();
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'businessProcessName') ?? '';
  const timeConfig = useTimeConfig();

  const props = {
    businessProcessName,
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
      <TabView HeaderComponent={Header} location={location} tabs={tabs} props={props} result$={''} withProps={''} />
    </>
  );
}

function Header(props: DashboardHeaderProps) {
  return (
    <DashboardHeader
      {...props}
      icon="lib_bizops"
      title={t('in-bizops:labelBizOps')}
      label={'Business Process Name'} //Needs to get it from the backend data
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
      <AnalyzeCallsButton
        applicationId={'0fce0559eaebe9b65b13c8e9050d5060024f4586'}
        boundaryScope={''}
        timeConfig={timeConfig}
        groupBy={createGroupBy('service.name', DESTINATION)}
        syntheticCalls={''}
      />
    </>
  );
}
