/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import TabView from 'in-components/LocationAwareTabView/TabView';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { showUpdateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import getSyntheticTest from 'in-synthetics/subscriptions/getSyntheticTest';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { TestResponse, dummyTest } from 'in-synthetics/utils/constants';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-synthetics/dashboards/summary/tabs/index';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { getTest, updateTest } from 'in-synthetics/api';
import { Location } from 'in-stores/navigation/types';
import { SyntheticTest } from 'in-types';

import locals from './SyntheticSummary.mless';

export default function SyntheticSummaryDashboard() {
  const [count, setReloadCount] = useState(0);

  const location: Location = useLocation();
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [count]) || dummyTest;

  const props = {
    testId,
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    test,
    setReloadCount
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
        result$={getSyntheticTest({ testId: testId })}
        withProps={(result: TestResponse) => ({
          testName: get(result, ['data', 'label'])
        })}
      />
    </>
  );
}

function Header(props: DashboardHeaderProps) {
  return (
    <DashboardHeader
      {...props}
      icon={'lib_synthetic'}
      title={t('in-synthetics:dashboard.testList.mainLabel')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={RenderButtonLine}
      renderMetaInformation={RenderMetaInformation}
      showHistoricDataWarning={false}
    />
  );
}

interface RenderMetaInformationProps {
  test: TestResponse;
}

function RenderMetaInformation({ test }: RenderMetaInformationProps) {
  const isActive: boolean = test.data?.active;
  const errorCode: string = get(test.errors?.at(0), ['code']) || '';

  return errorCode === 'NOT_FOUND' ? (
    <div className={locals.metaInformation}>
      <BetaBadge />
      <span className={locals.label}>{t('in-synthetics:dashboard.testList.deleted')}</span>
    </div>
  ) : (
    <div className={locals.metaInformation}>
      <span className={locals.label}>
        {isActive ? t('in-synthetics:dashboard.testList.active') : t('in-synthetics:dashboard.testList.paused')}
      </span>
      <BetaBadge />
    </div>
  );
}

interface RenderButtonLineProps {
  test: TestResponse;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

function RenderButtonLine({ test, setReloadCount }: RenderButtonLineProps) {
  const isActive: boolean = test.data?.active;
  const errorCode: string = get(test.errors?.at(0), ['code']) || '';
  const totalLocations: number = test.data?.locations?.length ?? 0;

  function pauseOrResume(data: SyntheticTest) {
    const { active } = data;
    updateTest({ ...data, active: !active }).once(
      () => {
        setReloadCount((count: number) => ++count);
      },
      () => {
        showUpdateErrorMessage();
      }
    );
  }

  return errorCode === 'NOT_FOUND' ? (
    <Button kind="primary" disabled icon={'lib_actions_delete'}>
      {' '}
      {t('in-synthetics:dashboard.testList.deleted')}
    </Button>
  ) : (
    //If a test has no location(s) associated with it, disable Pause/Resume button
    <Button
      kind="primary"
      icon={isActive ? 'lib_actions_pause' : 'lib_actions_play'}
      onClick={() => pauseOrResume(test.data)}
      disabled={totalLocations > 0 ? false : true}
    >
      {isActive ? t('in-synthetics:dashboard.testList.pause') : t('in-synthetics:dashboard.testList.resume')}
    </Button>
  );
}
