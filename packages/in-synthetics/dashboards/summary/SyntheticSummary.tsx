/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useLocation } from 'react-router';
import React, { useState } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import TabView from 'in-components/LocationAwareTabView/TabView';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { showUpdateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-synthetics/dashboards/summary/tabs/index';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { dummyTest } from 'in-synthetics/utils/constants';
import { Progress, SyntheticTest } from 'in-types';
import { updateTest } from 'in-synthetics/api';
import { getTest } from 'in-synthetics/api';

export interface TestResponse {
  data: SyntheticTest;
  errors?: Error[];
  progress: Progress;
  time?: number;
}

function Header(props: DashboardHeaderProps) {
  return (
    <DashboardHeader
      {...props}
      icon={'lib_synthetic'}
      title={t('in-synthetics:dashboard.testList.mainLabel')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={RenderButtonLine}
      showHistoricDataWarning={false}
    />
  );
}

function RenderButtonLine() {
  let location = useLocation();
  const [count, setReloadCount] = useState(0);
  let testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  let test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [count]) || dummyTest;
  let isActive = test.data?.active;

  function pauseOrResume(test: SyntheticTest) {
    const { active } = test;
    updateTest({ ...test, active: !active }).once(
      () => {
        setReloadCount((count: any) => ++count);
      },
      () => {
        showUpdateErrorMessage();
      }
    );
  }

  return (
    <Button
      kind="primary"
      icon={isActive ? 'lib_actions_pause' : 'lib_actions_play'}
      onClick={() => pauseOrResume(test.data)}
    >
      {isActive ? t('in-synthetics:dashboard.testList.pause') : t('in-synthetics:dashboard.testList.resume')}
    </Button>
  );
}

export default function SyntheticSummaryDashboard() {
  const location = useLocation();
  const testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';

  const props = {
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/'))
  };
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'EUM: Synthetics',
          pageRootName: 'Synthetics Test'
        }}
      />

      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        result$={getTest(testId)}
        withProps={({ result }: any) => ({
          testName: get(result, ['data', 'label'])
        })}
      />
    </>
  );
}
