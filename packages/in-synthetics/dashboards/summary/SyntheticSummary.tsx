/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useLocation } from 'react-router';
import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import TabView from 'in-components/LocationAwareTabView/TabView';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-synthetics/dashboards/summary/tabs/index';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { dummyTest } from 'in-synthetics/utils/constants';
import { Progress, SyntheticTest } from 'in-types';
import { getTest } from 'in-synthetics/api';

export interface TestResponse {
  data?: SyntheticTest;
  errors?: Error[];
  progress: Progress;
  time?: number;
}

function Header(props: DashboardHeaderProps) {
  //Page label and title needs to be replaced with the real test label value
  const location = useLocation();
  const testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  let test: TestResponse = useObservable<any, []>(() => getTest(testId), []) || dummyTest;
  if (!test.progress.loading) {
    const label = get(test, ['data', 'label']);
    return (
      <DashboardHeader
        {...props}
        icon={'lib_synthetic'}
        title={t('in-synthetics:dashboard.testList.mainLabel')}
        label={label}
        showHistoricDataWarning={false}
      />
    );
  } else {
    return (
      <DashboardHeader
        {...props}
        icon={'lib_synthetic'}
        title={t('in-synthetics:dashboard.testList.mainLabel')}
        label={''}
        showHistoricDataWarning={false}
      />
    );
  }
}

export default function SyntheticSummaryDashboard() {
  const location = useLocation();

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

      <TabView HeaderComponent={Header} location={location} tabs={tabs} props={props} />
    </>
  );
}
